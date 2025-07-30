# Tasks

About tasks.

## Data

A task is valid `JSON` data. While processing a task, data may be changed.

```js
// add/change data
data.value = 15 + data.value;
data.something = {value: true}
data.something.foo = "a string"

// remove once irrelevant/processed
delete(data.value)
```

A task is `done` once all data is removed (i.e.: `data === {}`)

## Builtins

Builtins for tasks.

### Name

While solving a task one might discover relevant information that should be present in the task name.
It is not recommended to frequently change the task name. 

```js
// get an set the name of a task
task.name(`${task.name()} new name`);
```

### Tags - Classification

Assign tags to each task; those tags form the foundation for any automated checks the system performs on it.

```js
// get an set the tags of a task
task.tags([...task.tags(), 'support', 'card', 'blocked']);
```

### Stash

The stash keeps confidential data local to the task. It can be matched by type, but the data is not useable in the step editor.

```js
// will be represented in the task as data.$stash.confidential === "number";
data.$stash.confidential = 15;
```
