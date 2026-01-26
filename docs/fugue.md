---
sidebar_position: 2
---

# Fugue

**Co-author** | [GitHub](https://github.com/fugue-project/fugue) | [Documentation](https://fugue-tutorials.readthedocs.io/)

![Fugue Logo](/img/projects/fugue.png)

## Overview

Fugue is an open-source unified interface for distributed computing. It allows data practitioners to write code in native Python or pandas and execute it on Spark, Dask, or Ray without code changes.

## The Problem

Data teams often face a difficult choice:

- Write code in pandas, but struggle to scale beyond a single machine
- Use Spark/Dask/Ray directly, but deal with framework-specific APIs and vendor lock-in
- Maintain multiple codebases for different execution environments

## The Solution

Fugue provides a layer of abstraction that decouples logic from execution:

```python
import fugue.api as fa

def transform(df: pd.DataFrame) -> pd.DataFrame:
    # Your pandas logic here
    return df

# Run on pandas locally
fa.transform(df, transform)

# Run on Spark - same code
fa.transform(df, transform, engine="spark")

# Run on Dask - still the same code
fa.transform(df, transform, engine="dask")
```

## Key Features

- **Write once, run anywhere**: Execute the same code on pandas, Spark, Dask, or Ray
- **FugueSQL**: SQL interface for distributed computing
- **Type-driven execution**: Use type hints to define input/output schemas
- **Easy testing**: Test distributed logic locally with pandas

## Impact

Fugue has been adopted by teams at major companies for:

- Reducing development time by eliminating framework-specific code
- Enabling seamless scaling from laptop to cluster
- Simplifying testing of distributed applications
