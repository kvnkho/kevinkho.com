---
title: Large Scale Image Processing with Spark through Fugue
seo_title: Large Scale Image Processing with Spark through Fugue
summary: How Clobotics Runs Distributed Image Processing
description: How Clobotics Runs Distributed Image Processing
slug: image_processing
author: Kevin Kho

draft: false
date: 2023-01-15T21:21:46-05:00

toc: true
---


## Background

Clobotics is a company that connects the physical and digital realms. Clobotics operates in two industries: wind power and retail. Though different, both industries benefit from Clobotics’ groundbreaking technology through the use of computer vision, artificial intelligence/machine learning, and data analytics that bring the physical world into the digital.

These technologies are applied through multiple forms, including autonomous drones, mobile apps, and IoT devices. For retail, Clobotics enables an end-to-end solution known as Smart Retail that provides Retail Insights as a Service (RIaaS). Through this, retail customers are able to access fast and accurate real-time inventory data. The power of RIaaS lets retail customers know whether a product is available at a grocery store ahead of time.

## Problem

Clobotics uses high-resolution photography and image processing to generate retail inventory data. Cameras are attached to shelves and coolers or part of a hand-held device. Raw images are then uploaded to the cloud.

The images loaded to the cloud are cropped into different segments and analyzed independently. Images are taken only when activity is detected (opening and closing of cooler door). Therefore, the number of images processed at any given time is highly variable. The high variability described above means that Clobotics needs to adopt a solution that is capable of scaling for peak volume.

![](https://miro.medium.com/v2/resize:fit:1400/0*JBOvsYd97pWqwoa7.png)

## Initial Solution

As a fast-growing startup, Clobotics, initially emphasized developing with tools that allowed for rapid iteration and production. Scalability is less of a concern when exploring product-market fit. As such, Python, Pandas, and PIL were used to crop images. Pandas is used to hold metadata such as file paths. Python is used to access the latest image via an API, and PIL is used to load the images, crop them, and save the output back to cloud storage for further processing. An example of what this data looks like can be found below.

![](https://miro.medium.com/v2/resize:fit:1400/1*0ush53VFAlGbT-iIPZjrLw.png)

To parallelize locally, tools like  [pandarellel](https://github.com/nalepae/pandarallel)  and the native Python multiprocessing pool were used. However, the problem is that these tools are limited to a single machine. In order to support the highly variable number of images coming in, Spark was explored for its autoscaling capabilities. By using a cluster, the processing can be done distributedly, making the architecture a better fit for burst-type workloads.

The problem was how to migrate over the existing code to be compatible with Spark.

## Bringing Code to Spark with Fugue

Making code compatible to run on top of Spark requires significant rewrites and a lot of additional boilerplate code. Thus, the Clobotics team looked for solutions that would simplify porting code over.  [Koalas](https://github.com/databricks/koalas)  provides a Pandas API on top of Spark, but Clobotics problems were not confined to the Pandas semantics, especially the API requests and image processing portions.

The team eventually settled on  [Fugue](https://github.com/fugue-project/fugue/), an abstraction layer that allows users to port Python, Pandas, and SQL code to distributed computing frameworks (Spark, Dask, or Ray). Fugue reduces migration effort and is minimally invasive, often just needing a few additional lines of code to port over. Using Fugue allowed Clobotics to re-use most of the same code to scale to Spark.

Below is a highly simplified example of the workflow Clobotics uses. The DataFrame above is converted to a list of dictionaries (with some helper code), and each row is processed independently. For each row, the API is hit to retrieve the image, and then it is processed and uploaded to cloud storage. In reality, there is some more logic to prevent the re-downloading of images along with some metadata handling. The code has been trimmed for clarity.

```python

import requests
from typing import Any, Dict, Iterable
from PIL import Image
from io import BytesIO

def transform_img(df: List[Dict[str, Any]]) -> Iterable[str, Any]:
    for row in df:
        try:
            response = requests.get(row["ImgUrl"], timeout=5)
            img = Image.open(BytesIO(response.content))
            xmin = float(row["xmin"]) * img.width
            xmax = float(row["xmax"]) * img.width
            ymin = float(row["ymin"]) * img.height
            ymax = float(row["ymax"]) * img.height
            img = img.crop((xmin, ymin, xmax, ymax))

            # logic to save image to cloud storage
            
            yield row
        except Exception as e:
            logger.error(e)
            yield row
            
  results = transform_img(df.to_dict("records"))
```

This code runs on Pandas and Python. In order to bring it to Spark, all we have to do is add a couple of lines of code to use Fugue.

```python
from fugue import transform
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()
results = transform(df, 
                    transform_img,
                    schema="*",
                    engine=spark)
```

Here we used the Fugue  `transform()`function to port  `transform_img()`to Spark. We passed in  `spark`  as the engine to indicate that the DataFrame should be converted and the operation should run on top of Spark. If no engine is passed, the operation will run on Pandas. This allows for quick iteration before bringing the work to Spark, which can be slow to spin up. Notice that Fugue can also parse the type annotations of the Python function and apply the necessary conversions to bring it to Spark.

## FugueSQL for End-to-end Workflows

The other part of using Fugue is that it has a SQL interface. The above example is heavily simplified, but the real scenario often has joins with metadata, which is easier to express in SQL than in Python. FugueSQL is a modified SQL interface that allows users to invoke Python functions.

For example, in order to quickly test our Python code, we could use the  [DuckDB](https://duckdb.org/docs/)  engine, as seen below. The  `TRANSFORM`  keyword will invoke the Python function.

![](https://miro.medium.com/v2/resize:fit:1400/1*1GBHpbHCz07dJYjEy0oGWw.png)

Similar to the Fugue  `transform()`  , all we need to do to bring this to Spark for the full data is to use  `%%fsql spark`  at the top instead. The query will then run on top of SparkSQL and Pyspark.

## Conclusion

As a fast-growing startup, leveraging an abstraction layer gives Clobotics the flexibility to scale already existing code with minimal re-writes. Having a codebase that is compatible with both Pandas and Spark allows for these key benefits:

-   The overhead to maintain the codebase is much smaller because there is no dependency on Spark, which adds a lot of boilerplate code.
-   As Clobotics continues to refine algorithms, it becomes much faster to iterate on the local setting before bringing the code to Spark. Fugue allows changing engines with just one line of code change.
-   The flexibility of having an end-to-end SQL interface allows developers to choose the best tool for the job. For workflows that require a lot of joins, the end-to-end pipeline can be done in FugueSQL because of the enhanced FugueSQL interface.

## Resources

For more resources, check the following links:

1.  [Clobotics](https://clobotics.com/)
2.  [Fugue in 10 minutes](https://fugue-tutorials.readthedocs.io/tutorials/quick_look/ten_minutes.html)
3.  [FugueSQL in 10 minutes](https://fugue-tutorials.readthedocs.io/tutorials/quick_look/ten_minutes_sql.html)