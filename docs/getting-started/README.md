# Getting Started with ALOMA

## Resources

This ReadMe provides an overview of how ALOMA works, read it to get a basic understanding of the ALOMA Automation Flow.

- The [toy example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md) applies these basics and sets up commands using the example of offloading a ship.
- [Workspace](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/workspaces.md) are the environments where automations run. 
- [Integrations](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/integration.md) get data in and out of ALOMA through connectors (authorised, reusable wrappers to external services including API) and Webhooks.
- [Tasks](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/tasks.md) are data that trigger workflows to be built and automated.  
- [Steps](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/steps.md) are the individual code steps that form a workflow. 

## The ALOMA Automation Flow


**Account**: User access, usage reporting and creating workspaces are all done at the account level.

[**Workspace**](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/workspaces.md): Integrations, connectors and webhooks, steps and tasks are all defined in a workspace. Each workspace requires its own connectors - for example if you have a Slack connector in Workspace A and want to now use Slack in Workspace B, you need to add a new, independent Slack connector to Workspace B.

[**Integrations**](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/integration.md): These are connectors and Webhooks. Connectors allow access to an external service, which can be an API but can also be databases or other services. ALOMA does not have databases, data schemas ... Databases and other services can be made accessible via connectors, which are available through ALOMA as cloud based or can be built on prem with the connector SDK.

[**Tasks**](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/tasks.md): Tasks are sent to ALOMA as JSON and can be manually created in ALOMA, sent in via a Webhook or through a connector. 

Example: 
```bash
{
  "runMe": true
}
```

[**Steps**](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/steps.md): Steps contain the execution logic and consist of conditions, which match it to a task and determine when it can be used, and code, which is executed when the step matches.

Example:
```bash
Condition
{
  "runMe": true
}

Code
console.log('runMe success');
data.runMeComplete = true;
```


**Automation execution**: Upon receipt of a task, ALOMA finds steps that have conditions that match to the task data. If multiple steps match the task, the step with the "best match" is selected. The step code is executed against the task data and can update the task data during execution. After execution of a step, a new step is matched and executed. This continues until either there are no more matching steps or a step completes the step.

New task data after above example step runs on the example task:
```bash
{
  "runMe": true,
  "runMeComplete": true
}
```
Task completion command:
```bash
task.complete()
```

Steps are flexible and can run a connector and send Webhooks - in effect they can also launch new tasks by sending JSON to a Webhook. They execute in parallel and as the workflows are built (steps sequenced) for each task in real time, an error or failure does not impact the execution or automation of any other tasks.

## Building your first Automation

The best way to start with ALOMA is to create a task in an empty workspace. This can be done from the Task screen by clicking on New Task in the upper right. Enter the JSON directly and a task will be created. Steps can then be added, deployed and tested individually until all are required.

It is much easier to build the workflows iteratively and starting with context data.

See the [toy example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md) for how to do this very simply using the WebUI.
