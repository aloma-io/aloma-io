
# 🚀 Getting Started

## Overview

In order to get a good understanding of aloma, we are going to:

1. Learn about integration by adding a webhook and an airtable connector
2. Learn about tasks by triggering an incoming event via restninja
3. Learn about steps by seeing a task being solved by aloma

## Prerequisites

You need:

* An account with [aloma](https://home.aloma.io/).
* An free account with [airtable](https://airtable.com/signup).

## Video Tutorial

Please watch an follow the steps in this tutorial.

<video controls width="100%">
  <source src="/static/asset/getting-started.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
  

## Assets


The payload for restninja:

```json title="Rest"
{
  "presents":
  [
    {"name": "RC Car", "quantity": 1},
    {"name": "Water Pistol", "quantity": 2}
  ]
}
```

