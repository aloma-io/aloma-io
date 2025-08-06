# Getting Started with ALOMA

This guide introduces ALOMA's core concepts and gets you building your first automation in minutes.

## Understanding ALOMA

ALOMA automates pipelines through a simple flow: **Tasks** (JSON data) from **Integrations** (external connections) trigger **Steps** (JavaScript logic) within **Workspaces** (isolated environments) that execute actions via **integrations**.

## Core Concepts

### Account
Your top-level access point for managing workspaces, monitoring usage, and controlling user access across all ALOMA automations.

### Workspaces
Isolated environments where your automations run. Each workspace is completely independent - connectors, webhooks, steps, and tasks don't share data between workspaces.

[Complete Workspaces Guide](workspaces.md)

### Integrations
Your connection to external services through connectors and webhooks. ALOMA doesn't store data - it processes and routes data through integrations.

**Available options**:
- **Cloud connectors** - Ready-to-use connectors from ALOMA
- **On-premises connectors** - Build your own custom connectors with our SDK
- **Webhooks** - Receive data from external systems

[Complete Integration Guide](integration.md)

### Tasks
JSON data that triggers your workflows. Tasks are schemaless - any valid JSON structure works.

**Example task**:
```json
{
 "runMe": true,
 "user": "developer@company.com",
 "priority": "high"
}
```

[Complete Tasks Guide](tasks.md)

### Steps
JavaScript code blocks with matching conditions that process tasks. Steps run when their conditions match the incoming task data.

**Example step**:
```javascript
// Condition
{ "runMe": true }

// Code
console.log('Processing task...');
data.runMeComplete = true;
data.processedAt = new Date().toISOString();
```

[Complete Steps Guide](steps.md)

## How ALOMA Works

### The Automation Flow

1. **Task arrives** - JSON data enters via webhook, connector, or manual entry
2. **Step matching** - ALOMA finds steps with conditions that match the task data
3. **Best match selection** - If multiple steps match, ALOMA selects the best match
4. **Code execution** - The selected step's JavaScript code runs against the task data
5. **Task updates** - Step execution can modify the task data
6. **Process repeats** - ALOMA looks for the next matching step with updated task data
7. **Completion** - Process continues until no more steps match or `task.complete()` is called

### Key Benefits

- **Parallel execution** - Tasks process independently
- **Real-time workflow building** - Steps sequence dynamically based on task data
- **No rigid schema** - Flexible data flow without schema requirements
- **Scalable complexity** - Add steps and logic without needing to maintain the existing workflows

## Building Your First Automation

### Quick Start

**Step 1: Create Your Account**
Visit [home.aloma.io](https://home.aloma.io) to create your account. This automatically creates a "Getting Started" workspace.

**Step 2: Try the Toy Example**
Walk through our [ship offloading example](toy-example.md) to build your first automation:

1. Use your Getting Started workspace
2. Add a simple task using the Task screen
3. Create your first step with basic conditions and code
4. Deploy and test instantly
5. Add more steps, deploying and testing each one
6. Add a connector to send an email

## Next Steps

**Learn the fundamentals:**
- **[Toy Example](toy-example.md)** - Hands-on tutorial using ship offloading scenario
- **[Workspaces](workspaces.md)** - Deep dive into workspace management
- **[Integration Setup](integration.md)** - Connect external services
- **[Task Management](tasks.md)** - Advanced task handling
- **[Step Development](steps.md)** - JavaScript step programming
- **[Libraries](library.md)** - Reusable code modules and functions

**Ready to start building?** Begin with the [toy example](toy-example.md) for a practical introduction to ALOMA's workflow automation.
