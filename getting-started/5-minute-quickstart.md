# 5-minute Quickstart

## 5-Minute Quickstart

Build your first ALOMA automation in under 5 minutes. We'll create a multi-step workflow that processes ship retirement with conditional logic to demonstrate ALOMA's core concepts.

### What You'll Build

A simple automation that:

* Receives ship data as JSON
* Processes crew offboarding when conditions are met
* Handles cargo unloading independently
* Retires the ship only after both tasks complete
* Demonstrates ALOMA's conditional execution model

### Prerequisites

* [ALOMA account](https://home.aloma.io/) (free signup and free 30 day Pro trial - 5000 tasks)
* Basic JavaScript knowledge

### Step 1: Create Your Workspace

1. Sign up at [home.aloma.io](https://home.aloma.io/)
2. You'll automatically get a "Getting Started" workspace
3. Click on your workspace to enter it

### Step 2: Create a Task

Tasks are JSON data that trigger your workflows. Let's create our ship data:

1. Navigate to **Tasks** tab in the left sidebar
2. Click **New Task**
3. Name it "retire ship"
4. Paste this JSON data:

```json
{
  "ship": {
    "floating": true,
    "cargo": ["fish", "oil", "tires"],
    "crew": 100,
    "status": "active"
  }
}
```

5. Click **Create**

### Step 3: Build Your First Step - Offboard Crew

Now we'll create conditional steps that respond to data patterns:

1. Click **Add New Step** (you should see this option)
2. Name the step: "offboard crew"
3. Set the **Condition** (when this step runs):

```json
{
  "ship": {
    "crew": 100,
    "floating": true
  }
}
```

4. Add the **Code** (what happens when condition matches):

```javascript
  console.log('Offboarding crew...');
  data.ship.crew = 0;
  data.ship.crewOffboarded = true;
  console.log('Crew offboarded successfully');
```

5. Save the step

### Step 4: Create Second Step - Unload Cargo

This step runs independently of crew offboarding:

1. Click **Add New Step**
2. Name: "unload cargo"
3. **Condition**:

```json
{
  "ship": {
    "cargo": Array,
    "floating": true
  }
}
```

4. **Code**:

```javascript
  console.log('Unloading cargo:', data.ship.cargo);
  data.ship.cargo = [];
  data.ship.cargoUnloaded = true;
  console.log('Cargo unloaded successfully');
```

5. Save the step

### Step 5: Final Step - Retire Ship

This step only runs after both previous steps complete:

1. Click **Add New Step**
2. Name: "retire ship"
3. **Condition** (notice how this waits for both previous steps):

```json
{
  "ship": {
    "crewOffboarded": true,
    "cargoUnloaded": true,
    "floating": true
  }
}
```

4. **Code**:

```javascript
  console.log('All prerequisites met. Retiring ship...');
  data.ship.floating = false;
  data.ship.status = "retired";
  data.ship.retiredAt = new Date().toISOString();
  console.log('Ship retired successfully!');
  
  // Complete the task
  task.complete();
```

5. Save the step

### Step 6: Test Your Automation

Now let's see ALOMA's conditional execution in action:

1. Go back to your **"retire ship"** task
2. Click **Execute** or **Run**
3. Watch the real-time execution in the task view

You'll see:

* **Step matching**: ALOMA finds steps with conditions that match current data
* **Data transformation**: Each step modifies the task data
* **Conditional progression**: Final step waits for prerequisites
* **Automatic completion**: Process stops when `task.complete()` is called

### What Just Happened?

You've experienced ALOMA's core innovation: **data-triggered automation**

#### Traditional Approach Would Be:

```javascript
// Rigid sequence - everything breaks if one step fails
function retireShip(ship) {
  offboardCrew(ship);      // Must happen first
  unloadCargo(ship);       // Must happen second  
  retireShip(ship);        // Must happen third
}
```

#### ALOMA's Conditional Approach:

```javascript
// Flexible conditions that adapt to data state
// When ship has crew AND is floating → Offboard crew
// When ship has cargo AND is floating → Unload cargo  
// When crew offboarded AND cargo unloaded → Retire ship
```

#### Key Benefits You Just Saw:

1. **Automatic orchestration**: ALOMA determined execution order based on data
2. **Self-organizing logic**: Each step knew when it could run
3. **Fault tolerance**: If one step failed, others could still proceed
4. **Incremental complexity**: Easy to add new steps without breaking existing logic

### Step 7: Add Email Notification (Optional)

Let's add a connector to send notifications:

1. Go to **Integrations** → **Connectors**
2. Click **Manage Connectors**
3. Add **"E-Mail (SMTP - OAuth)"** connector
4. Complete OAuth setup for your email
5. Create new step "send notification":

**Condition:**

```json
{
  "ship": {
    "status": "retired"
  }
}
```

**Code:**

```javascript
  await connectors.eMailSmtpOAuth.sendEmail({
    to: 'your-email@example.com',
    subject: 'Ship Retirement Complete',
    html: `
      <h2>Ship Retirement Notification</h2>
      <p>Ship has been successfully retired at ${data.ship.retiredAt}</p>
      <p>Status: ${data.ship.status}</p>
    `
  });
  
  console.log('Notification sent successfully');
```

### Understanding the Data Flow

Watch how your data transformed through each step:

**Initial data:**

```json
{
  "ship": {
    "floating": true,
    "cargo": ["fish", "oil", "tires"],
    "crew": 100,
    "status": "active"
  }
}
```

**After crew step:**

```json
{
  "ship": {
    "floating": true,
    "cargo": ["fish", "oil", "tires"],
    "crew": 0,
    "crewOffboarded": true,
    "status": "active"
  }
}
```

**After cargo step:**

```json
{
  "ship": {
    "floating": true,
    "cargo": [],
    "crew": 0,
    "crewOffboarded": true,
    "cargoUnloaded": true,
    "status": "active"
  }
}
```

**Final result:**

```json
{
  "ship": {
    "floating": false,
    "cargo": [],
    "crew": 0,
    "crewOffboarded": true,
    "cargoUnloaded": true,
    "status": "retired",
    "retiredAt": "2025-01-15T10:30:00Z"
  }
}
```

### Try Different Scenarios

Experiment with different starting conditions:

**Scenario 1 - Ship with no crew:**

```json
{
  "ship": {
    "floating": true,
    "cargo": ["containers"],
    "crew": 0,
    "status": "active"
  }
}
```

_Result: Only cargo step runs, ship can't be retired without crew step_

**Scenario 2 - Ship with no cargo:**

```json
{
  "ship": {
    "floating": true,
    "cargo": [],
    "crew": 50,
    "status": "active"
  }
}
```

_Result: Only crew step runs, ship can't be retired without cargo step_

**Scenario 3 - Already retired ship:**

```json
{
  "ship": {
    "floating": false,
    "cargo": [],
    "crew": 0,
    "status": "retired"
  }
}
```

_Result: No steps run because conditions aren't met_

### Next Steps

Now that you understand the basics:

1. [**Understanding Conditional Steps**](https://claude.ai/chat/understanding-conditional-steps.md) - Deep dive into the paradigm
2. [**Core Concepts**](https://claude.ai/chat/core-concepts.md) - Learn about workspaces, tasks, and integrations
3. [**Development Guide**](https://claude.ai/chat/development-guide.md) - Use CLI and advanced patterns
4. [**Examples & Tutorials**](https://claude.ai/chat/examples-tutorials.md) - See real-world implementations

### Common Questions

**Q: Why doesn't my step run?** A: Check that your condition exactly matches the current data structure. ALOMA only runs steps when conditions are precisely met.

**Q: Can I force a specific order?** A: While ALOMA is designed for conditional execution, you can create dependencies by having later steps require data that earlier steps create.

**Q: How do I debug my automation?** A: Use `console.log()` statements in your steps and check the task execution logs to see what data is available at each step.

**Q: Can steps run multiple times?** A: By default, each step runs once when its condition is met. Use `step.redo()` if you need to repeat execution.

### Congratulations!

You've built your first ALOMA automation and experienced the power of conditional execution. This approach scales from simple workflows like this to complex enterprise automations with hundreds of steps.

**Ready to build something real?** Check out our [Examples & Tutorials](https://claude.ai/chat/examples-tutorials.md) to see ALOMA handling real business processes.
