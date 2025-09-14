# 5-minute Quickstart

## 5-Minute Quickstart

Build your first ALOMA automation to understand conditional execution. We'll create a multi-step workflow that processes the arrival of a cargo ship and off boarding off cargo and crew with parallel operations. This demonstrate how ALOMA's data-driven approach works with a simple example without integration.&#x20;

### What You'll Build

A simple automation that:

* Send cargo ship data as JSON to ALOMA
* Processes crew offboarding when conditions are met
* Handles cargo unloading independently in parallel
* Complete off-boarding only after both tasks complete
* Demonstrates ALOMA's conditional execution model

### Prerequisites

* [ALOMA account](https://home.aloma.io/) (free signup with 30-day Pro trial)
* Basic JavaScript knowledge

### Step 1: Install and Setup CLI

```bash
# Install ALOMA CLI globally
npm install -g @aloma.io/aloma

# Verify installation
aloma --version

# Authenticate with your account
aloma auth
```

The `aloma auth` command opens your browser to authenticate. Once complete, you're ready to build.

### Step 2: Create Your First Workspace

```bash
# Create a new workspace for this tutorial
aloma workspace add "Ship Management Tutorial" --tags "tutorial,getting-started"

# Switch to your new workspace
aloma workspace switch "Ship Management Tutorial"

# Verify you're in the right workspace
aloma workspace show
```

### Step 3: Create the Initial Task

Let's create a task that represents a ship ready for retirement:

```bash
# Create a test task with ship data
aloma task new "retire ship alpha" -d '{
  "ship": {
    "name": "Alpha",
    "floating": true,
    "cargo": ["fish", "oil", "equipment"],
    "crew": 25,
    "status": "active"
  }
}'
```

**What just happened?** You created a JSON task that will flow through your automation. ALOMA doesn't care about the structure - it's just data waiting to be processed.

### Step 4: Build Your First Step - Crew Offboarding

```bash
# Create your first step
aloma step add "offboard_crew"
```

Now edit the step with these patterns. The step consists of a **condition** (when it runs) and **content** (what it does):

**Condition** (when this step runs):

```javascript
export const condition = {
  ship: {
    crew: Number,
    floating: true,
    status: "active"
  }
};
```

**Content** (what happens):

```javascript
export const content = async () => {
  console.log(`Offboarding ${data.ship.crew} crew members from ${data.ship.name}...`);
  
  // Process crew offboarding
  data.ship.crew = 0;
  data.ship.crewOffboarded = true;
  data.ship.crewOffboardedAt = new Date().toISOString();
  
  console.log('Crew offboarding complete');
};
```

### Step 5: Second Step - Cargo Unloading (Parallel)

```bash
aloma step add "unload_cargo"
```

**Condition**:

```javascript
export const condition = {
  ship: {
    cargo: Array,
    floating: true,
    status: "active"
  }
};
```

**Content**:

```javascript
export const content = async () => {
  console.log(`Unloading cargo from ${data.ship.name}:`, data.ship.cargo);
  
  // Store cargo manifest before clearing
  data.ship.cargoManifest = [...data.ship.cargo];
  data.ship.cargo = [];
  data.ship.cargoUnloaded = true;
  data.ship.cargoUnloadedAt = new Date().toISOString();
  
  console.log('Cargo unloading complete');
};
```

### Step 6: Final Step - Complete Off-Boarding (ship eetirement)

```bash
aloma step add "retire_ship"
```

**Condition** (waits for both previous steps):

```javascript
export const condition = {
  ship: {
    crewOffboarded: true,
    cargoUnloaded: true,
    floating: true
  }
};
```

**Content**:

```javascript
export const content = async () => {
  console.log(`All prerequisites met. Retiring ship ${data.ship.name}...`);
  
  // Final retirement
  data.ship.floating = false;
  data.ship.status = "retired";
  data.ship.retiredAt = new Date().toISOString();
  
  // Add completion summary
  data.retirement = {
    completedAt: new Date().toISOString(),
    crewProcessed: data.ship.crewOffboardedAt,
    cargoProcessed: data.ship.cargoUnloadedAt,
    success: true
  };
  
  console.log(`Ship ${data.ship.name} successfully retired!`);
  
  // Mark task as complete
  task.complete();
};
```

### Step 7: Watch the Magic

```bash
# List your steps
aloma step list

# Check the task execution
aloma task list

# View detailed logs of the task execution
aloma task log <task-id> --logs --changes
```

**What you'll see:**

1. Steps 1 and 2 run in parallel (both conditions match initially)
2. Step 3 waits until both previous steps complete
3. The final step processes and completes the task

### Step 8: Test Different Scenarios

```bash
# Create a ship that's already retired (no steps will run)
aloma task new "already retired ship" -d '{
  "ship": {"name": "Beta", "floating": false, "status": "retired"}
}'

# Create a ship with no cargo (only crew step runs)
aloma task new "empty cargo ship" -d '{
  "ship": {"name": "Gamma", "floating": true, "cargo": [], "crew": 10, "status": "active"}
}'

# Create a ship with no crew (only cargo step runs)
aloma task new "automated ship" -d '{
  "ship": {"name": "Delta", "floating": true, "cargo": ["containers"], "crew": 0, "status": "active"}
}'
```

### Understanding What Happened

**Conditional Execution**: Each step only ran when its conditions were met. Unlike traditional workflows, there's no predefined sequence.

**Parallel Processing**: Crew and cargo steps ran simultaneously because both conditions matched the initial data.

**Data Evolution**: Each step modified the task data, potentially triggering new steps to become eligible.

**Automatic Orchestration**: ALOMA handled the execution order based on data dependencies, not manual configuration.

**Flexibility**: Different input data triggered different combinations of steps automatically.

### Key Insights

**Think Data State, Not Sequence**: Instead of "do A then B then C", think "when data looks like X, do Y".

**Conditions Drive Flow**: Steps activate when their conditions match the current task data.

**Parallel by Default**: Multiple steps can run simultaneously if their conditions are met.

**Self-Organizing**: The workflow emerges from the data patterns, not predefined paths.

### Next Steps

You've just experienced ALOMA's fundamental difference from traditional automation tools. The conditional execution model scales from this simple example to complex enterprise automations with hundreds of steps.

**Ready for real integrations?** Try the [Email Newsletter Automation Example](https://claude.ai/chat/email-newsletter-example.md) to see ALOMA working with Gmail and Google Sheets.

**Want to understand the paradigm deeper?** Read [Understanding Conditional Steps](https://claude.ai/chat/understanding-conditional-steps.md) to master ALOMA's approach.

**Ready to build production automations?** Explore our [Development Guide](https://claude.ai/development-guide/) for advanced patterns and deployment strategies.
