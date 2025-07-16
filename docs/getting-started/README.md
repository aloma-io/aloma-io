# Getting Started with ALOMA

## Understanding ALOMA: The Framework

ALOMA automates workflows through a simple but powerful flow: **Tasks** (JSON data) trigger **Steps** (JavaScript logic) within **Workspaces** (isolated environments) using **Integrations** (external connections).

## Core Concepts

### Account
Your top-level access point for managing workspaces, monitoring usage, and controlling user access across all your ALOMA automations.

### Workspaces
**What it is**: An isolated environment where your automations run  
**Key point**: Each workspace is completely independent - connectors, webhooks, steps, and tasks don't share between workspaces

**Why this matters**: If you have a Slack connector in Workspace A and want to use Hubspot in Workspace B, you need to add a separate Hubspot connector to Workspace B. This gives you controls of the workflows that execute in each workspace.

[Learn more about Workspaces →](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/workspaces.md)

### Integrations
**What it is**: Your connection to the outside world through connectors and webhooks  
**Key point**: ALOMA doesn't store data - it processes and routes data through integrations

**Available options**:
- **Connectors**: Access external services (APIs, databases, cloud services)
- **Webhooks**: Receive data from external systems
- **Cloud-based**: Ready-to-use connectors from ALOMA
- **On-premises**: Build custom connectors with our SDK

[Learn more about Integrations →](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/integration.md)

### Tasks
**What it is**: JSON data that triggers your workflows  
**Key point**: Tasks are schemaless - any valid JSON structure works

**How tasks enter ALOMA**:
- Manual creation in the UI
- Webhook submissions
- Connector inputs

**Example task**:
```json
{
  "runMe": true,
  "user": "developer@company.com",
  "priority": "high"
}
```

[Learn more about Tasks →](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/tasks.md)

### Steps
**What it is**: JavaScript code blocks with matching conditions that process tasks  
**Key point**: Steps run when their conditions match the incoming task data

**Step structure**:
- **Condition**: Determines when the step should execute
- **Code**: JavaScript logic that processes the task

**Example step**:
```javascript
// Condition
{
  "runMe": true
}

// Code
console.log('Processing task...');
data.runMeComplete = true;
data.processedAt = new Date().toISOString();
```

[Learn more about Steps →](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/steps.md)

## How ALOMA Processes Your Workflows

### The Automation Flow

1. **Task arrives**: JSON data enters ALOMA via webhook, connector, or manual entry
2. **Step matching**: ALOMA finds steps with conditions that match the task data
3. **Best match selection**: If multiple steps match, ALOMA selects the best match
4. **Code execution**: The selected step's JavaScript code runs against the task data
5. **Task updates**: Step execution can modify the task data
6. **Process repeats**: ALOMA looks for the next matching step with the updated task data
7. **Completion**: Process continues until no more steps match or `task.complete()` is called

### Task Evolution Example

**Initial task**:
```json
{
  "runMe": true
}
```

**After step execution**:
```json
{
  "runMe": true,
  "runMeComplete": true,
  "processedAt": "2024-01-15T10:30:00Z"
}
```

**Complete the task**:
```javascript
task.complete(); // Ends the workflow for this task
```

## Key Benefits of This Approach

- **Parallel execution**: Tasks process independently - one failure doesn't affect others
- **Real-time workflow building**: Steps sequence dynamically based on task data
- **Flexible data flow**: No rigid schema requirements
- **Scalable complexity**: Add steps without restructuring existing workflows

## Building Your First Automation

### Get Started in Minutes

Your first automation is just minutes away! Here's how to begin:

**Step 1: Create Your Account**
Visit [home.aloma.io](https://home.aloma.io) to create your account. This automatically creates a "Getting Started" workspace and shows you a welcome page with guided next steps.

**Step 2: Follow the Introduction**
Once logged in, you'll see a personalized welcome with:
1. Take the Introduction tutorial
2. Go to your Getting Started workspace
3. Integrate your systems and start automating

### Start Simple, Build Iteratively

The most effective approach is to begin with a single task and build your workflow step by step:

1. **Use your Getting Started workspace** (automatically created with your account)
2. **Add a simple task** using the Task screen → "New Task"
3. **Create your first step** with basic conditions and code
4. **Deploy and test** the step individually
5. **Add more steps** as needed, testing each one
6. **Iterate** until your workflow handles all scenarios

### Recommended First Steps

1. **Try the toy example**: Walk through our [ship offloading example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md) to see these concepts in action
2. **Create a test task**: Start with simple JSON like `{"test": true}` 
3. **Write a basic step**: Create a step that matches your test task and logs a message
4. **Build incrementally**: Add complexity one step at a time

## Next Steps

- **[Toy Example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md)**: Hands-on tutorial using ship offloading scenario
- **[Workspaces Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/workspaces.md)**: Deep dive into workspace management
- **[Integration Setup](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/integration.md)**: Connect external services
- **[Task Management](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/tasks.md)**: Advanced task handling
- **[Step Development](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/steps.md)**: JavaScript step programming

Ready to start building? Begin with the [toy example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md) for a practical introduction to ALOMA's workflow automation.
