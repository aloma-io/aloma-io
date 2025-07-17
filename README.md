# ALOMA

**No infra. No no-code. Just code and let ALOMA handle the rest.**

ALOMA is a code-first workflow automation platform that lets you define automation logic in JavaScript, send data via JSON webhooks, and instantly deploy and test each step on our infrastructure.

## Quick Start

**Get up and running in 5 minutes:**

1. **Install the CLI**
   ```bash
   npm install -g @aloma.io/aloma
   ```

2. **Setup and authenticate**
   ```bash
   aloma setup
   aloma auth
   ```

3. **Deploy your first workflow**
   ```bash
   # Clone an example
   git clone https://github.com/aloma-io/aloma-io.git
   cd aloma-io/examples/hubspot
   
   # Update the API token in the deploy file
   
   # Then deploy
   aloma deploy deploy.yaml
   ```

**New to ALOMA?** Start with our [toy example](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md) to understand the basics, then check out the [complete getting started guide](https://github.com/aloma-io/aloma-io/tree/main/docs/getting-started).

## How It Works

ALOMA processes **tasks** (schemaless JSON payloads) through **steps** (JavaScript logic with matching conditions). When a task matches a step's conditions, the step executes and updates the task, potentially triggering downstream logic via **connectors** - reusable wrappers to external services.

**Key concepts:**
- **Tasks** - JSON payloads (including files) streamed into your workspace
- **Steps** - JavaScript logic with matching conditions that process tasks
- **Connectors** - Authorized, reusable wrappers to external services

## Why Choose ALOMA?

**Pipeline nightmares solved.** Traditional tools are either brittle, inflexible and hard-to-debug like n8n or require you to build out a full infrastructure as code application and maintain it. ALOMA's code-first approach to automation combined with a fully hosted platform makes it easy to build the complex pipelines you need:

- **Easy to debug** - Use and IDE to write and debug your pipelines
- **Developer-friendly** - Work in your preferred IDE or our web-based IDE
- **Robust platform** - Automatic scaling with parallel processing and exception handling

## What You Can Build

- **AI Agents** - Intelligent automation with decision-making logic
- **Data Pipelines** - Transform and route data between systems
- **Application Integrations** - Connect services and automate workflows
- **Custom Workflows** - Any logic that can be expressed in JavaScript

## Development Options

**CLI Development** (Recommended)
- Use your preferred IDE and tools
- Full version control integration
- [CLI Documentation](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

**Web UI Development**
- Browser-based IDE
- Great for quick prototyping
- [Web UI Documentation](https://github.com/aloma-io/aloma-io/blob/main/docs/web-UI)

## Examples & Resources

- **[Example Workflows](https://github.com/aloma-io/aloma-io/tree/main/examples)** - Ready-to-deploy workflows including HubSpot, Slack, and more
- **[Complete Documentation](https://github.com/aloma-io/aloma-io/tree/main/docs)** - Full user guide and API reference
- **[Connector SDK](https://github.com/aloma-io/connectors)** - Build your own connectors

**Need a new cloud connector?** Email us at connector-request@aloma.io

## Prerequisites

- Node.js (for CLI usage)
- [ALOMA account](https://home.aloma.io) (sign up for free)

## License

Licensed under the MIT License.


