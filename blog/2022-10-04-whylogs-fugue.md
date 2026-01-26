---
slug: data-profiling-whylogs-fugue
title: Large Scale Data Profiling with whylogs and Fugue on Spark, Ray or Dask
authors: [kevin]
tags: [fugue, whylogs, data-profiling, spark, dask, ray]
---

Profiling large-scale data for use cases such as anomaly detection, drift detection, and data validation.

<!-- truncate -->

## Motivation

Data pipelines have the potential to produce unexpected results in a variety of ways. Anomalous data can cause data to be scaled incorrectly. Machine learning model drift can lead to reduced prediction accuracy. Failures in the upstream collection could cause null values as the data pipeline executes. **How do we safeguard against these failure cases?**

One way to monitor the data quality is data validation. Tools such as [Pandera](https://github.com/unionai-oss/pandera) and [Great Expectations](https://github.com/great-expectations/great_expectations) allow data practitioners to establish a pre-defined set of rules. For example, we can check the existence of columns in a dataset or if an important feature contains null values.

Though this sounds good in theory, it requires us to know many things about the data beforehand. **We need a more general set of profiling tools that can extend to applications like data validation, drift detection, and anomaly detection.**

## Introducing whylogs

This is where [whylogs](https://github.com/whylabs/whylogs) comes in. **whylogs is an open-source data logging framework that lets us profile our data with minimal overhead.** The problems mentioned above: anomaly detection, drift detection, and data quality checks can all be addressed if we have good profiles on our data.

With whylogs, users can profile their data by adding a few lines of code:

```python
import pandas as pd
data = {
    "animal": ["cat", "hawk", "snake", "cat"],
    "legs": [4, 2, 0, 4],
    "weight": [4.3, 1.8, 1.3, 4.1],
}

df = pd.DataFrame(data)

import whylogs as why

profile = why.log(df).profile()
```

The profile contains:
- Total record count
- Null record count
- Inferred types of the values in the column
- Estimated cardinality
- Frequent values
- Distribution metrics such as max, min, and quantiles

whylogs profile design has three important properties: efficient, customizable, and mergeable. The more important property is the mergability. Profiles of smaller pieces of a DataFrame can be added together to form a global dataset profile.

## Scaling to Big Data with Fugue

**whylogs is designed to scale its data logging to big data.** We can use the Fugue integration to run the profiling distributedly. They also have integrations with Kafka and Feast among others.

The open-source [Fugue project](https://github.com/fugue-project/fugue/) takes Python, Pandas, or SQL code and brings it to **Spark, Dask, or Ray**. Using whylogs on top of Fugue allows us to maintain the same simple interface to generate profiles:

```python
from whylogs.api.fugue import fugue_profile

fugue_profile(pandas_df).to_pandas()
```

This is still running on the top of Pandas engine. To bring it to Spark, we can pass in a SparkSession as the `engine`:

```python
from whylogs.api.fugue import fugue_profile
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()
fugue_profile(spark_df, engine=spark)
```

## Profiling Logical Partitions

When dealing with big data, one of the more common use cases is profiling the logical partitions of the data:

```python
fugue_profile(spark_df, partition={"by":["a","b"]}, engine=spark_session)
```

This will return an output where the last column is a serialized profile. **Operating on the profiles allows us to store and analyze a significantly smaller volume of data.**

## The Use of Data Profiles

With data profiles in place, we can apply them to different use cases.

**Anomaly Detection** - For new data that consistently comes in monthly, we could run the profile every month and store these profiles. We can then compare values at the different quantiles across the profiles with metrics such as z-score.

**Data Quality** - There is a missing data count included in the profiles. Cardinality can also help when looking for columns with more categories than there should be.

**Drift Detection** - We can determine if we need to retrain our machine learning model by monitoring the distributions of the data coming in.

## Conclusion

In this article, we talked about a family of problems that can be solved with data profiling. **Anomaly detection, drift detection, and data quality problems sometimes need to be tackled without prior knowledge of the data. Data profiles are a very general approach to handling these in an unsupervised manner.**

whylogs is especially powerful because it is designed to be lightweight and scale to big data. Using the Fugue integration, whylogs can be used on top of Spark, Dask, and Ray easily to run profiling on top of a cluster.

## Resources

1. [whylogs repo](https://github.com/whylabs/whylogs)
2. [whylogs docs](https://whylogs.readthedocs.io/en/latest/)
3. [Fugue repo](https://github.com/fugue-project/fugue/)
4. [Fugue tutorials](https://fugue-tutorials.readthedocs.io/)
