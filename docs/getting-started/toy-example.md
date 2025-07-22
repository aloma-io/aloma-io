
# ALOMA Toy Example

Build your first automation with ALOMA in under 10 minutes.

In this walkthrough, you'll create a simple multi-step workflow to simulate retiring a ship — complete with conditional execution, state changes, and an optional email notification. You'll learn how to define tasks, write matching logic, and deploy code in real time.

This example uses the WebUI, equivalent CLI commands can be found in the [documentation](../CLI)

---

## What You'll Learn

- How to create tasks and steps in ALOMA
- How matching conditions control workflow execution
- How to build complex workflows iteratively
- How to test and deploy instantly

---

## Table of Contents

- [Pre-requisites](#pre-requisites)
- [The Story](#the-story)
- [Video Tutorial](#video-tutorial)
- [Before You Begin](#before-you-begin)
- [Creating the Task](#creating-the-task)
- [Building the Workflow](#building-the-workflow)
  - [Step 1: Offboard Crew](#step-1-offboard-crew)
  - [Step 2: Unload Cargo](#step-2-unload-cargo)
  - [Step 3: Retire Ship](#step-3-retire-ship)
- [Instant Deployment and Testing](#instant-deployment-and-testing)
- [Bonus: Sending Notifications via Email](#bonus-sending-notifications-via-email)
- [What You Learned](#what-you-learned)

---

## Pre-requisites

- A registered account at [ALOMA](https://home.aloma.io)

## The Story

The toy automation simulates a simple real-world process: **retiring a ship**.

Business rules:

- Instructions must be carried out individually
- The ship can only be retired *after* both cargo and crew are offboarded

## Video Tutorial

**Watch the full walkthrough before proceeding.**

[![Toy Example](https://img.youtube.com/vi/v82olgYyuDI/0.jpg)](https://www.youtube.com/watch?v=v82olgYyuDI)

---

## Before You Begin

1. [Login to ALOMA](https://home.aloma.io)
2. Enter the **Getting Started** workspace

![Getting Started Screen](../static/asset/img/getting-started-screen.png)

---

## Creating the Task

1. Go to the **Tasks** tab  
   ![Task Tab](../static/asset/img/task-menu-selection.png)

2. Click `New Task`  
   ![New Task](../static/asset/img/new-task.png)

3. Name it `retire ship`  
4. Paste in the following JSON and hit `Create`:

```json
{
  "ship": {
    "floating": true,
    "cargo": ["fish", "oil", "tires"],
    "length": "100m",
    "crew": 100
  }
}
```

![Enter Task](../static/asset/img/enter-new-task.png)

> In production, tasks usually come from other systems (e.g. Webhooks). We're using the UI for simplicity.

---

## Building the Workflow

### Step 1: Offboard Crew

1. Click `Add New Step`

![Step Start](../static/asset/img/retire-ship-1.png)

2. Name the step `offboard crew`  
   ![Name Step](../static/asset/img/name-new-step.png)

3. Click on `match invalid`
![matching-conditions-json](../static/asset/img/blank-step.png)

4. Set the Match Condition and `x` to close:

```js
{
  ship: {
    crew: 100
  }
}
```

![Match JSON](../static/asset/img/matching-json.png)

5. Add the code:

```js
data.ship.crew = 0;
console.log('offboarded crew');
```

![Code Step](../static/asset/img/code-new-step.png)

6. Click **Save**, then press the lightning bolt icon  
   ![Relaunch Task](../static/asset/img/relaunch-task.png)

7. Confirm execution:  
   ![Task Executed](../static/asset/img/second-task-execution.png)

8. Click **Change** to see the task data diff
   ![Code Shown](../static/asset/img/show-changes.png)
   
   ![Data Changes](../static/asset/img/data-changes.png)

---

### Step 2: Unload Cargo

1. Add a new step: `unload cargo`

2. Match Condition:

```js
{
  ship: {
    cargo: [String]
  }
}
```

3. Code:

```js
data.ship.cargo.forEach((item) => console.log(`unloaded ${item}`));
delete(data.ship.cargo);
```

4. Re-run using lightning bolt  
   ![Relaunch Task Again](../static/asset/img/relaunch-task.png)

5. Result:  
   ![Task Executed with Cargo](../static/asset/img/task-execution-2.png)

6. To ensure crew is offboarded first, update match condition by clicking on **Matches Task** and replacing the existing condition:

```js
{
  ship: {
    cargo: [String],
    crew: 0
  }
}
```

![Match Crew and Ship](../static/asset/img/match-crew-and-ship.png)

7. As the condition is no longer matching with the task data, it shows `No Match`:  
   ![No Match](../static/asset/img/step-no-match.png)

8. Re-run task and the crew has been offboarded first:  
   ![Execution Order Confirmed](../static/asset/img/task-execution-3.png)

---

### Step 3: Retire Ship

1. Add a step: `retire ship`

2. Match Condition:

```js
{
  ship: {
    crew: 0,
    cargo: null
  }
}
```

3. Code:

```js
console.log('retiring the ship');
delete(data.ship);
```

Re-run the task and confirm all steps execute in order.

---

## Instant Deployment and Testing

Experiment with conditions, add new steps and create new tasks with new data.
- Click the lightning bolt to re-trigger using same data
- Logs and data diffs update instantly
- Code changes are live as soon as you hit **Save**

To mark task as complete after retiring the ship, add this code as the last line to the `retire ship` step:

```js
task.complete();
```

Create a new task and confirm:  

![Task Done](../static/asset/img/task-done.png)

---

## Bonus: Sending Notifications via Email

1. Go to **Settings → Integrations**

![integration-menu](../static/asset/img/integration-menu.png)

2. Under **Connectors**, add `Email (SMTP - OAuth)`

![email smtp connector](../static/asset/img/email-smtp-connector.png)

3. Connect and authorize

![connect-email](../static/asset/img/connect-email.png)

4. In the `retire ship` step, add before `task.complete()`:

```js
connectors.eMailSmtpOAuth.send({
  from: "youremail@company.com",
  to: "someone@company.com",
  subject: 'Ship has been retired',
  html: `
    <p>Dear Joe,</p>
    <p>The ship that arrived today has been retired!</p>
    <p>Kind Regards,<br>Aloma team</p>
  `
});
```

![email-in-step](../static/asset/img/email-in-step.png)

Run the task again. A notification will be sent by email.

---

## What You Learned

- Create and trigger a task in ALOMA  
- Define matching conditions and step logic  
- Deploy and test instantly  
- Control step order using data dependencies  
- Extend workflows with external integrations

---

[Next: Build your first real-time integration ›](../connectors/README.md)
