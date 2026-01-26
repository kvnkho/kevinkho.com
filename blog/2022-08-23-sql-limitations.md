---
slug: sql-interfaces-suboptimal-distributed-computing
title: Why SQL-Like Interfaces are Sub-optimal for Distributed Computing
authors: [kevin]
tags: [fugue, sql, spark, distributed-computing]
---

Examining the limitations of the SQL interface for distributed computing workflows.

<!-- truncate -->

*Written by Kevin Kho and Han Wang*

*This is a written version of our Spark Data + AI Summit talk.*

## SQL-like Frameworks for Distributed Computing

In our last article, we talked about the limitations of using the Pandas interface for distributed computing. Some people quickly assumed that we are pro-SQL, but that is not exactly true either. Here, we'll look at traditional SQL and the pain points of using it as the grammar for big data workflows.

The data community is often polarized between SQL versus Python. People who love the functional interface Pandas and Spark provide are often quick to point out how SQL can't do more complicated transformations or require many more lines of code. On the other hand, SQL users find SQL to be more expressive as a language. In the last section of this article, we'll show that these tools are not mutually exclusive and we can leverage them together seamlessly through [Fugue](https://github.com/fugue-project/fugue/).

## SQL is Often Sandwiched by Python Code

When we talk about SQL in this article, we are referring to tools such as [DuckDB](https://duckdb.org/), or for big data, tools like [SparkSQL](https://spark.apache.org/sql/) and [dask-sql](https://dask-sql.readthedocs.io/en/latest/).

But even if these SQL interfaces exist, they are often invoked in between Python code. Python code is still needed to perform a lot of the transformations or loading of the DataFrame and for post-processing after the SQL query. This is because standard SQL doesn't have the grammar to express a lot of the operations distributed computing users perform.

## Problem 1: Traditional SQL Lacks Grammar for Distributed Computing

Distributed computing uses lazy evaluation, meaning operations are only computed when needed. A side effect of this is that intermediate tables can potentially be recomputed multiple times.

The recomputation can be avoided by explicitly calling `.persist()` on the Spark DataFrame. But how do we persist when using the SparkSQL interface? There is no `PERSIST` keyword. We need to break the SQL query apart and invoke the persist call using Python before downstream portions of the query.

**The lack of grammar to represent these prevent us from fully utilizing the distributed computing engine unless we bring the logic back to Python.**

## Problem 2: SQL Traditionally Returns a Single Table

A **SQL query is associated with a single return.** It is single-task oriented, limiting the surface area of possible operations. For example, splitting a DataFrame into two separate DataFrames is commonly used in machine learning (train-test split). This becomes impossible without breaking up a query into multiple queries.

## Problem 3: SQL Introduces a Lot of Boilerplate Code

Another downside with SQL is that it introduces a lot of boilerplate code. SQL practitioners often have to deal with queries that are hundreds of lines long. **The amount of boilerplate code present detracts from being able to read the business logic spelled out by the query.**

## Problem 4: Modifications Create Framework Lock-in

SparkSQL enabled reading from parquet files with a modified syntax:

```sql
FROM parquet.`/tmp/t.parquet`
```

This is actually a Spark-specific syntax, which helps Spark users, but it creates framework lock-in.

## FugueSQL — An Enhanced SQL Interface For Compute Workflows

[FugueSQL](https://fugue-tutorials.readthedocs.io/tutorials/quick_look/ten_minutes_sql.html) solves these issues by extending standard SQL to make it more readable, portable, and expressive for computing workflows.

FugueSQL follows the SQL principle of being agnostic to any backend; this code is removed from any framework lock-in. Users can change between Pandas or Duckdb to Spark or Dask just by specifying the engine.

Key enhancements:
1. `LOAD` and `SAVE` are now generic operations compatible across all backends
2. Variable assignment reduces a lot of boilerplate code
3. The `PERSIST` keyword pushes down to the backend persist

FugueSQL accelerates big data iteration speed by:
- Allowing seamless swapping of local and distributed backends
- Removing boilerplate code that standard SQL introduces
- Adding keywords that invoke Python code

## Conclusion

**Sticking to traditional SQL makes it unable to express end-to-end compute workflows, often requiring supplementary Python code.** FugueSQL elevates SQL to be a first-class grammar and allows users to invoke Python code related to distributed systems with keywords such as `LOAD, SAVE, PERSIST`.

## Resources

1. [Fugue Slack — chat with us!](http://slack.fugue.ai/)
2. [Fugue Github](https://github.com/fugue-project/fugue/)
3. [FugueSQL in 10 minutes](https://fugue-tutorials.readthedocs.io/tutorials/quick_look/ten_minutes_sql.html)
