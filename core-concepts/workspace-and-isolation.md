# Workspace and Isolation

## Workspaces & Isolation

**Workspaces are ALOMA's isolated environments where your automations run. Each workspace is completely independent, providing secure separation of data, code, integrations, and execution contexts.**

Workspaces enable teams to organize automations by environment (dev/staging/prod), project, client, or any logical boundary. This isolation ensures that development work doesn't affect production systems, different teams can work independently, and sensitive data remains properly segregated.

### Understanding Workspace Isolation

#### Complete Separation

Every workspace operates in complete isolation with its own:

* **Steps** - JavaScript automation logic
* **Tasks** - JSON data and execution history
* **Connectors** - External service integrations and credentials
* **Webhooks** - Inbound data endpoints
* **Environment variables** - Configuration and secrets
* **Libraries** - Reusable code modules
* **Execution environment** - Runtime context and resources

#### No Cross-Workspace Access

Workspaces cannot access each other's resources:

```javascript
// ❌ This won't work - cannot access data from other workspaces
export const condition = { 
  needsDataFromProd: true 
};

export const content = async () => {
  // Cannot access production workspace data from development workspace
  // Cannot call steps in other workspaces
  // Cannot use connectors from other workspaces
  console.log('Each workspace is completely isolated');
};
```

This isolation provides security, prevents accidental cross-environment contamination, and enables teams to work independently.

### Creating and Managing Workspaces

#### Creating a New Workspace

Create workspaces programmatically using the CLI:

```bash
# Create a new workspace
aloma workspace add "Customer Onboarding"

# Create with tags for organization
aloma workspace add "Production CRM" --tags "production,crm,critical"

# Create development workspace
aloma workspace add "Dev Environment" --tags "development,testing"
```

#### Listing and Switching Workspaces

```bash
# List all available workspaces
aloma workspace list

# Show current workspace
aloma workspace show

# Switch to a different workspace by name
aloma workspace switch "Production CRM"

# Switch by workspace ID
aloma workspace switch ws_abc123def456
```

#### Workspace Management

```bash
# Update workspace settings
aloma workspace update --name "New Production Name"
aloma workspace update --tags "production,crm,updated"

# Archive unused workspaces
aloma workspace archive "Old Development"

# Unarchive when needed
aloma workspace archive "Old Development" --unarchive

# Delete workspace (careful - this is permanent)
aloma workspace delete "Unused Workspace"
```

### Environment-Based Organization

#### Development → Staging → Production Pipeline

Create separate workspaces for each environment:

```bash
# Create environment-specific workspaces
aloma workspace add "MyApp Development" --tags "dev,myapp"
aloma workspace add "MyApp Staging" --tags "staging,myapp"  
aloma workspace add "MyApp Production" --tags "production,myapp"
```

Each environment can have identical automation logic but different:

* **Connector credentials** (dev vs prod API keys)
* **Environment variables** (different database URLs, service endpoints)
* **Data volumes** (test data vs production data)
* **Notification settings** (dev alerts go to developers, prod alerts to operations)

#### Example: Customer Onboarding Across Environments

**Development Workspace:**

```javascript
export const condition = {
  customer: {
    email: String,
    environment: "development"
  }
};

export const content = async () => {
  // Development environment - use test credentials
  const testApiKey = task.config('DEV_CRM_API_KEY');
  const testDatabase = task.config('DEV_DATABASE_URL');
  
  console.log('Processing in development environment');
  
  // Connect to development CRM
  const contact = await connectors.devCrm.createContact({
    email: data.customer.email,
    source: 'development_testing'
  });
  
  data.customer.devCrmId = contact.id;
  data.customer.processedAt = new Date().toISOString();
};
```

**Production Workspace:**

```javascript
export const condition = {
  customer: {
    email: String,
    environment: "production"
  }
};

export const content = async () => {
  // Production environment - use live credentials
  const prodApiKey = task.config('PROD_CRM_API_KEY');
  const prodDatabase = task.config('PROD_DATABASE_URL');
  
  console.log('Processing in production environment');
  
  // Connect to production CRM
  const contact = await connectors.prodCrm.createContact({
    email: data.customer.email,
    source: 'website_signup'
  });
  
  data.customer.crmId = contact.id;
  data.customer.processedAt = new Date().toISOString();
  
  // Production-only: Send to analytics
  await connectors.analytics.track({
    event: 'customer_created',
    properties: { crmId: contact.id }
  });
};
```

### Project and Team Isolation

#### Multi-Project Organization

Separate different projects or clients:

```bash
# Client-specific workspaces
aloma workspace add "ACME Corp Integration" --tags "client,acme,integration"
aloma workspace add "TechStart Automation" --tags "client,techstart,automation"

# Project-specific workspaces  
aloma workspace add "Invoice Processing" --tags "project,finance,invoices"
aloma workspace add "Lead Generation" --tags "project,marketing,leads"
```

#### Team-Based Access Control

Each workspace can have different team members with different permissions:

```bash
# Developers typically have access to development workspaces
# Operations team has access to production workspaces
# Client managers have access to client-specific workspaces
```

**Example: E-commerce Order Processing per Client**

**ACME Corp Workspace:**

```javascript
export const condition = {
  order: {
    client: "acme",
    status: "new"
  }
};

export const content = async () => {
  // ACME-specific processing
  const acmeConfig = {
    taxRate: 0.08,
    shippingCarrier: 'FedEx',
    fulfillmentCenter: 'acme-warehouse-east'
  };
  
  console.log('Processing ACME order');
  
  // Use ACME-specific connectors and credentials
  await connectors.acmeInventory.checkStock({
    items: data.order.items,
    warehouse: acmeConfig.fulfillmentCenter
  });
  
  data.order.client = "acme";
  data.order.taxRate = acmeConfig.taxRate;
  data.order.fulfillmentCenter = acmeConfig.fulfillmentCenter;
};
```

**TechStart Workspace:**

```javascript
export const condition = {
  order: {
    client: "techstart",
    status: "new"
  }
};

export const content = async () => {
  // TechStart-specific processing
  const techstartConfig = {
    taxRate: 0.10,
    shippingCarrier: 'UPS',
    fulfillmentCenter: 'techstart-fulfillment'
  };
  
  console.log('Processing TechStart order');
  
  // Use TechStart-specific connectors and credentials
  await connectors.techstartERP.processOrder({
    orderData: data.order,
    fulfillmentCenter: techstartConfig.fulfillmentCenter
  });
  
  data.order.client = "techstart";
  data.order.taxRate = techstartConfig.taxRate;
  data.order.fulfillmentCenter = techstartConfig.fulfillmentCenter;
};
```

### Environment Variables and Configuration

#### Workspace-Specific Configuration

Each workspace maintains its own environment variables and secrets:

```bash
# Set environment variables for current workspace
aloma workspace update --env-var "API_ENDPOINT=https://api.dev.company.com"
aloma workspace update --env-var "DATABASE_URL=postgresql://dev-db:5432/app"
aloma workspace update --env-var "LOG_LEVEL=debug"
```

Access configuration in your steps:

```javascript
export const condition = {
  integration: {
    type: "api_call",
    service: "external_service"
  }
};

export const content = async () => {
  // Get workspace-specific configuration
  const apiEndpoint = task.config('API_ENDPOINT');
  const databaseUrl = task.config('DATABASE_URL');
  const logLevel = task.config('LOG_LEVEL');
  
  console.log(`Using endpoint: ${apiEndpoint}`);
  console.log(`Log level: ${logLevel}`);
  
  // Make API call using workspace-specific endpoint
  const response = await connectors.httpClient.request({
    url: `${apiEndpoint}/customers`,
    method: 'POST',
    body: JSON.stringify(data.integration.payload)
  });
  
  data.integration.response = response;
  data.integration.completedAt = new Date().toISOString();
};
```

#### Secrets Management

Store sensitive data securely per workspace using CLI commands:

```bash
# Add secrets to the current workspace
aloma secret add "STRIPE_SECRET_KEY" "sk_live_abc123..."
aloma secret add "ENCRYPTION_KEY" "aes256_key_here" 
aloma secret add "WEBHOOK_SECRET" "webhook_secret_here"

# List all secrets in workspace
aloma secret list

# Delete secrets when no longer needed
aloma secret delete "OLD_API_KEY"
```

Access secrets in your automation steps:

```javascript
export const condition = {
  payment: {
    type: "credit_card",
    amount: Number
  }
};

export const content = async () => {
  // Access sensitive configuration via task.config()
  const stripeSecretKey = task.config('STRIPE_SECRET_KEY');
  const encryptionKey = task.config('ENCRYPTION_KEY');
  const webhookSecret = task.config('WEBHOOK_SECRET');
  
  // Process payment using workspace-specific credentials
  const charge = await connectors.stripe.createCharge({
    amount: data.payment.amount * 100, // Convert to cents
    currency: 'usd',
    source: data.payment.token
  });
  
  data.payment.chargeId = charge.id;
  data.payment.status = charge.status;
  data.payment.processedAt = new Date().toISOString();
};
```

### Git Integration and Source Control

#### Workspace-Code Synchronization

Connect workspaces to Git repositories for version control:

```bash
# Configure Git sync for workspace
aloma workspace source --file source-config.json

# Manually trigger sync from Git
aloma workspace sync

# View current source configuration
aloma workspace show --source-config
```

**Example source configuration:**

```json
{
  "repository": "https://github.com/company/automation-workflows.git",
  "branch": "main",
  "username": "automation-bot",
  "token": "github_token_here",
  "autoSync": true,
  "syncInterval": "5m"
}
```

#### Multi-Environment Git Workflow

Use branches for different environments:

```bash
# Development workspace syncs from 'develop' branch
aloma workspace switch "Development"
aloma workspace source --branch "develop" --auto-sync true

# Staging workspace syncs from 'staging' branch  
aloma workspace switch "Staging"
aloma workspace source --branch "staging" --auto-sync true

# Production workspace syncs from 'main' branch
aloma workspace switch "Production"  
aloma workspace source --branch "main" --auto-sync false  # Manual sync for production
```

#### Development Workflow

```bash
# 1. Develop in local workspace
aloma workspace switch "Development"

# 2. Pull changes from development workspace to Git
npx @aloma.io/workspace-sdk@latest pull workspace_id_123

# 3. Commit and push to Git
git add .
git commit -m "Add customer validation step"
git push origin develop

# 4. Merge to staging branch
git checkout staging
git merge develop  
git push origin staging

# 5. Production deployment via manual sync
aloma workspace switch "Production"
aloma workspace sync  # Pulls from main branch
```

### Connector and Integration Isolation

#### Workspace-Specific Connectors

Each workspace has its own connector instances and credentials:

```javascript
// Development workspace
export const condition = {
  email: {
    type: "welcome",
    environment: "dev"
  }
};

export const content = async () => {
  // Uses development SMTP settings
  await connectors.devEmailSmtp.sendEmail({
    to: data.email.recipient,
    subject: '[DEV] Welcome to Our Platform',
    html: `<p>Development environment welcome email</p>`
  });
  
  data.email.sentAt = new Date().toISOString();
  data.email.environment = "development";
};
```

```javascript
// Production workspace  
export const condition = {
  email: {
    type: "welcome",
    environment: "prod"
  }
};

export const content = async () => {
  // Uses production SMTP settings with real credentials
  await connectors.prodEmailSmtp.sendEmail({
    to: data.email.recipient,
    subject: 'Welcome to Our Platform',
    html: `<p>Thank you for joining our platform!</p>`
  });
  
  data.email.sentAt = new Date().toISOString();
  data.email.environment = "production";
};
```

#### Managing Connectors via CLI

Each workspace has its own connector instances and credentials managed through CLI:

```bash
# List available connector types
aloma connector list-available

# Add connectors to current workspace
aloma connector add w3a1oc32mky6rlpbqwzq1f6opc37z1hs -n "devEmailSmtp"
aloma connector add a2b1oc42nky7rlpbqwzq2f7opc47z2it -n "prodEmailSmtp"

# List connectors in current workspace
aloma connector list

# Configure connector with OAuth
aloma connector oauth <connector-id>

# View connector details and logs
aloma connector show <connector-id>
aloma connector logs <connector-id>

# Update connector configuration
aloma connector update <connector-id> -n "newName"

# Remove connectors from workspace
aloma connector delete <connector-id>
```

Use different connector instances per environment:

```javascript
// Development workspace
export const condition = {
  email: {
    type: "welcome",
    environment: "dev"
  }
};

export const content = async () => {
  // Uses development SMTP settings
  await connectors.devEmailSmtp.sendEmail({
    to: data.email.recipient,
    subject: '[DEV] Welcome to Our Platform',
    html: `<p>Development environment welcome email</p>`
  });
  
  data.email.sentAt = new Date().toISOString();
  data.email.environment = "development";
};
```

### Deployment Strategies

#### Infrastructure as Code

Deploy entire workspaces using YAML configuration:

```yaml
# deploy.yaml
workspaces:
  - name: "E-commerce Production"
    tags: ["production", "ecommerce"]
    
    steps:
      - syncPath: "steps/"
    
    connectors:
      - connectorName: "stripe.com"
        config:
          apiKey: "${STRIPE_PROD_KEY}"
      - connectorName: "hubspot.com (private)"
        config:
          apiToken: "${HUBSPOT_PROD_TOKEN}"
      - connectorName: "E-Mail (SMTP - OAuth)"
    
    secrets:
      - name: "DATABASE_URL"
        value: "${PROD_DATABASE_URL}"
        encrypted: true
      - name: "ENCRYPTION_KEY"
        value: "${PROD_ENCRYPTION_KEY}"
        encrypted: true
    
    webhooks:
      - name: "Order Processing"
      - name: "Customer Updates"
```

Deploy with:

```bash
aloma deploy deploy.yaml
```

#### Environment-Specific Deployments

Use different deployment files for each environment:

```bash
# Deploy to development
aloma deploy deploy-dev.yaml

# Deploy to staging
aloma deploy deploy-staging.yaml

# Deploy to production
aloma deploy deploy-prod.yaml
```

### Monitoring and Health Checks

#### Workspace Health Monitoring

Track workspace health and resource utilization:

```bash
# View workspace overview and metrics
aloma workspace show

# Update health check settings
aloma workspace update --health-enabled true

# Configure notifications for workspace issues
aloma workspace update --notification-groups "devops@company.com,alerts@company.com"
```

#### Automated Health Checks

ALOMA automatically monitors:

* **Unused steps** - Steps that never execute
* **Unused connectors** - Connectors without associated steps
* **Unused webhooks** - Webhooks receiving no traffic
* **Failed tasks** - Tasks with recurring errors
* **Resource utilization** - Memory and CPU usage patterns

#### Error Notifications

Configure workspace-specific error notifications:

```javascript
export const condition = {
  error: {
    type: "critical",
    source: String
  }
};

export const content = async () => {
  // Get workspace notification settings
  const alertChannel = task.config('ALERT_SLACK_CHANNEL');
  const onCallEmail = task.config('ONCALL_EMAIL');
  
  // Send workspace-specific alerts
  await connectors.slackCom.send({
    channel: alertChannel,
    text: `🚨 Critical error in ${data.error.source}: ${data.error.message}`,
    attachments: [{
      color: 'danger',
      fields: [{
        title: 'Workspace',
        value: task.workspace.name,
        short: true
      }, {
        title: 'Environment', 
        value: task.config('ENVIRONMENT'),
        short: true
      }]
    }]
  });
  
  data.error.notifiedAt = new Date().toISOString();
  data.error.workspace = task.workspace.name;
};
```

### Best Practices

#### Workspace Naming Conventions

Use clear, descriptive names:

```bash
# ✅ Good naming patterns
aloma workspace add "CustomerCRM Production"
aloma workspace add "InvoiceProcessing Development" 
aloma workspace add "ACME Corp Integration"
aloma workspace add "Marketing Automation Staging"

# ❌ Avoid vague names
aloma workspace add "Test"
aloma workspace add "MyWorkspace"
aloma workspace add "Backup"
```

#### Environment Segregation

Always separate environments:

```bash
# ✅ Environment-specific workspaces
aloma workspace add "OrderProcessing Dev" --tags "development,orders"
aloma workspace add "OrderProcessing Staging" --tags "staging,orders"
aloma workspace add "OrderProcessing Prod" --tags "production,orders"

# ❌ Don't mix environments
aloma workspace add "OrderProcessing All Environments"  # Dangerous mixing
```

#### Resource Organization

Group related automations:

```javascript
// ✅ Related steps in same workspace
export const condition = { order: { status: "new" } };
export const condition = { order: { status: "paid" } };
export const condition = { order: { status: "shipped" } };

// ❌ Don't put unrelated automations together
// Order processing + HR onboarding + Marketing campaigns in one workspace
```

#### Configuration Management

Use environment variables consistently:

```javascript
export const content = async () => {
  // ✅ Good: Use environment-specific configuration
  const apiEndpoint = task.config('API_ENDPOINT');  // Different per workspace
  const environment = task.config('ENVIRONMENT');   // 'dev', 'staging', 'prod'
  
  // ❌ Avoid: Hardcoded environment-specific values
  const hardcodedUrl = 'https://api.prod.company.com';  // Won't work in dev
};
```

#### Access Control

Limit workspace access appropriately:

* **Developers**: Access to development and staging workspaces
* **Operations**: Access to staging and production workspaces
* **Management**: Read-only access to production metrics
* **Clients**: Access only to their dedicated workspaces

Workspaces provide the foundation for secure, scalable automation architecture. By properly isolating environments, projects, and teams, you can build robust automation systems that grow with your organization while maintaining security and operational excellence.
