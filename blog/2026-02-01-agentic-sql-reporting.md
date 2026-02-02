---
slug: agentic-sql-reporting
title: "Agentic SQL Reporting: A Practical Guide for Small Data Teams"
authors: [kevin]
tags: [ai, sql, mcp, tutorial]
description: You don't need Snowflake or a data platform to build AI-powered reporting. Here's how small teams can connect ChatGPT or Claude to their existing database.
image: /img/blog/agentic-sql-reporting-thumbnail.png
image_alt: Cityscape thumbnail for article about agentic SQL reporting
---

You don't need Snowflake. You don't need a $100k/year data platform. You just need a SQL database and a ChatGPT subscription.

<!-- truncate -->

## Who This Is For

This guide is for companies like the ones I've worked with: 30-80 people, a few data scientists or analysts who know SQL, no dedicated software engineering team, and a database that's "good enough" — PostgreSQL, SQL Server, MySQL, or even SQLite exports from your core systems.

You're not running a polished data warehouse. You don't have the data volume to justify a SaaS analytics platform. But you do have questions about your data, and you're tired of writing the same SQL queries over and over.

Maybe you're a healthcare REIT with investment analysts who need to slice portfolio data. Maybe you're a regional logistics company where the ops team asks the same questions every Monday. Maybe you're a professional services firm where partners want dashboards but IT is one person who's already underwater.

If that sounds like you, keep reading. By the end of this post, you'll have:

1. **A working demo** you can try in 10 minutes with a free Supabase database
2. **A way to ask your database questions in plain English** using ChatGPT or Claude
3. **A simple web interface** so non-technical colleagues can use it too
4. **Automated reports** that run on a schedule and land in Slack or email

No data platform required. No engineering team required. Your existing data scientist can set this up in an afternoon.

## Who This Isn't For

If you're running Snowflake, Databricks, or BigQuery with a dedicated data engineering team, you probably want proper tooling: [Cube](https://cube.dev/), [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture), or your platform's native AI features. Those tools exist for a reason — they handle governance, caching, and multi-team coordination at scale.

This guide is for everyone else.

## Prior Art: What Already Exists

Before we build anything, let's survey what's already out there. You might not need to build anything at all.

### ChatGPT with File Uploads

The simplest option. Export your data to CSV, upload it to ChatGPT, and ask questions. This works surprisingly well for:
- One-off analysis
- Small datasets (under 100MB)
- Exploratory questions where you don't know what you're looking for

**Limitations:** Manual uploads, no live database connection, ChatGPT's context window limits how much data you can analyze at once.

### Claude with the Code Execution Tool

[Claude's analysis tool](https://www.anthropic.com/news/analysis-tool) lets you upload files and Claude will write and execute Python code to analyze them. Similar to ChatGPT but with Claude's reasoning capabilities.

**Limitations:** Same as ChatGPT — manual uploads, no live connection.

### Database-Specific MCP Servers

The Model Context Protocol (MCP) lets you connect AI assistants directly to external tools. Several database connectors already exist:

- [Postgres MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres) — Official PostgreSQL server
- [MySQL MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/mysql) — Official MySQL server
- [Supabase MCP](https://github.com/supabase-community/supabase-mcp) — For Supabase/Postgres with good security defaults (we'll use this for our demo)
- [SQLite MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite) — For local SQLite files

If one of these works for your database, you can skip straight to [Part 1](#part-1-connect-your-ai-assistant-to-your-database) and just configure it. But first, try the [hands-on demo](#try-it-yourself-a-10-minute-demo-with-supabase) to see this working before you connect your production data.

### Vanna AI

[Vanna](https://github.com/vanna-ai/vanna) is an open-source framework that provides a complete text-to-SQL solution: chat UI, FastAPI backend, user authentication, row-level security, and support for most databases and LLMs.

**When to use Vanna:** If you need user authentication, row-level security, or want a polished UI out of the box. It's more infrastructure to manage, but it handles concerns that matter for larger teams.

**When to skip Vanna:** If you just want to connect your AI assistant to your database and start asking questions. The setup below is simpler.

### Semantic Layer Tools

[Cube](https://cube.dev/) and [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture) provide governed, cached access to metrics. Both have MCP integrations. These are the right choice if you have:
- Multiple teams querying the same data
- Complex metric definitions that change over time
- Compliance requirements around data access

For a 50-person company with one data scientist, they're probably overkill.

## The Principles

Before we build anything, let's establish why we're building it this way.

### Principle 1: Simple Beats Complex

Vercel's analytics team [wrote about their experience](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools) building an AI agent for their data infrastructure. They started with 15+ specialized tools: schema lookup, query validation, error recovery, custom retrieval logic. Then they removed 80% of it.

The result? 3.5x faster execution, 100% success rate (up from 80%), 37% fewer tokens.

Their final architecture was two tools:
1. Execute bash commands (to read documentation)
2. Execute SQL queries

That's it. The lesson: don't over-engineer. Modern LLMs are good at reasoning. Let them.

### Principle 2: Documentation Is Your Semantic Layer

You don't need Cube or dbt to have a semantic layer. You need documentation.

```markdown
# Schema Documentation

## customers
- id: unique customer identifier
- email: customer email (unique)
- plan: 'free', 'pro', or 'enterprise'

## orders
- id: unique order identifier
- customer_id: FK to customers.id
- total_cents: order total in CENTS, not dollars
- status: 'pending', 'paid', 'refunded', 'cancelled'

# Important Notes
- Revenue = sum of total_cents for orders WHERE status = 'paid', divided by 100
- Active customer = at least one paid order in last 30 days
```

Put this in a file. Tell the AI to read it before writing queries. You now have a semantic layer that cost you 30 minutes instead of 30 days.

### Principle 3: Read-Only, Always

Your AI assistant should never have write access to your database. Create a dedicated read-only user:

```sql
-- PostgreSQL
CREATE USER ai_reader WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_reader;

-- SQL Server
CREATE LOGIN ai_reader WITH PASSWORD = 'secure_password';
CREATE USER ai_reader FOR LOGIN ai_reader;
EXEC sp_addrolemember 'db_datareader', 'ai_reader';
```

This prevents accidents. It won't stop a determined attacker, but we're building internal tools for trusted users, not public APIs.

### Principle 4: Start Where Your Team Already Is

If your team uses ChatGPT, build for ChatGPT. If they use Claude, build for Claude. Don't make them switch tools just to query data.

This guide covers both, and the patterns work with any LLM that supports function calling.

---

## Try It Yourself: A 10-Minute Demo with Supabase

Before we get into connecting your real database, let's prove this works. We'll use Supabase's free tier and their hosted MCP server — no code, no local setup.

### Step 1: Create a Free Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project — give it any name, pick a region, set a database password
3. Wait ~2 minutes for it to provision

That's it. You now have a PostgreSQL database in the cloud.

### Step 2: Connect Claude Desktop to Supabase

The Supabase MCP server is hosted — you don't need to run anything locally.

Edit your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--supabase-access-token", "YOUR_ACCESS_TOKEN"]
    }
  }
}
```

To get your access token:
1. Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Generate a new token
3. Paste it in the config above

Restart Claude Desktop. You should see Supabase tools appear.

### Step 3: Create Mock Data with Claude

Now here's where it gets fun. Ask Claude to create your test database:

> "Create a simple e-commerce schema in my Supabase project with customers, products, and orders tables. Then populate it with realistic mock data — about 50 customers, 20 products, and 200 orders spread over the last 6 months."

Claude will:
1. Connect to your Supabase project
2. Create the tables with proper relationships
3. Generate realistic mock data with varied dates, amounts, and statuses

Watch it work. This is agentic AI in action — Claude is writing and executing SQL, handling errors, and building something useful.

### Step 4: Query Your Data

Now ask questions:

> "What was our total revenue last month?"

> "Who are our top 5 customers by lifetime value?"

> "Show me the weekly sales trend for the last 3 months."

> "Which products have the highest return rate?"

Claude queries the database, gets real results, and explains them in plain English.

### Step 5: Try Breaking It

Ask something ambiguous:

> "How are we doing?"

Watch Claude ask clarifying questions or make reasonable assumptions. Try asking for data that doesn't exist. Watch it handle the error gracefully.

This is what you'll have for your real database. Now let's build it properly.

---

## Part 1: Connect Your AI Assistant to Your Database

The fastest path to "ask questions in plain English" is connecting your AI assistant directly to your database via MCP.

### What You'll Need

- Claude Desktop or another MCP-compatible client
- Python 3.10+
- Access to your database (connection string)
- 30 minutes

### Step 1: Install an Existing MCP Server (If One Exists)

Check if there's already an MCP server for your database:

**PostgreSQL:**
```bash
# Using uvx (recommended)
uvx mcp-server-postgres "postgresql://user:pass@localhost/dbname"
```

**MySQL:**
```bash
uvx mcp-server-mysql --host localhost --user root --password secret --database mydb
```

**SQLite:**
```bash
uvx mcp-server-sqlite --db-path /path/to/database.db
```

If one of these works for you, skip to [Configuring Claude Desktop](#step-3-configure-claude-desktop).

### Step 2: Build a Simple MCP Server (If You Need Custom Logic)

If you need something custom — maybe you're on SQL Server, or you want to add schema documentation — here's a minimal implementation using [FastMCP](https://gofastmcp.com/).

```bash
pip install fastmcp psycopg2-binary  # or pyodbc for SQL Server
```

Create `sql_server.py`:

```python
from fastmcp import FastMCP
import psycopg2  # or pyodbc for SQL Server
from psycopg2.extras import RealDictCursor
import os

mcp = FastMCP(
    name="sql-reporter",
    instructions="""You help users query a database. Always read the schema
    documentation first by calling get_schema(). Only SELECT queries are allowed."""
)

DATABASE_URL = os.environ["DATABASE_URL"]

@mcp.tool()
def execute_sql(query: str) -> list[dict] | dict:
    """
    Execute a read-only SQL query. Only SELECT, WITH, and EXPLAIN are allowed.
    If the query fails, returns the error message — read it to fix your query.
    """
    normalized = query.strip().upper()
    if not normalized.startswith(("SELECT", "WITH", "EXPLAIN")):
        return {"error": "Only SELECT queries are allowed"}

    try:
        conn = psycopg2.connect(DATABASE_URL)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            results = cur.fetchall()
            return [dict(row) for row in results]
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

@mcp.tool()
def get_schema() -> str:
    """
    Get schema documentation. ALWAYS call this before writing any SQL.
    """
    schema_path = os.path.join(os.path.dirname(__file__), "schema.md")
    try:
        with open(schema_path) as f:
            return f.read()
    except FileNotFoundError:
        return "No schema documentation found. Query information_schema for table details."

@mcp.tool()
def list_tables() -> list[str]:
    """List all tables in the database."""
    result = execute_sql("""
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name
    """)
    if isinstance(result, dict) and "error" in result:
        return result
    return [row["table_name"] for row in result]

if __name__ == "__main__":
    mcp.run()
```

Create `schema.md` next to it with your documentation (see Principle 2 above).

### Step 3: Configure Claude Desktop

Edit your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sql-reporter": {
      "command": "python",
      "args": ["/full/path/to/sql_server.py"],
      "env": {
        "DATABASE_URL": "postgresql://ai_reader:password@localhost/mydb"
      }
    }
  }
}
```

Restart Claude Desktop. You should see the tools available in the sidebar.

### Step 4: Test It

Ask Claude:

> "What are our top 10 customers by total order value?"

Claude will:
1. Call `get_schema()` to understand your database
2. Write a SQL query
3. Execute it via `execute_sql()`
4. Format and explain the results

If the query fails, Claude reads the error and fixes it. This is the power of giving the model direct access rather than wrapping everything in elaborate error handling.

### What About ChatGPT?

ChatGPT doesn't support MCP directly, but you can use the same pattern via Custom GPTs with Actions:

1. Wrap your SQL execution in a simple FastAPI endpoint
2. Create a Custom GPT with an Action pointing to your endpoint
3. Add your schema documentation to the GPT's instructions

```python
# api.py
from fastapi import FastAPI
from sql_server import execute_sql, get_schema, list_tables

app = FastAPI()

@app.post("/query")
def query(sql: str):
    return execute_sql(sql)

@app.get("/schema")
def schema():
    return get_schema()

@app.get("/tables")
def tables():
    return list_tables()
```

This requires exposing an endpoint (even if just on your local network), which is more setup than MCP. But it works with any LLM that supports function calling.

---

## Part 2: A Web Interface for Non-Technical Users

Your analysts can use Claude Desktop directly, but what about the partners, the ops team, the people who just want answers without learning new tools?

Build them a simple web interface with Streamlit.

### What You'll Need

- The SQL tools from Part 1
- An Anthropic or OpenAI API key
- 30 more minutes

### The Full Implementation

```python
# app.py
import streamlit as st
from anthropic import Anthropic
import json
import os

# Import our SQL tools from Part 1
from sql_server import execute_sql, get_schema, list_tables

st.set_page_config(page_title="Data Q&A", page_icon="📊", layout="wide")
st.title("📊 Ask Questions About Our Data")

# Initialize API client
client = Anthropic()  # or OpenAI()

# Define tools for the API
tools = [
    {
        "name": "execute_sql",
        "description": "Execute a SQL query. Only SELECT queries allowed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The SQL query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_schema",
        "description": "Get database schema documentation. Call before writing queries.",
        "input_schema": {"type": "object", "properties": {}}
    },
    {
        "name": "list_tables",
        "description": "List all tables in the database.",
        "input_schema": {"type": "object", "properties": {}}
    }
]

def run_tool(name: str, args: dict):
    """Execute a tool and return results."""
    if name == "execute_sql":
        return execute_sql(args["query"])
    elif name == "get_schema":
        return get_schema()
    elif name == "list_tables":
        return list_tables()
    return {"error": f"Unknown tool: {name}"}

def ask_question(question: str) -> tuple[str, list]:
    """Send question to Claude, handle tool calls, return answer and any data."""
    messages = [{"role": "user", "content": question}]
    query_results = []

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system="""You are a helpful data analyst. When users ask questions:
        1. First call get_schema() to understand the database
        2. Write and execute SQL queries to answer their question
        3. Explain the results in plain language

        Be concise. If you show numbers, make sure they're formatted nicely.""",
        tools=tools,
        messages=messages
    )

    # Handle tool calls in a loop
    while response.stop_reason == "tool_use":
        tool_results = []

        for block in response.content:
            if block.type == "tool_use":
                result = run_tool(block.name, block.input)

                # Save SQL results for display
                if block.name == "execute_sql":
                    query_results.append({
                        "query": block.input["query"],
                        "results": result
                    })

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result, default=str)
                })

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system="""You are a helpful data analyst.""",
            tools=tools,
            messages=messages
        )

    # Extract final text response
    answer = ""
    for block in response.content:
        if hasattr(block, "text"):
            answer += block.text

    return answer, query_results

# Session state for history
if "history" not in st.session_state:
    st.session_state.history = []

# Sidebar with example questions
with st.sidebar:
    st.header("Example Questions")
    examples = [
        "What were our total sales last month?",
        "Who are our top 10 customers?",
        "Show me the trend of new signups by week",
        "Which products have the highest return rate?",
    ]
    for example in examples:
        if st.button(example, key=example):
            st.session_state.pending_question = example

# Main input
question = st.chat_input("Ask a question about your data...")

# Handle example button clicks
if "pending_question" in st.session_state:
    question = st.session_state.pending_question
    del st.session_state.pending_question

if question:
    st.session_state.history.append({"role": "user", "content": question})

    with st.spinner("Analyzing..."):
        answer, query_results = ask_question(question)

    st.session_state.history.append({
        "role": "assistant",
        "content": answer,
        "queries": query_results
    })

# Display conversation history
for msg in st.session_state.history:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

        # Show query results as tables
        if "queries" in msg:
            for qr in msg["queries"]:
                with st.expander("View SQL Query"):
                    st.code(qr["query"], language="sql")
                if isinstance(qr["results"], list) and len(qr["results"]) > 0:
                    st.dataframe(qr["results"], use_container_width=True)
```

### Run It

```bash
export DATABASE_URL="postgresql://ai_reader:password@localhost/mydb"
export ANTHROPIC_API_KEY="sk-ant-..."
streamlit run app.py
```

Share the URL with your team. They can now ask questions in plain English without needing Claude Desktop, API keys, or SQL knowledge.

### Deploying It

For a small team, you have a few options:

**Run it on a shared server:**
```bash
nohup streamlit run app.py --server.port 8501 &
```

**Use Streamlit Cloud:** Free tier works for internal tools. Connect your GitHub repo and it deploys automatically.

**Docker:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["streamlit", "run", "app.py", "--server.port=8501"]
```

---

## Part 3: Automated Reports

Now for the final piece: reports that run themselves.

The key insight is that **scheduling is a solved problem**. Cron has worked for 50 years. You don't need a fancy orchestration platform. You need a script that generates a report and sends it somewhere.

### The Report Generator

```python
# report.py
from anthropic import Anthropic
import json
from datetime import datetime
from sql_server import execute_sql, get_schema

client = Anthropic()

def generate_report(prompt: str) -> str:
    """Generate a report by letting Claude query the database."""

    tools = [
        {
            "name": "execute_sql",
            "description": "Execute a SQL query.",
            "input_schema": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"]
            }
        },
        {
            "name": "get_schema",
            "description": "Get schema documentation.",
            "input_schema": {"type": "object", "properties": {}}
        }
    ]

    messages = [{"role": "user", "content": prompt}]

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=f"""You are generating an automated report. Today is {datetime.now().strftime('%Y-%m-%d')}.

        First call get_schema() to understand the database.
        Then run the necessary queries.
        Format your response as a clear, readable report with sections and bullet points.
        Include specific numbers. Compare to previous periods when relevant.""",
        tools=tools,
        messages=messages
    )

    # Tool loop
    while response.stop_reason == "tool_use":
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                if block.name == "execute_sql":
                    result = execute_sql(block.input["query"])
                else:
                    result = get_schema()
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result, default=str)
                })

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

    for block in response.content:
        if hasattr(block, "text"):
            return block.text
    return ""


def send_slack(message: str, webhook_url: str):
    """Send report to Slack."""
    import requests
    requests.post(webhook_url, json={"text": message})


def send_email(message: str, to: str, subject: str):
    """Send report via email. Implement with your provider."""
    # SendGrid, SES, SMTP, whatever you use
    pass


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="What report to generate")
    parser.add_argument("--slack", help="Slack webhook URL")
    parser.add_argument("--email", help="Email address")
    args = parser.parse_args()

    report = generate_report(args.prompt)
    print(report)

    if args.slack:
        send_slack(report, args.slack)
    if args.email:
        send_email(report, args.email, f"Report: {args.prompt[:50]}")
```

### Schedule It

**Cron (Linux/Mac):**
```bash
# Edit crontab
crontab -e

# Run weekly revenue report every Monday at 9am
0 9 * * 1 cd /path/to/project && python report.py "Weekly revenue summary with week-over-week comparison" --slack $SLACK_WEBHOOK
```

**Task Scheduler (Windows):**
Create a batch file and schedule it via Task Scheduler.

**GitHub Actions (if your code is in a repo):**
```yaml
name: Weekly Report
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9am UTC
  workflow_dispatch:  # Allow manual runs

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install anthropic psycopg2-binary requests
      - run: python report.py "Weekly revenue summary" --slack ${{ secrets.SLACK_WEBHOOK }}
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Example Reports

Here are some report prompts that work well:

```bash
# Weekly business summary
python report.py "Weekly business summary: total revenue, new customers, top performing products, and any concerning trends"

# Monday morning ops report
python report.py "Monday ops report: orders pending fulfillment, inventory alerts, and customer service tickets opened over the weekend"

# Monthly investor summary
python report.py "Monthly investor summary: revenue vs last month, customer acquisition cost, churn rate, and runway"
```

---

## Security Checklist

Before you deploy any of this:

- [ ] **Read-only database user** with SELECT-only permissions
- [ ] **Statement timeout** to kill long-running queries (`SET statement_timeout = '30s'`)
- [ ] **Connection limit** on the AI user (`ALTER USER ai_reader CONNECTION LIMIT 5`)
- [ ] **Row limits** in your execute_sql function (don't return 10 million rows)
- [ ] **Query logging** for audit trails
- [ ] **Never use production primary** — use a read replica or daily snapshot

```sql
-- Full PostgreSQL setup
CREATE USER ai_reader WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_reader;
ALTER USER ai_reader SET statement_timeout = '30s';
ALTER USER ai_reader CONNECTION LIMIT 5;
```

---

## What We Didn't Build

This guide intentionally skips:

- **User authentication** — If you need per-user permissions, look at [Vanna](https://github.com/vanna-ai/vanna)
- **Caching** — For high-volume usage, add Redis or even just `@lru_cache`
- **Visualization** — Streamlit has `st.line_chart()`, `st.bar_chart()` if you want charts
- **Complex orchestration** — If you outgrow cron, look at [Prefect](https://www.prefect.io/) or [Dagster](https://dagster.io/)
- **Semantic layers** — If you need governed metrics, look at [Cube](https://cube.dev/) or [dbt](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture)

You can add any of these later. Start simple.

---

## Conclusion

We built four things:

1. **A working demo** with Supabase to prove the concept (zero code)
2. **An MCP server** that connects Claude Desktop to your database (~50 lines of Python)
3. **A Streamlit app** so non-technical users can ask questions (~100 lines)
4. **A report generator** that can be scheduled with cron (~50 lines)

Total: ~200 lines of code. No data platform. No engineering team. Just a database, some Python, and an AI subscription you already have.

The key principles:
- **Simple beats complex** — Two tools beat fifteen
- **Documentation is your semantic layer** — A markdown file is often enough
- **Read-only, always** — AI should never write to your database
- **Scheduling is orthogonal** — Use whatever you already know

You don't need Snowflake. You don't need a vendor. You just need to connect what you already have.

---

## References

- [Vercel: We Removed 80% of Our Agent's Tools](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools) — The case for simplicity
- [FastMCP Documentation](https://gofastmcp.com/) — Build MCP servers in Python
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers) — Official database connectors
- [Vanna AI](https://github.com/vanna-ai/vanna) — Full-featured text-to-SQL framework
- [Supabase MCP](https://github.com/supabase-community/supabase-mcp) — Good security patterns for database MCP servers
- [Cube Semantic Layer](https://cube.dev/) — Enterprise semantic layer with MCP support
- [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture) — Metrics layer for dbt users
