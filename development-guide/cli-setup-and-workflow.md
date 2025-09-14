# CLI Setup and Reference Guide

## CLI Setup and Reference Guide

### CLI Setup & Reference Guide

**The ALOMA CLI is your primary interface for building, deploying, and managing automations. This guide covers installation, configuration, and provides a complete command reference for professional development workflows.**

***

### Installation and Setup

#### Prerequisites

Ensure you have the required tools installed:

```bash
# Verify Node.js installation (required)
node --version  # Should be v16+ 

# Verify npm is available
npm --version
```

If Node.js isn't installed, download it from [nodejs.org](https://nodejs.org/).

#### Install the ALOMA CLI

```bash
# Install ALOMA CLI globally
npm install -g @aloma.io/aloma

# Verify installation
aloma --version
aloma --help
```

#### Initial Configuration

```bash
# Configure CLI environment
aloma setup

# Authenticate with your ALOMA account
aloma auth

# Verify setup
aloma workspace list
```

The `aloma auth` command opens your browser to authenticate. Once authenticated, your session token is stored locally.

***

### Complete Command Reference

#### Global Commands

**`aloma --help`**

Display global help and available commands

**`aloma --version`**

Show CLI version information

**`aloma setup`**

Configure CLI environment and defaults

**`aloma auth`**

Authenticate with your ALOMA account (opens browser)

***

#### Workspace Management

**`aloma workspace list`**

List all available workspaces

```bash
aloma workspace list
```

**`aloma workspace show`**

Display current workspace details

```bash
aloma workspace show
aloma workspace show <workspace-name>
```

**`aloma workspace add <name>`**

Create a new workspace

```bash
aloma workspace add "My Project" --tags "dev,api"
aloma workspace add "Production" --tags "prod"
```

**Options:**

* `--tags <tags>` - Comma-separated tags for organization

**`aloma workspace switch <name>`**

Switch to a different workspace

```bash
aloma workspace switch "Development"
aloma workspace switch "My Project"
```

**`aloma workspace update`**

Update workspace configuration

```bash
aloma workspace update --env-var "API_ENDPOINT=https://api.dev.company.com"
aloma workspace update --notification-groups "dev@company.com,alerts@company.com"
aloma workspace update --health-enabled true
```

**Options:**

* `--env-var <key=value>` - Set environment variable
* `--notification-groups <emails>` - Configure notification recipients
* `--health-enabled <true|false>` - Enable health monitoring

***

#### Step Management

**`aloma step list`**

List all steps in current workspace

```bash
aloma step list
aloma step list --filter "customer"
```

**Options:**

* `--filter <term>` - Filter steps by name or content

**`aloma step show <step-id>`**

Display detailed step information

```bash
aloma step show <step-id>
aloma step show <step-id> --verbose
```

**Options:**

* `--verbose` - Show detailed step configuration

**`aloma step add <name>`**

Create a new step

```bash
aloma step add "process_customer"
aloma step add "validate_email" --description "Email validation logic"
```

**Options:**

* `--description <text>` - Step description

**`aloma step edit <step-id>`**

Open step editor for quick changes

```bash
aloma step edit <step-id>
```

**`aloma step clone <step-id>`**

Create a copy of an existing step

```bash
aloma step clone <step-id> --name "process_customer_v2"
```

**Options:**

* `--name <name>` - Name for cloned step

**`aloma step pull`**

Pull steps to local files for IDE editing

```bash
aloma step pull
aloma step pull -p ./steps
aloma step pull --path ./automation/steps
```

**Options:**

* `-p, --path <path>` - Local directory for step files

**`aloma step sync`**

Sync local step files to workspace

```bash
aloma step sync -p ./steps
aloma step sync --path ./automation/steps
```

**Options:**

* `-p, --path <path>` - Local directory containing step files

***

#### Task Management

**`aloma task list`**

List tasks with optional filtering

```bash
aloma task list
aloma task list --state running
aloma task list --state error
aloma task list --state done | head -10
aloma task list --limit 50
```

**Options:**

* `--state <state>` - Filter by task state (running, done, error, pending)
* `--limit <number>` - Limit number of results

**`aloma task new <name>`**

Create a new task

```bash
aloma task new "test customer" -d '{"customer":{"email":"test@example.com"}}'
aloma task new "health check" -d '{"healthCheck":true}'
aloma task new "debug task" -f ./task-data.json
```

**Options:**

* `-d, --data <json>` - Task data as JSON string
* `-f, --file <path>` - Task data from JSON file

**`aloma task log <task-id>`**

View task execution logs

```bash
aloma task log <task-id>
aloma task log <task-id> --logs --changes
aloma task log <task-id> --step 1 --logs
aloma task log <task-id> --verbose
```

**Options:**

* `--logs` - Include execution logs
* `--changes` - Show data changes between steps
* `--step <number>` - Show logs for specific step
* `--verbose` - Show detailed execution information

***

#### Connector Management

**`aloma connector list-available`**

List all available connectors

```bash
aloma connector list-available
aloma connector list-available -f slack
aloma connector list-available -f hubspot
```

**Options:**

* `-f, --filter <term>` - Filter by service name

**`aloma connector list`**

List connectors in current workspace

```bash
aloma connector list
aloma connector list --verbose
```

**Options:**

* `--verbose` - Show detailed connector information

**`aloma connector add <connector-id>`**

Add connector to workspace

```bash
aloma connector add <connector-id> -n "My HubSpot Integration"
aloma connector add <connector-id> --name "Production API"
```

**Options:**

* `-n, --name <name>` - Custom connector name

**`aloma connector show <instance-id>`**

Show detailed connector information

```bash
aloma connector show <instance-id>
aloma connector show <instance-id> --config
```

**Options:**

* `--config` - Show configuration details

**`aloma connector oauth <instance-id>`**

Configure OAuth authentication

```bash
aloma connector oauth <instance-id>
```

**`aloma connector logs <instance-id>`**

View connector execution logs

```bash
aloma connector logs <instance-id>
aloma connector logs <instance-id> --tail
```

**Options:**

* `--tail` - Follow logs in real-time

**`aloma connector update <instance-id>`**

Update connector configuration

```bash
aloma connector update <instance-id> -n "Updated Name"
aloma connector update <instance-id> --config '{"apiKey":"new-key"}'
```

**Options:**

* `-n, --name <name>` - Update connector name
* `--config <json>` - Update configuration

**`aloma connector delete <instance-id>`**

Remove connector from workspace

```bash
aloma connector delete <instance-id>
aloma connector delete <instance-id> --force
```

**Options:**

* `--force` - Skip confirmation prompt

***

#### Secret Management

**`aloma secret list`**

List all secrets in current workspace

```bash
aloma secret list
aloma secret list --show-values
```

**Options:**

* `--show-values` - Display secret values (use carefully)

**`aloma secret add <name> <value>`**

Add a new secret

```bash
aloma secret add "API_KEY" "your-api-key-here"
aloma secret add "DATABASE_URL" "postgresql://user:pass@host:5432/db" --encrypted
```

**Options:**

* `--encrypted` - Store as encrypted secret
* `--description <text>` - Add description

**`aloma secret delete <name>`**

Remove a secret

```bash
aloma secret delete "OLD_API_KEY"
aloma secret delete "TEMP_TOKEN" --force
```

**Options:**

* `--force` - Skip confirmation prompt

***

#### Library Management

**`aloma library list`**

List libraries in current workspace

```bash
aloma library list
aloma library list --verbose
```

**Options:**

* `--verbose` - Show library details

**`aloma library pull`**

Pull libraries to local files

```bash
aloma library pull
aloma library pull -p ./libraries
aloma library pull --path ./shared/libraries
```

**Options:**

* `-p, --path <path>` - Local directory for library files

**`aloma library sync`**

Sync local library files to workspace

```bash
aloma library sync -p ./libraries
aloma library sync --path ./shared/libraries
```

**Options:**

* `-p, --path <path>` - Local directory containing library files

***

#### Webhook Management

**`aloma webhook list`**

List webhooks in current workspace

```bash
aloma webhook list
aloma webhook list --show-urls
```

**Options:**

* `--show-urls` - Display webhook URLs

**`aloma webhook add <name>`**

Create a new webhook

```bash
aloma webhook add "Customer Events"
aloma webhook add "Order Processing" --description "Handle order webhooks"
```

**Options:**

* `--description <text>` - Webhook description

***

#### Deployment Commands

**`aloma deploy <file>`**

Deploy automation from configuration file

```bash
aloma deploy deploy.yaml
aloma deploy deploy-prod.yaml --dry-run
aloma deploy ./config/staging.yaml --force
```

**Options:**

* `--dry-run` - Preview deployment without executing
* `--force` - Override safety checks

***

#### Development Workflows

#### Quick Start: Deploy an Example

```bash
# Clone examples repository
git clone https://github.com/aloma-io/aloma-io.git
cd aloma-io/examples/hubspot

# Deploy the complete automation
aloma deploy deploy.yaml

# Verify deployment
aloma workspace show
aloma step list
aloma connector list
```

#### Local Development Workflow

```bash
# Create new project
mkdir my-automation && cd my-automation

# Set up workspace
aloma workspace add "My Automation Dev" --tags "development"
aloma workspace switch "My Automation Dev"

# Start development
aloma step pull -p ./steps
# Edit files in your IDE
aloma step sync -p ./steps

# Test automation
aloma task new "test run" -d '{"test": true}'
aloma task list --state running
```

#### IDE Integration

```bash
# Pull steps for IDE editing
aloma step pull -p ./steps

# Directory structure created:
# ./steps/
#   ├── process_customer.js
#   ├── validate_email.js
#   └── send_notification.js

# After editing, sync back
aloma step sync -p ./steps
```

#### Version Control Integration

```bash
# 1. Develop feature
git checkout -b feature/customer-validation
aloma step pull -p ./steps
# Edit steps in IDE

# 2. Commit and test
git add .
git commit -m "Add customer validation step"
aloma step sync -p ./steps
aloma task new "test validation" -d '{"customer":{"email":"test@example.com"}}'

# 3. Deploy to staging
aloma workspace switch "MyApp Staging"
aloma step sync -p ./steps

# 4. Production deployment
git checkout main
git merge feature/customer-validation
aloma workspace switch "MyApp Production"
aloma step sync -p ./steps
```

***

### Infrastructure as Code

#### Deploy File Structure

```yaml
# deploy.yaml
workspaces:
  - name: "Customer Processing Production"
    tags: ["production", "customer-processing"]
    
    steps:
      - syncPath: "steps/"
    
    libraries:
      - syncPath: "libraries/"

    connectors:
      - connectorName: "hubspot.com (private)"
        config:
          apiToken: "${HUBSPOT_API_TOKEN}"
      - connectorName: "slack.com"
    
    secrets:
      - name: "DATABASE_URL"
        value: "${PROD_DATABASE_URL}"
        encrypted: true
      - name: "SLACK_CHANNEL"
        value: "C1234567890"
        encrypted: false
    
    webhooks:
      - name: "Customer Events"
      - name: "Order Processing"
    
    tasks:
      - name: "test customer processing"
        data: {"test": true, "customer": {"email": "test@example.com"}}
```

#### Environment Management

```bash
# Set environment variables
export HUBSPOT_API_TOKEN="your-token"
export PROD_DATABASE_URL="postgresql://prod:5432/app"

# Deploy with environment substitution
aloma deploy deploy-prod.yaml

# Or manage secrets via CLI
aloma secret add "HUBSPOT_API_TOKEN" "your-token"
aloma secret add "DATABASE_URL" "postgresql://prod:5432/app"
```

***

### Testing and Debugging

#### Debug Commands

```bash
# Create test tasks
aloma task new "debug customer" -d '{"customer":{"email":"invalid-email","status":"new"}}'

# Monitor execution
aloma task list --state running
aloma task list --state error

# Debug specific tasks
aloma task log <task-id> --logs --changes
aloma task log <task-id> --step 1 --logs

# Test step modifications
aloma step edit <step-id>
aloma step clone <step-id> --name "debug_version"
```

#### Performance Monitoring

```bash
# Monitor task execution
aloma task list --state done | head -10
aloma task list --state error

# Analyze step performance
aloma step list
aloma step show <step-id>

# Check connector health
aloma connector list
aloma connector logs <connector-id>

# Workspace health overview
aloma workspace show
```

***

### Troubleshooting

#### Common Issues

**Authentication Problems:**

```bash
# Re-authenticate
aloma auth

# Verify workspace access
aloma workspace list
```

**Step Sync Issues:**

```bash
# Check current workspace
aloma workspace show

# Force sync with verbose output
aloma step sync -p ./steps --verbose
```

**Task Execution Problems:**

```bash
# Check task logs
aloma task log <task-id> --logs --changes

# Verify step conditions
aloma step show <step-id>

# Test with simplified data
aloma task new "simple test" -d '{"test": true}'
```

**Connector Issues:**

```bash
# Check connector status
aloma connector list --verbose

# View connector logs
aloma connector logs <instance-id>

# Re-configure OAuth if needed
aloma connector oauth <instance-id>
```

#### Getting Help

```bash
# Command-specific help
aloma <command> --help
aloma workspace --help
aloma step --help

# Global help
aloma --help
```

***

### Best Practices

#### Project Organization

```
my-automation/
├── deploy.yaml           # Deployment configuration
├── deploy-dev.yaml       # Development environment
├── deploy-staging.yaml   # Staging environment
├── deploy-prod.yaml      # Production environment
├── steps/               # Step definitions
│   ├── validate_email.js
│   ├── process_customer.js
│   └── send_notification.js
├── libraries/           # Reusable code
│   ├── validation.js
│   └── utilities.js
├── docs/               # Documentation
│   └── README.md
└── .gitignore          # Version control
```

#### Development Workflow

1. **Local Development**: Use `aloma step pull` and IDE editing
2. **Version Control**: Commit step files with your code
3. **Testing**: Use staging workspace for integration testing
4. **Deployment**: Use `aloma deploy` for consistent deployments
5. **Monitoring**: Regular health checks and log monitoring

#### Security

* Store sensitive data in secrets, not environment variables
* Use encrypted secrets for production credentials
* Regularly rotate API keys and tokens
* Monitor connector access logs

The ALOMA CLI enables professional automation development with the tools and practices experienced developers expect. By integrating with version control, supporting team collaboration, and providing infrastructure-as-code deployment, ALOMA scales from individual projects to enterprise automation platforms.
