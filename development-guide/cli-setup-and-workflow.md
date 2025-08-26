# CLI Setup and Workflow

## CLI Setup & Workflow

**The ALOMA CLI is the developer's primary interface for building, deploying, and managing automations. It provides full workspace control, version control integration, and enables professional development workflows with your preferred IDE.**

Unlike visual drag-and-drop tools, the CLI enables code-first automation development with proper version control, team collaboration, and deployment pipelines. This approach scales from individual developers to enterprise teams while maintaining the flexibility and power that experienced developers expect.

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

Install the CLI globally to access it from anywhere:

```bash
# Install ALOMA CLI globally
npm install -g @aloma.io/aloma

# Verify installation
aloma --version
aloma --help
```

#### Initial Configuration

Set up your development environment:

```bash
# Configure CLI environment
aloma setup

# Authenticate with your ALOMA account
aloma auth
```

The `aloma auth` command opens your browser to authenticate with your ALOMA account. Once authenticated, your session token is stored locally for future CLI operations.

#### Verify Setup

Confirm everything is working:

```bash
# List available workspaces
aloma workspace list

# Show current workspace
aloma workspace show

# Test CLI connectivity
aloma workspace list --help
```

### Development Workflows

#### Quick Start: Deploy an Example

Get started immediately by deploying a pre-built automation:

```bash
# Clone examples repository
git clone https://github.com/aloma-io/aloma-io.git
cd aloma-io/examples/hubspot

# Review the deployment configuration
cat deploy.yaml

# Update API credentials in deploy.yaml
# Replace "********" with your actual HubSpot API token

# Deploy the complete automation
aloma deploy deploy.yaml

# Verify deployment
aloma workspace show
aloma step list
aloma connector list
```

#### Local Development Workflow

Develop automations locally with your preferred IDE:

```bash
# Create a new project directory
mkdir my-automation && cd my-automation

# Create workspace for your project
aloma workspace add "My Automation Dev" --tags "development,myproject"

# Switch to your new workspace
aloma workspace switch "My Automation Dev"

# Pull any existing steps (for existing workspaces)
aloma step pull

# Create your first step
aloma step add "process_customer"

# View created step
aloma step list
aloma step show <step-id>
```

#### IDE Integration

Work with your favorite development tools:

```bash
# Pull steps to local files for IDE editing
aloma step pull -p ./steps

# Directory structure created:
# ./steps/
#   ├── process_customer.js
#   ├── validate_email.js
#   └── send_notification.js
```

Edit steps in your IDE with full syntax highlighting, debugging, and version control:

```javascript
// ./steps/process_customer.js
export const condition = {
  customer: {
    email: String,
    status: "new"
  }
};

export const content = async () => {
  console.log('Processing new customer:', data.customer.email);
  
  // Validate email format
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email);
  
  if (emailValid) {
    data.customer.validated = true;
    data.customer.validatedAt = new Date().toISOString();
  } else {
    data.customer.validationError = "Invalid email format";
    data.customer.validated = false;
  }
  
  data.customer.processedBy = "automation";
};
```

Sync changes back to ALOMA:

```bash
# Sync local changes to workspace
aloma step sync

# Sync specific step
aloma step sync -s step-123 -p ./steps

# Verify changes
aloma step list
```

### Version Control Integration

#### Git-Based Development

Integrate ALOMA with your Git workflow:

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial automation setup"

# Create .gitignore for ALOMA projects
cat > .gitignore << EOF
# ALOMA CLI files
.aloma/
*.log

# Node.js
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
EOF

# Set up development branches
git checkout -b develop
git checkout -b feature/customer-validation
```

#### Multi-Environment Strategy

Manage development, staging, and production environments:

```bash
# Create environment-specific workspaces
aloma workspace add "MyApp Development" --tags "dev,myapp"
aloma workspace add "MyApp Staging" --tags "staging,myapp"
aloma workspace add "MyApp Production" --tags "production,myapp"

# Configure each environment
aloma workspace switch "MyApp Development"
aloma secret add "API_ENDPOINT" "https://api-dev.mycompany.com"
aloma secret add "DATABASE_URL" "postgresql://dev-db:5432/myapp"

aloma workspace switch "MyApp Staging"
aloma secret add "API_ENDPOINT" "https://api-staging.mycompany.com"
aloma secret add "DATABASE_URL" "postgresql://staging-db:5432/myapp"

aloma workspace switch "MyApp Production"
aloma secret add "API_ENDPOINT" "https://api.mycompany.com"
aloma secret add "DATABASE_URL" "postgresql://prod-db:5432/myapp"
```

#### Development to Production Pipeline

Establish a deployment pipeline:

```bash
# 1. Develop in feature branch
git checkout feature/customer-validation
aloma workspace switch "MyApp Development"

# Create and test steps locally
aloma step pull -p ./steps
# ... edit files in IDE ...
aloma step sync

# Test with development data
aloma task new "test customer" -d '{"customer":{"email":"test@example.com","status":"new"}}'
aloma task list --state done

# 2. Commit and merge to develop
git add .
git commit -m "Add customer validation step"
git checkout develop
git merge feature/customer-validation

# 3. Deploy to staging
aloma workspace switch "MyApp Staging"
aloma step sync -p ./steps

# Test in staging environment
aloma task new "staging test" -d '{"customer":{"email":"staging@example.com","status":"new"}}'

# 4. Production deployment
git checkout main
git merge develop
aloma workspace switch "MyApp Production"
aloma step sync -p ./steps
```

### Infrastructure as Code

#### Deployment Configuration

Define entire automations in YAML:

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
      - connectorName: "E-Mail (SMTP - OAuth)"
      - connectorName: "slack.com"
    
    secrets:
      - name: "DATABASE_URL"
        value: "${PROD_DATABASE_URL}"
        encrypted: true
      - name: "ENCRYPTION_KEY"
        value: "${PROD_ENCRYPTION_KEY}"
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

Deploy complete environments:

```bash
# Deploy development environment
aloma deploy deploy-dev.yaml

# Deploy staging environment  
aloma deploy deploy-staging.yaml

# Deploy production environment
aloma deploy deploy-prod.yaml

# Verify deployment
aloma workspace list
aloma step list
aloma connector list
aloma webhook list
aloma library list
```

#### Environment Variables and Secrets

Securely manage configuration across environments:

```bash
# Set environment variables before deployment
export HUBSPOT_API_TOKEN="your-hubspot-token"
export PROD_DATABASE_URL="postgresql://prod:5432/app"
export PROD_ENCRYPTION_KEY="aes256-encryption-key"

# Deploy with environment substitution
aloma deploy deploy-prod.yaml

# Or manage secrets directly via CLI
aloma workspace switch "Production"
aloma secret add "HUBSPOT_API_TOKEN" "your-hubspot-token"
aloma secret add "DATABASE_URL" "postgresql://prod:5432/app"
aloma secret list
```

### Development Best Practices

#### Project Structure

Organize your automation projects:

```
my-automation/
├── deploy.yaml           # Deployment configuration
├── deploy-dev.yaml       # Development environment config
├── deploy-prod.yaml      # Production environment config
├── steps/                # Step implementation files
│   ├── validate_customer.js
│   ├── process_order.js
│   └── send_notifications.js
├── tasks/                # Test task data
│   ├── test_customer.json
│   └── test_order.json
├── libraries/                # Library implementation files
│   ├── validation.js
│   ├── utilities.js
├── docs/                 # Documentation
│   └── README.md
├── .gitignore
├── .aloma.yaml          # ALOMA project configuration
└── package.json         # Node.js dependencies (optional)
```

#### Step Development Patterns

Follow consistent patterns for maintainable steps:

```javascript
// steps/validate_customer.js
export const condition = {
  customer: {
    email: String,
    validated: null  // Only run if not already validated
  }
};

export const content = async () => {
  const startTime = Date.now();
  
  try {
    // Log step execution
    console.log(`Validating customer: ${data.customer.email}`);
    
    // Main business logic
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email);
    
    if (emailValid) {
      data.customer.validated = true;
      data.customer.validatedAt = new Date().toISOString();
      data.customer.validationMethod = "regex";
    } else {
      data.customer.validated = false;
      data.customer.validationError = "Invalid email format";
      data.customer.validationErrors = data.customer.validationErrors || [];
      data.customer.validationErrors.push({
        field: "email",
        error: "Invalid format",
        timestamp: new Date().toISOString()
      });
    }
    
    // Add execution metadata
    data.customer.lastProcessedAt = new Date().toISOString();
    data.customer.lastProcessedBy = "validate_customer_step";
    
    console.log(`Validation complete: ${data.customer.validated ? 'valid' : 'invalid'}`);
    
  } catch (error) {
    // Error handling
    console.error('Customer validation failed:', error.message);
    
    data.customer.validated = false;
    data.customer.validationError = error.message;
    data.customer.lastError = {
      message: error.message,
      timestamp: new Date().toISOString(),
      step: "validate_customer"
    };
  } finally {
    // Performance tracking
    const duration = Date.now() - startTime;
    console.log(`Step execution time: ${duration}ms`);
    data.customer.executionTime = duration;
  }
};
```

#### Testing and Debugging

Develop a systematic testing approach:

```bash
# Create test data files
mkdir tasks
cat > tasks/test_customer.json << EOF
{
  "customer": {
    "email": "john.doe@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "new"
  },
  "source": "cli_test"
}
EOF

# Test specific scenarios
aloma task new "valid customer test" -f tasks/test_customer.json
aloma task new "invalid customer test" -d '{"customer":{"email":"invalid-email","status":"new"}}'

# Monitor execution
aloma task list --state running
aloma task list --state error

# Debug specific tasks
aloma task log <task-id> --logs --changes
aloma task log <task-id> --step 1 --logs

# Test step modifications
aloma step edit <step-id>  # Opens editor for quick changes
aloma step clone <step-id> # Create copy for testing
```

#### Performance Monitoring

Track automation performance:

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

#### Library Management

Create reusable code libraries:

```bash
# Pull existing libraries from workspace
aloma library pull -p ./libraries

# Directory structure for libraries:
# ./libraries/
#   ├── validation.js
#   └── utilities.js
```

Use libraries in your steps:

```javascript
// steps/process_customer.js
export const condition = {
  customer: { email: String }
};

export const content = async () => {
  // Use library functions
  const isValid = lib.validation.validateEmail(data.customer.email);
  const formattedDate = lib.utilities.formatDate(new Date());
  
  if (isValid) {
    data.customer.validated = true;
    data.customer.validatedAt = formattedDate;
  }
};
```

#### Monitoring and Alerting

Set up monitoring for production automations:

```bash
# Configure workspace notifications
aloma workspace update --notification-groups "devops@company.com,alerts@company.com"

# Monitor failed tasks
aloma task list --state error --limit 50

# Set up health checks
aloma workspace update --health-enabled true

# Create monitoring tasks
aloma task new "health check" -d '{"healthCheck":true,"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

The CLI workflow enables professional automation development with the tools and practices experienced developers expect. By integrating with version control, supporting team collaboration, and providing infrastructure-as-code deployment, ALOMA scales from individual projects to enterprise automation platforms.
