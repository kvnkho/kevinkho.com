---
sidebar_position: 3
---

# Prefect

**Former OSS Community Engineer** | [GitHub](https://github.com/PrefectHQ/prefect) | [Website](https://prefect.io)

![Prefect Logo](/img/projects/prefect.png)

## Overview

Prefect is a modern workflow orchestration framework for building, running, and monitoring data pipelines. As an OSS Community Engineer, I helped developers adopt Prefect and contributed to the ecosystem.

## Role & Contributions

At Prefect, I focused on:

- **Community Building**: Growing the open source community and helping developers get started
- **Integration Development**: Building integrations with distributed computing frameworks
- **Documentation**: Creating tutorials and guides for common use cases
- **Developer Advocacy**: Speaking at conferences and creating educational content

## The Fugue-Prefect Integration

One of my key contributions was bridging Fugue and Prefect, enabling teams to:

- Scale Prefect tasks across distributed backends
- Write backend-agnostic data pipelines
- Test distributed workflows locally before deploying to production

```python
from prefect import flow, task
import fugue.api as fa

@task
def process_data(df):
    return fa.transform(df, my_transform, engine="spark")

@flow
def my_pipeline():
    data = extract_data()
    processed = process_data(data)
    load_data(processed)
```

## Impact

During my time at Prefect:

- Helped grow the community of active users
- Created content viewed by thousands of data engineers
- Built integrations that simplified distributed workflow development
