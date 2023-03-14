---
title: Using Pandera on Spark for Data Validation through Fugue
seo_title: Using Pandera on Spark for Data Validation through Fugue
summary: How to bring Pandas libraries to Spark and Dask with Fugue
description: How to bring Pandas libraries to Spark and Dask with Fugue
slug: validation_with_pandera_and_fugue
author: Kevin Kho

draft: false
date: 2021-05-08T21:21:46-05:00

toc: true
---
*This article is a bit old and there is now a [simpler way](https://pandera.readthedocs.io/en/stable/fugue.html) to the validation*

![](https://miro.medium.com/v2/resize:fit:1400/0*bwKZDOhJvF9pSfcN)

Photo by  [EJ Strat](https://unsplash.com/@xoforoct?utm_source=medium&utm_medium=referral)  on  [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral)

## Data Validation

Data validation is having checks in place to make sure that data comes in the format and specifications that we expect. As data pipelines become more interconnected, the chances of changes unintentionally breaking other pipelines also increase. Validations are used to guarantee that upstream changes will not break the integrity of downstream data operations. Common data validation patterns include checking for NULL values or checking data frame shape to ensure transformations don’t drop any records. Other frequently used operations are checking for column existence and schema. Using data validation avoids silent failures of data processes where everything will run successfully but provide inaccurate results.

Data Validation can be placed at the start of the data pipeline to make sure that any transformations happen smoothly, and it can also be placed at the end to make sure everything is working well before output gets committed to the database. This is where a tool like  [Pandera](https://github.com/pandera-dev/pandera)  can be used. For this post, we’ll make a small Pandas DataFrame to show examples. There are three columns, State, City, and Price.

```python
import pandas as pd

df = pd.DataFrame({'State': ['FL','FL','FL','CA','CA','CA'],
                    'City': ['Tampa', 'Orlando', 'Miami', 'Oakland', 'San Francisco', 'San Jose'],
                    'Price': [8, 12, 10, 16, 20, 16]})
```

![](https://miro.medium.com/v2/resize:fit:804/1*iVnmnzO7pUdtRZtbAaddpA.png)

## Pandera

[Pandera](https://pandera.readthedocs.io/en/stable/)  is a lightweight data validation framework with a lot of built-in validators to validate DataFrame schema and values. It provides informative errors when validations fail and it is also non-invasive to code that is already written since  [decorators](https://pandera.readthedocs.io/en/stable/decorators.html)  can be used with other functions to perform validation. Below is how we would check our data to make sure the  **Prices**  are reasonable before pushing it to production.

```python
import pandera as pa

price_check = pa.DataFrameSchema({
	"Price": pa.Column(pa.Int, pa.Check.in_range(min_value=5,max_value=20)),
})

# schema: *
def price_validation(df:pd.DataFrame) -> pd.DataFrame:
	price_check.validate(df)
	return df

price_validation(df)
```

The Pandera code is intuitive. Lines 3–5 define the check that is performed on the  **Column**. We are checking that the Price value is between 5 and 20. Lines 7–10 are just a wrapper function (for later purposes), but all we really need is to call the  **validate**  method in line 9 to apply the validation.

## The Need for Spark (or Dask)

What do we do if the data size becomes too big for Pandas to handle efficiently (more than 15GB)? We would need to use a distributed computing framework in order to speed up our work. This is where Spark and Dask come in. Compute operations are performed across a cluster of machines as opposed to just a single machine.

In a lot of cases, we already have logic written out for Pandas, but want to bring it to Spark. An example use case is having a very specific and large validation schema written out. We would need to recreate that functionality in Spark. Unfortunately, Pandera is only available for Pandas meaning we’d need to recreate from scratch.  **The problem is that tailored business logic would need two implementations for Pandas and Spark.**

## Introduction to Fugue

This brings us to Fugue. Fugue is an abstraction layer that allows users to port Python or Pandas code to Spark or Dask. Logic is decoupled from execution, and users can choose the engine they need just by changing one line of code. We can bring the Pandas-specific logic above to Spark with the following code. Note everything before line 12 was copied from the earlier Pandera code snippet.

```python
import pandera as pa

price_check = pa.DataFrameSchema({
	"Price": pa.Column(pa.Int, pa.Check.in_range(min_value=5,max_value=20)),
})

# schema: *
def price_validation(df:pd.DataFrame) -> pd.DataFrame:
	price_check.validate(df)
	return df

from fugue import FugueWorkflow
from fugue_spark import SparkExecutionEngine

with FugueWorkflow(SparkExecutionEngine) as dag:
	df = dag.df(df).transform(price_validation)
	df.show()
```

The  **FugueWorkflow**  class in line 15 takes in an execution engine. If nothing is passed, the default is to use Pandas. In this specific example, we pass the  **SparkExecutionEngine**, which executes all of our logic in Spark. The  **price_validation**  function gets mapped to the Spark partitions. This will speed up validation operations on bigger datasets.

## Validation by Partition

There is one current shortcoming of the current data validation frameworks. For the data we have, the price ranges of CA and FL are drastically different. Because the validation is applied per column, we don’t have a way to specify different price ranges for each location. It would be ideal however if we could apply a different check for each group of data. This is what we call  **validation by partition**.

This operation becomes very trivial to perform with Fugue. We can modify the example above slightly to achieve this. In the code snippet below, lines 6 to 12 are just two versions of the previous validation. One is for FL, and one is for CA. We package them into a dictionary in line 14.

```python
import pandera as pa
from pandera import Column, Check, DataFrameSchema
from fugue import FugueWorkflow
from fugue_spark import SparkExecutionEngine

price_check_FL = pa.DataFrameSchema({
	"Price": Column(pa.Float, Check.in_range(min_value=7,max_value=13)),
})

price_check_CA = pa.DataFrameSchema({
	"Price": Column(pa.Float, Check.in_range(min_value=15,max_value=21)),
})

price_checks = {'CA': price_check_CA, 'FL': price_check_FL}

# schema: *
def price_validation(df:pd.DataFrame) -> pd.DataFrame:
	location = df['State'].iloc[0]
	check = price_checks[location]
	check.validate(df)
	return df

with FugueWorkflow(SparkExecutionEngine) as dag:
	df = dag.df(df).partition(by=["State"]).transform(price_validation)
	df.show()
```

Our  **price_validation**  function is also tweaked a bit. First, our function is now written with the assumption that the DataFrame that comes in only contains 1 State (CA or FL). We pull the location from the State value of the first row, find the appropriate validation from the dictionary, and apply it.

The other change is that line 24 now partitions the data by State before validation. This basically means that the Spark DataFrame is being split into smaller Pandas DataFrames, and the operation is applied separately on each one. The  **price_validation**  function gets called once for the CA data, and once for the FL data. This validation is done in parallel through the Spark Execution engine.

## Conclusions

In this blog post, we have briefly gone over what data validation is. We saw the Pandera library as a way to perform data validation. Since the library is only available in Pandas, we brought it to Spark using Fugue, an abstraction layer that lets users port Python and Pandas code to Spark and Dask. With Fugue, we can apply Python/Pandas packages on each partition of data, which allowed us to perform  **validation by partition**  here.

Fugue can bring other Pandas-based libraries into Spark as well. This example is just specific to data validation. For more information, check the resources below.

## Resources

If you’re interested in using Fugue, want to give us feedback, or have any questions, we’d be happy to chat on Slack! We are also giving more detailed workshops to data teams interested in applying Fugue in their data workflows.

[Pandera](https://github.com/pandera-dev/pandera)

## Fugue

* [Documentation](https://fugue-tutorials.readthedocs.io/)  
* [Git repo](https://github.com/fugue-project/fugue)  
* [Community Slack](http://slack.fugue.ai)