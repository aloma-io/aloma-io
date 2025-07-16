## Getting Started with CLI

This guide will walk you through installing the CLI, authenticating, and deploying your first automation example using a HubSpot connector. 

[Signing up for an account](https://home.aloma.io).

Ensure **Node.js Installed**


### Step 1: Install the CLI


```bash
npm install -g @aloma.io/aloma
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
