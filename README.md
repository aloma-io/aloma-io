# ALOMA

**No infra. No no-code. Just code and let ALOMA handle the rest.**

---

## Overview

ALOMA is a code-first workflow automation platform.

Define your automation logic in **coded JavaScript** steps. Send data to ALOMA in **JSON** using Webhooks or API calls. Build your workflows step-by-step by **instantly deploying and testing** each step on our infrastructure.

Use with the **CLI** to edit in your own IDE, or use our **web-based IDE** in the UI.

**Tasks**, which are schemaless JSON payloads (including files), are streamed into your Aloma workspaces. ALOMA continuously evaluates the tasks against available steps and executes those that match; each **step** containing matching conditions and a block of JavaScript logic. The task is continuously updated after step execution, triggering downstream logic as needed by invoking **connectors** - authorised, reusable wrappers to external services. 

**Automation-as-code**, self-contained steps structured with IDE, makes debugging and maintenance easy - especially as compared to no-code tools like n8n. It also makes it easy to build long, complex workflows with many paths, as the conditions in the step controls when it is triggered. Adding the 100th step to a workflow is as easy as adding the first.

Use ALOMA to build your AI Agents, pipelines, application integrations - any workflow where data can be sent to ALOMA in JSON logic, can be expressed in code, and can trigger services that can be reached by our connectors.

The ALOMA platform is robust and automatically scales to handle your workloads. Tasks are processed in parallel, with built in exception handling.


## Documentation

The general user documentation for ALOMA, is located under the docs directory [docs directory](https://github.com/aloma-io/aloma-io/tree/main/docs) of the present repo here including for the CLI.

There is a growing [library of workflows with steps](https://github.com/aloma-io/aloma-io/tree/main/examples) that can be deployed to your ALOMA workspace via the CLI as per instructions. Please feel free to share your steps here for the community.

There is a [connector repo](https://github.com/aloma-io/connectors) with an SDK to build an on prem connector for your local environment and several example connectors,

Please send requests for new cloud connectors to us here at connector-request@aloma.io.


## Getting Started with CLI

This guide will walk you through installing the CLI, authenticating, and deploying your first automation example using a HubSpot connector. 

[Signing up for an account](https://home.aloma.io).

Ensure **Node.js Installed**


### Step 1: Install the CLI


```bash
npm install -g aloma-1.0.0.tgz
```

### Step 2: Setup

```bash
aloma setup
```

This command configures your CLI environment.

### Step 3: Authenticate

```bash
aloma auth
```

This will guide you through authentication via your Aloma account.

We’ll now deploy a HubSpot integration workflow as an example.

### Step 4: Get the Example Folder

Download or clone the example folder containing the [**HubSpot example**](https://github.com/aloma-io/aloma-io/tree/main/examples/hubspot).

Note, there are other example workflows you can choose from here [**examples**](https://github.com/aloma-io/aloma-io/tree/main/examples) along with documentation. You can install a different workflow if you prefer using the same commands.

### Step 5: Update API Token

Inside the project folder, open:

```text
connector/connector-hubspot.json
```

Replace the placeholder with your actual HubSpot token:

```json
"apiToken": "your-real-token-here"
```
### Step 6: Deploy the Workflow

Inside the folder, run:

```bash
aloma deploy deploy.yaml
```

This will deploy your automation to the Aloma platform.

---

## Next Steps

Now that you've set up and deployed the Hubspot connector with example steps to get contacts and get companies, you can start automating with ALOMA.

- [Access ALOMA getting started documentation](https://github.com/aloma-io/aloma-io/tree/main/docs/getting-started)
- [Watch the Toy getting started video and documentation](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md)
- [Read documentation for the Hubspot Example](https://github.com/aloma-io/aloma-io/tree/main/examples/hubspot)
- [Access more example workflows](https://github.com/aloma-io/aloma-io/tree/main/examples)
- Join the community (coming soon!)


## License
Licensed under the Apache 2.0 License.



