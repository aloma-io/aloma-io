# What is ALOMA

## What is ALOMA

**No infra. No no-code. Just code and let ALOMA handle the rest.**

ALOMA is a code-first automation platform designed for experienced developers who want to build workflow automations quickly without the limitations of visual tools. Unlike traditional workflow builders, ALOMA uses conditional execution where you define steps that respond to data patterns rather than predefined sequences.

### Core Concepts

**Tasks** are JSON objects of any structure that represent work to be automated. They flow into your workspace and trigger steps based on their data.

**Steps** consist of two parts:

* **Condition**: A JSON pattern that determines when the step runs
* **Content**: JavaScript code that processes the data and can trigger additional steps

**Workspaces** contain your steps, connectors, and tasks. They provide complete isolation for different environments or projects.

**Connectors** are pre-built integrations to external services (HubSpot, Slack, Gmail, etc.) with authentication handled once.

### How ALOMA Works

Instead of building rigid sequential workflows, you create a workspace where "tasks" (JSON objects) are processed by conditional "steps" that respond to data patterns.

#### Traditional Workflow Thinking

```
1. Validate email
2. Add to CRM  
3. Send welcome email
4. Complete onboarding
```

#### ALOMA Conditional Thinking

```
- When data has unvalidated email → validate it
- When email is validated → add to CRM
- When email is validated → send welcome email  
- When both CRM and email are complete → finish onboarding
```

This paradigm shift enables:

* **Parallel processing** by default
* **Self-organizing workflows** that adapt to data
* **Infinite complexity** without exponential maintenance overhead
* **Natural error handling** through data state management

### Key Advantages

**Quick Setup**: First automation running in minutes, not hours. No complex infrastructure setup or workflow design required.

**No Infrastructure Management**: Just upload JavaScript code and ALOMA handles hosting, scaling, and execution environment.

**Pay-per-Task Pricing**: Cost scales with actual usage rather than seats, connectors, or complexity.

**Infinite Scalability**: Adding the 100th step is as easy as adding the 1st. No exponential complexity like traditional RPA tools.

**Code-First Development**: Real JavaScript execution with full IDE support, version control, and debugging capabilities.

**Built-in Integration Management**: OAuth connectors with authentication handled once, then reused across all automations.

### Who ALOMA is For

**Experienced Developers** who want to delegate automation work to junior developers while maintaining code quality and flexibility.

**Teams Building Workflow Automations** who are frustrated with the limitations of visual no-code/low-code tools.

**Organizations Scaling Automation** that need to move beyond simple workflows to complex, intelligent business process automation.

**Technical Teams** who prefer code over visual interfaces and want infrastructure-free development experiences.

### Common Use Cases

**CRM and Sales Automation**: Log inbound emails, process leads, update opportunity stages, sync data across systems.

**Invoice and Financial Processing**: Process invoices, update multiple applications, handle approval workflows, sync with accounting systems.

**Customer Support Automation**: Classify tickets, route to appropriate teams, escalate based on sentiment, update CRM records.

**AI-Powered Research Tasks**: Gather market intelligence, enrich lead data, generate content, process unstructured data.

**Release Management**: Automate CI/CD processes, manage deployments, notify teams, update documentation.

**Data Integration**: Sync data between systems, transform formats, handle webhooks, process bulk operations.

### Why Conditional Execution Matters

Traditional workflow tools force you to predict every possible path and branch in advance. ALOMA's conditional execution allows workflows to emerge naturally from data patterns:

* **Steps activate when conditions are met**, not when scheduled
* **Multiple steps can run in parallel** without complex orchestration
* **New requirements become new steps**, not workflow redesign
* **Error handling happens through data state**, not try-catch blocks
* **Testing focuses on data scenarios**, not execution paths

This approach scales from simple automations to enterprise-grade systems that handle thousands of different scenarios without becoming unmaintainable.

### Getting Started

Ready to experience conditional execution? Start with our [5-Minute Quickstart](https://claude.ai/chat/5-minute-quickstart.md) to build your first ALOMA automation, then explore [Understanding Conditional Steps](https://claude.ai/chat/understanding-conditional-steps.md) to master the paradigm.
