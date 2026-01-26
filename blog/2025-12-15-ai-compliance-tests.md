---
slug: using-ai-to-generate-1000-compliance-tests
title: "Using AI to Generate 1,000 Compliance Tests: What Actually Worked"
authors: [kevin]
tags: [ai, compliance, drata, llm]
description: How the Drata team built an AI system to automatically generate 1,000+ compliance tests using Claude, RAG, and a multi-stage pipeline.
image: /img/blog/using-ai-to-generate-1000-compliance-tests-thumbnail.png
image_location: Yardstick Coffee, Los Angeles
---

How the Drata team went from "just pass it to Claude" to a multi-stage pipeline that automates months of engineering work.

<!-- truncate -->

*This was originally posted on the [Drata tech blog](https://drata.com/blog/AI-compliance-tests).*

Drata is a compliance automation platform that gathers real-time evidence on your compliance posture and alerts you about anomalies. Compliance teams typically need to answer questions like:

- Is my customer data encrypted at rest?
- Are my databases backed up consistently?
- Is my network traffic restricted?

All of these questions are necessary to evaluate a company's compliance posture. In this blog post, we're focused specifically on cloud infrastructure testing—the automated checks that are regularly run to collect compliance evidence.

This post walks you through our journey building an AI system to automatically generate compliance tests. I'll cover what didn't work, what did, and the architecture that ultimately led us to 1,000+ new production tests that monitor the cloud infrastructure of Drata users.

## The Problem: Keeping Up Was Challenging

Keeping test coverage current is a losing battle when done manually. AWS has over 200 services, and that number keeps growing. Each service has multiple resource types, and each resource requires several distinct compliance checks.

Take an AWS S3 bucket, for example. It might need tests for:

- Encryption configuration
- Public access blocking
- Versioning enabled
- Multi-factor authentication for deletion
- Required metadata like tagging and ownership

Writing a single test can take an engineer days or weeks to fully develop and validate in our platform. This became an issue for our larger customers with complex cloud infrastructure. Enterprise customers kept asking for customized existing tests or entirely new tests that we didn't support. Each test required coordination between Product, Engineering, and GRC teams, with multiple review cycles and technical implementation phases.

The team realized AI could expedite the test creation process. We had structured inputs—cloud provider schemas, compliance frameworks, existing test patterns—and needed structured outputs: working test code. The challenge was getting the LLM to reason over all of it reliably.

## Understanding the Data: Inputs and Outputs

Before explaining the journey, let me give you a bit of background. Resources in the Drata platform are represented as JSON schemas. Here's a simplified example of how an S3 bucket is represented (the real schema is over 200 lines checked into Github):

A test to check that buckets have owners looks like this:

## Information Hierarchy: Starting with Controls

In the compliance world, everything flows from controls. A control is a high-level requirement. Here are a few examples:

- Production systems and resources are monitored and automated alerts are sent to personnel based on preconfigured rules
- Cloud resources are configured to deny public access
- Authentication to systems requires the use of unique identities

To be compliant, you need evidence that you're adhering to all these controls. From our users' perspective, they're not asking "Are all my buckets denying public access?" but rather "Are all my cloud resources containing sensitive data configured to deny public access?" That means checking databases, caches, queues, data warehouses—any resource that might hold sensitive data.

So we had two options: start with a control and work down to resources, or start with resource schemas and work up to controls.

Initially, we tried generating tests directly from controls. The problem is that a single control might apply to dozens of resource types (think of controls related to tagging or owners). We'd be relying on the LLM to enumerate all relevant resources, and any missed resource means a coverage gap.

Flipping the direction solved this. Starting with a resource schema, we ask the LLM to map it to the small set of relevant controls. The search space is bounded, coverage gaps are less likely, and as cloud providers add new services, we just process the new schema against existing controls.

## First Pass: The "Just Make It Work" Approach

With the information hierarchy defined, we proceeded to do a first pass. We have resource schemas and examples of human-written tests. Why not just pass the schema to Claude and have it create all the relevant tests? Several issues made this approach completely unworkable:

1. **How do we know when we're done?** If we generate 15 tests for a resource, is that complete? Could we even reproduce this consistently?
2. **Token limits everywhere:** The test example above is simple, but complex scenarios like "network traffic must be restricted" require checking both inbound and outbound traffic with multiple conditions. Kubernetes clusters generate 30-40 tests, which just blow past output token limits entirely.

After some initial testing, it was obvious this wouldn't work as a simple schema-in, tests-out process. The team had to break the logic into several distinct workflows, each focused on a specific task.

## Finding an Approach That Actually Worked

The final direction was: get the resource schema, identify relevant controls using retrieval augmented generation (RAG), then create tests for each control. This became the core flow:

- **Resource to Controls Mapping** - Analyze the resource schema to figure out which compliance controls are relevant. For an S3 bucket, this might identify controls around data encryption, public access, and backup policies.
- **Control to Test Query Generation** - For each relevant control, we generate specific test queries that validate compliance using available schema properties. For example, "verify S3 bucket has server-side encryption enabled."
- **Duplicate Detection** - We check if the proposed test already exists in our library using semantic similarity matching against test descriptions. This prevents us from creating redundant tests.
- **Test Logic Generation** - We generate the actual executable JSON Path logic with a validation loop.

But even with the multi-step workflow, there were still some finer details to get right.

## Ironing Out Edge Cases and Optimizing

Not every compliance check maps to a single property. Some tests only make sense as a group. For example, blocking S3 public access requires four settings working together: BlockPublicAcls, BlockPublicPolicy, IgnorePublicAcls, and RestrictPublicBuckets. Testing them individually would be misleading—you need all four enabled to actually block public access. Similarly, network restriction tests need to check both security groups and network ACLs, and traffic rules need both ingress and egress coverage.

To handle this, we added a grouping step before generation where related tests are identified and combined. This segmented workflow created natural breakpoints for testing each step individually, and we built additional evaluation scenarios around these more complex cases to iterate on accuracy.

## Validating Test Syntax

Generating a working test almost never happens on the first try. The JSON might be syntactically valid, but the test could be completely incompatible with our platform. The most common failures were:

- **Making up properties:** Referencing schema properties that didn't exist
- **Wrong operators:** Using operators like "notExist" when only "exist" was supported in our system
- **Deep nested path disasters:** Complex JSON paths in nested objects often just broke

Fortunately, Drata already had an endpoint for creating custom JSON tests that returned detailed error messages for things like invalid properties, unsupported operators, malformed paths. We fed these errors back to the LLM in a retry loop, giving it up to 3 attempts to produce a valid test.

## Architecture and Stack

Each piece of our pipeline was implemented as a separate Vellum workflow (AWS Lambda-like invocations). Vellum handles LLM orchestration and also hosts vector databases, which became crucial for our deduplication strategy. We used Claude Sonnet pretty much everywhere for its reasoning capabilities inside Vellum workflows.

We used Airflow to orchestrate the whole pipeline, stitching together the Vellum workflows in the right order. For each valid test we generated, we stored the results in DynamoDB for our production system.

Our deduplication strategy works at two levels:

1. **Test Query Deduplication:** During test query generation, we compare proposed test descriptions against existing tests using semantic similarity in Vellum's vector store. This catches duplicates early before we waste compute on expensive test logic generation.
2. **JSON Logic Deduplication:** After generating all tests for a resource, we run a second deduplication pass comparing the actual JSON test logic to find functionally identical tests that might have different descriptions.

Without deduplicating upfront, we would have run over 8,000 test generations (each taking up to 2 minutes). Deduplicating cut over half of those runs, saving a lot of compute costs. This dual approach was essential because controls and tests have complex many-to-many relationships. A single test might satisfy multiple controls, and we needed to catch duplicates both conceptually (during planning) and functionally (after implementation).

When new cloud resources show up, we just add them to our resource catalog and re-run the whole Airflow pipeline for that specific resource.

The stack:

- **Vellum:** LLM orchestration and vector database for semantic search
- **Airflow:** DAG orchestration and pipeline management
- **DynamoDB:** Production storage for valid generated tests
- **Anthropic Claude Sonnet:** LLM reasoning and generation

Each end-to-end pipeline run for a resource cost around $20-30 in LLM usage, primarily using Claude Sonnet for its reasoning capabilities.

## Cleaning Up: Post-Processing

Raw LLM output isn't production-ready. Before any test reaches customers, we run a series of post-processing steps to catch issues the generation phase missed.

Some of this is straightforward cleanup—deduplicating near-identical tests, consolidating related checks into single comprehensive tests (like the S3 public access example), and double-checking that each test maps to the right controls. We also generate documentation that translates the technical test logic into plain language that compliance teams can actually understand.

Finally, all generated tests go through manual review by auditors. Most rejections weren't about invalid JSON—they were tests that technically worked but weren't meaningfully relevant for an audit.

The result: over 1,000 infrastructure tests across AWS, Azure, and GCP, covering 165 unique compliance controls across 118 resources and saving our team months of manual effort.

## Key Takeaways

1. **Constrain AI to your information hierarchy:** When you have many-to-many relationships, pick the direction that minimizes what the LLM generates per step. We mapped resources to controls (few outputs) rather than controls to resources (many outputs). Less generation means fewer gaps, and aligning with the dimension that changes more frequently, new cloud resources in our case, makes updates trivial.
2. **Break things down ruthlessly:** Drata's multi-stage pipeline approach let the team optimize and validate each step independently.
3. **Plan for validation from day one:** AI-generated code needs robust validation and retry mechanisms.
4. **Don't ignore the costs:** Deduplication and smart batching are essential when you're paying per generation.
5. **Post-processing is absolutely critical:** Don't assume AI outputs are production-ready without additional cleanup.

The solution ended up being one of our more complicated AI pipelines to date.
