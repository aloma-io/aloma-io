# Kitchen Sink

Aloma in 10 Minutes.


## The Story

Aloma solves tasks.

The toy task we want to solve is `Retire a ship`. 

Like any real world process, it has certain requirements:

* The ship can be retired only after the cargo and crew have been offboarded
* Only the captain can retire the ship
* Offboarding the crew and unloading the cargo are handled by two different responsible parties

## Video Tutorial

Watch this first!

<video controls width="100%">
  <source src="/static/asset/kitchen-sink.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Before you begin

Create a new workspace named `Kitchen sink` in your [dashboard](https://home.aloma.io/) and switch to it.

## Creating the Task

A task is any valid `JSON` data, e.g.: 

```json title="Our toy task for ship retirement"
{
  "ship":
  {
    "floating": true,
    "cargo": ["fish", "oil", "tires"],
    "length": "100m",
    "crew": 100
  }
}
```

In your aloma workspace click `new task`, name it `retire ship`, paste the json, deselect `open in visualizer` and hit `create`.

> **Note:** Normally you integrate aloma with other systems to obtain tasks. We will use the UI to create an example task.

Once you create a new task, you will be redirected to it.

By clicking on `Timeline` switch to the `Development` view in order to create the first step.

## Offboarding the Crew

On the right click on the `+` sign to create a new step. Name it `offboard crew`. Hit `create`.

The step consists of two parts, a `match` and the `code` to apply. Copy the parts over to the step.

* Click on `match invalid` and paste the match:

```js title="match - offboard crew"
{
  ship: {
    crew: 100
  }
}
```

> **Note:** This step claims responsibility on the **crew** of the ship only and ignores the rest of the task data.

* Copy the following code into the step and save the step:

```js title="code - offboard crew" showLineNumbers
data.ship.crew = 0

console.log('offboarded crew');
```

Go back to your task and click `+` to create a new task from the current one and see that the `offboarding crew` step is executed.

## Unloading the Cargo

In the task click on the `+` sign next to the last step executed on the right to create a new step. Name it `unload cargo`. Hit `create`.

* Click on `match invalid` and paste the following:

```js title="match - unload cargo"
{
  ship: {
    cargo:[String]
  }
}
```

> **Note:** This step claims responsibility on the **cargo** of the ship only and ignores the rest of the task data.

* Copy the following code into the step and save the step:

```js title="code - unload cargo" showLineNumbers
data.ship.cargo.forEach((item) => console.log(`unloaded ${item}`));

delete(data.ship.cargo)
```

Go back to your task and click `+` to create a new task from the current one and see that the `offboarding crew` step is executed as well.

## Retiring the ship

Create a new step named `retire ship`, copy the parts over and save it:

```js title="match - retire ship"
{
  ship: {
    crew: 0,
    cargo: null
  }
}
```

> **Note:** This step claims responsibility on the **cargo** of the ship only and ignores the rest of the task data.

* Copy the following code into the step and save the step:

```js title="code - retire ship" showLineNumbers
console.log('retiring the ship');

delete(data.ship);
```

<br />

> **Success:** Create a new task from the last one and see that all steps are applied and the task is marked as done. 