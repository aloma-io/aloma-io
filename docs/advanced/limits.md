# Limits

Processing and execution limits in aloma.

## Task Data Size

The size of the task data is limited, because it has to fit into an execution runtime.

You will receive a message notifying before you hit the limit: `⚠️ Your task data is using 84 bytes of memory. The maximum size is X bytes.`.

Once you will hit the limit, the task will be stopped with an error.

To lower memory consumption of data in the task, you can:

* process data inside one step only and not store in the task data
* use `file.write`, `file.read` to pass bigger data between steps
* use `blob.create` to share data with connectors or pass data between steps

## Step Execution Time

The execution of a step is limited with a maximal time. If this limit is hit, an `⚠️ execution timeout` error is raised.

To lower execution time of step, you can:

* split a task into multiple subtasks so to partition computation
* move the computation into a connector, maybe also add an asynchronous computation protocol in the connector 