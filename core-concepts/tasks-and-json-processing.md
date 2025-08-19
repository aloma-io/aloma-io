# Tasks & JSON Processing

## Tasks & JSON Processing

**Tasks are the data that flows through your ALOMA automations. They're schemaless JSON objects that carry information, trigger steps, and evolve as your automation processes them.**

Unlike traditional workflow systems that require predefined schemas, ALOMA tasks can be any valid JSON structure. This flexibility lets you handle diverse data sources and adapt to changing requirements without rebuilding your automation infrastructure.

### What Are Tasks?

Tasks are JSON data payloads that enter your workspace and get processed by your steps. They can arrive through webhooks, connectors, manual entry, or be created by other tasks. As steps execute, they modify task data, creating a living document that tracks the automation's progress.

#### Basic Task Structure

Any valid JSON is a valid task:

```json
{
  "customer": {
    "email": "sarah@company.com",
    "name": "Sarah Chen",
    "company": "TechCorp"
  },
  "request": "demo",
  "source": "website"
}
```

```json
{
  "invoice": {
    "id": "INV-2025-001",
    "amount": 2500.00,
    "items": [
      {"product": "SaaS License", "quantity": 1, "price": 2500.00}
    ]
  },
  "vendor": "ACME Software",
  "dueDate": "2025-02-15"
}
```

```json
{
  "build": {
    "repository": "api-server",
    "branch": "main",
    "commit": "abc123",
    "status": "passed"
  },
  "deploy": true
}
```

### How Tasks Flow Through ALOMA

#### The Task Lifecycle

1. **Task Creation** - Data enters your workspace
2. **Step Matching** - ALOMA finds steps whose conditions match the task data
3. **Step Execution** - Matching steps run and potentially modify the task
4. **State Evolution** - Modified task data may trigger new steps
5. **Process Continuation** - Cycle repeats until no more steps match or task completes

#### Task State Evolution Example

Let's trace how a customer onboarding task evolves:

**Initial Task:**

```json
{
  "customer": {
    "email": "john@startup.com",
    "firstName": "John",
    "lastName": "Smith",
    "company": "StartupCo"
  },
  "source": "signup_form"
}
```

**After Email Validation Step:**

```json
{
  "customer": {
    "email": "john@startup.com",
    "firstName": "John", 
    "lastName": "Smith",
    "company": "StartupCo",
    "emailValid": true,
    "validatedAt": "2025-08-17T10:30:00Z"
  },
  "source": "signup_form"
}
```

**After CRM Integration Step:**

```json
{
  "customer": {
    "email": "john@startup.com",
    "firstName": "John",
    "lastName": "Smith", 
    "company": "StartupCo",
    "emailValid": true,
    "validatedAt": "2025-08-17T10:30:00Z",
    "crmId": "CONTACT_12345",
    "crmCreated": true
  },
  "source": "signup_form"
}
```

**After Welcome Email Step:**

```json
{
  "customer": {
    "email": "john@startup.com",
    "firstName": "John",
    "lastName": "Smith",
    "company": "StartupCo", 
    "emailValid": true,
    "validatedAt": "2025-08-17T10:30:00Z",
    "crmId": "CONTACT_12345",
    "crmCreated": true,
    "welcomeEmailSent": true,
    "onboarded": true
  },
  "source": "signup_form",
  "completedAt": "2025-08-17T10:32:15Z"
}
```

Each step adds data that other steps can use for their conditions or processing logic.

### Working with Task Data in Steps

#### Accessing Task Data

Within step code, use the global `data` object to access and modify task information:

```javascript
export const condition = {
  customer: {
    email: String,
    firstName: String
  }
};

export const content = async () => {
  // Access existing data
  console.log('Processing customer:', data.customer.firstName);
  
  // Add new data
  data.customer.processedAt = new Date().toISOString();
  data.customer.status = "processing";
  
  // Modify existing data
  data.customer.email = data.customer.email.toLowerCase();
};
```

#### Adding and Modifying Data

You can freely add new properties or modify existing ones:

```javascript
export const condition = {
  order: {
    items: Array,
    customer: Object
  }
};

export const content = async () => {
  // Calculate order total
  const total = data.order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Add calculated fields
  data.order.total = total;
  data.order.tax = total * 0.08;
  data.order.grandTotal = total + data.order.tax;
  
  // Add processing metadata
  data.order.calculatedAt = new Date().toISOString();
  data.order.currency = "USD";
  
  // Create new nested objects
  data.processing = {
    stage: "calculation_complete",
    nextStep: "payment_processing"
  };
};
```

#### Removing Data

Clean up processed or unnecessary data using `delete`:

```javascript
export const condition = {
  user: {
    temporaryToken: String,
    verified: true
  }
};

export const content = async () => {
  // Remove temporary data after verification
  delete data.user.temporaryToken;
  delete data.user.verificationCode;
  
  // Remove entire objects that are no longer needed
  delete data.tempProcessingData;
  
  console.log('Cleaned up temporary verification data');
};
```

### Task Metadata and Built-ins

#### Task Naming

Give your tasks descriptive names to track progress and aid debugging:

```javascript
// Set a descriptive task name
task.name(`Customer onboarding: ${data.customer.firstName} ${data.customer.lastName}`);

// Update name as processing progresses
task.name(`${task.name()} - Email validated`);

// Dynamic naming based on data
task.name(`Order ${data.order.id} - ${data.order.status}`);
```

#### Task Tags

Classify tasks with tags for monitoring and analytics:

```javascript
// Add classification tags
task.tags(['customer', 'onboarding', 'high-priority']);

// Add tags based on data conditions
if (data.customer.type === 'enterprise') {
  task.tags([...task.tags(), 'enterprise', 'white-glove']);
}

// Conditional tagging
const currentTags = task.tags();
if (data.order.total > 1000) {
  task.tags([...currentTags, 'high-value', 'priority']);
}
```

#### Task Completion

Explicitly mark tasks as complete to stop further processing:

```javascript
// Complete the task
task.complete();

// Conditional completion
if (data.customer.onboarded && data.customer.emailSent) {
  console.log('Customer onboarding complete');
  task.complete();
}
```

### Secure Data with Stash

For sensitive data that should not be visible in logs or the UI:

```javascript
// Store sensitive data in stash
data.$stash.apiKey = "sk_live_abc123...";
data.$stash.userPassword = hashedPassword;
data.$stash.creditCardToken = "tok_xyz789...";

// Stash data can be matched by type but not accessed in editor
// Other steps can match on stashed data types:
// { "$stash": { "apiKey": String } }
```

### Common JSON Processing Patterns

#### Array Processing

Handle collections of items efficiently:

```javascript
export const condition = {
  orders: Array
};

export const content = async () => {
  // Process each order
  data.orders.forEach((order, index) => {
    order.processedAt = new Date().toISOString();
    order.index = index;
    
    // Add calculated fields
    order.total = order.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  });
  
  // Add summary data
  data.orderSummary = {
    count: data.orders.length,
    totalValue: data.orders.reduce((sum, order) => sum + order.total, 0),
    processedAt: new Date().toISOString()
  };
};
```

#### Conditional Data Transformation

Transform data based on business rules:

```javascript
export const condition = {
  customer: {
    type: String,
    plan: String
  }
};

export const content = async () => {
  // Set permissions based on customer type and plan
  switch (data.customer.type) {
    case 'enterprise':
      data.customer.permissions = ['read', 'write', 'admin', 'billing'];
      data.customer.supportLevel = 'premium';
      data.customer.priority = 'high';
      break;
      
    case 'business':
      data.customer.permissions = ['read', 'write'];
      data.customer.supportLevel = 'standard';
      data.customer.priority = 'normal';
      break;
      
    case 'individual':
      data.customer.permissions = ['read'];
      data.customer.supportLevel = 'community';
      data.customer.priority = 'low';
      break;
  }
  
  // Upgrade permissions based on plan
  if (data.customer.plan === 'pro') {
    data.customer.permissions.push('advanced_features');
    data.customer.supportLevel = 'priority';
  }
};
```

#### Data Validation and Cleanup

Ensure data quality and consistency:

```javascript
export const condition = {
  contact: {
    email: String,
    phone: String
  }
};

export const content = async () => {
  // Validate and clean email
  const email = data.contact.email.toLowerCase().trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  if (emailValid) {
    data.contact.email = email;
    data.contact.emailValid = true;
  } else {
    data.contact.emailValid = false;
    data.contact.validationErrors = data.contact.validationErrors || [];
    data.contact.validationErrors.push('Invalid email format');
  }
  
  // Clean and validate phone number
  const phone = data.contact.phone.replace(/\D/g, ''); // Remove non-digits
  if (phone.length >= 10) {
    data.contact.phone = phone;
    data.contact.phoneValid = true;
  } else {
    data.contact.phoneValid = false;
    data.contact.validationErrors = data.contact.validationErrors || [];
    data.contact.validationErrors.push('Invalid phone number');
  }
  
  // Add validation timestamp
  data.contact.validatedAt = new Date().toISOString();
};
```

#### Debugging and Monitoring Tasks

Monitor task execution and debug issues using CLI commands:

bash

```bash
# List all tasks with status filtering
aloma task list --state error
aloma task list --state done
aloma task list --name "customer processing"

# View detailed task execution logs
aloma task log <task-id> --logs --changes

# View specific step execution
aloma task log <task-id> --step 2 --logs --changes

# Monitor tasks in real-time
aloma task list --state running
```

Debug task data and step execution:

javascript

```javascript
export const condition = {
  customer: { email: String }
};

export const content = async () => {
  // Log current task state for debugging
  console.log('=== TASK DEBUG ===');
  console.log('Task ID:', task.id);
  console.log('Current data:', JSON.stringify(data, null, 2));
  console.log('Task created at:', task.createdAt);
  console.log('==================');
  
  // Your step logic here
  data.debugged = true;
};
```

### Task Sources and Creation

#### Webhook Tasks

Tasks often arrive via webhooks from external systems:

```json
{
  "event": "user.created",
  "user": {
    "id": "user_123",
    "email": "new@customer.com",
    "created_at": "2025-08-17T10:30:00Z"
  },
  "$via": {
    "id": "webhook_abc",
    "name": "User Events",
    "type": "webhook",
    "received": 1692267000000
  }
}
```

The `$via` field is automatically added by ALOMA to track the task's origin.

#### Connector Tasks

Tasks can be created by connector polling or event listening:

```json
{
  "email": {
    "id": "email_456",
    "subject": "Support Request",
    "from": "customer@company.com",
    "body": "I need help with...",
    "received": "2025-08-17T10:30:00Z"
  },
  "type": "support_request",
  "$via": {
    "id": "connector_gmail",
    "name": "Gmail Connector", 
    "type": "connector"
  }
}
```

#### Manual Tasks

Create tasks manually using the CLI for testing or one-off processing:

```bash
# Create task with inline JSON data
aloma task new "test customer processing" -d '{"test": true, "customer": {"email": "test@example.com", "firstName": "Test", "lastName": "User"}, "environment": "development"}'

# Create task from JSON file
aloma task new "test customer processing" -f ./test-data/customer-task.json
```

The task data structure:

```json
{
  "test": true,
  "customer": {
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  },
  "environment": "development"
}  
```

Subtasks

Create child tasks for parallel processing:

\{% tabs %\} \{% tab title="CLI" %\}

```javascript
export const condition = {
  customers: Array,
  processAll: true
};

export const content = async () => {
  // Create a subtask for each customer
  data.customers.forEach((customer, index) => {
    const taskName = `Process customer: ${customer.email}`;
    const taskData = {
      customer: customer,
      processCustomer: true,
      parentTaskId: task.id
    };
    
    task.subtask(taskName, taskData, { 
      into: `customers.${index}.result`,
      waitFor: true 
    });
  });
  
  console.log(`Created ${data.customers.length} subtasks`);
};
```

### Best Practices

#### Structure Your Data

Organize task data logically for easier step matching:

```json
{
  "customer": {
    "profile": { /* customer data */ },
    "preferences": { /* settings */ },
    "status": { /* processing state */ }
  },
  "order": {
    "items": [ /* order items */ ],
    "billing": { /* payment info */ },
    "shipping": { /* delivery info */ }
  },
  "processing": {
    "stage": "validation",
    "startedAt": "2025-08-17T10:30:00Z",
    "errors": []
  }
}
```

#### Use Consistent Naming

Adopt consistent field naming conventions:

```json
{
  "createdAt": "2025-08-17T10:30:00Z",
  "updatedAt": "2025-08-17T10:31:00Z", 
  "processedAt": "2025-08-17T10:32:00Z",
  "isValid": true,
  "hasErrors": false,
  "totalAmount": 1500.00
}
```

#### Track Processing State

Add metadata to track automation progress:

```json
{
  "processing": {
    "stage": "email_sent",
    "completedSteps": ["validate", "create_crm", "send_email"],
    "pendingSteps": ["follow_up"],
    "startedAt": "2025-08-17T10:30:00Z",
    "lastUpdated": "2025-08-17T10:32:00Z"
  }
}
```

#### Handle Errors Gracefully

Capture and track errors without stopping the entire process:

```javascript
export const condition = {
  customer: {
    email: String
  }
};

export const content = async () => {
  try {
    // Attempt operation
    const result = await connectors.crm.createContact({
      email: data.customer.email,
      name: data.customer.name
    });
    
    data.customer.crmId = result.id;
    data.customer.crmCreated = true;
    
  } catch (error) {
    // Log error but continue processing
    console.error('CRM creation failed:', error.message);
    
    data.customer.crmError = error.message;
    data.customer.crmCreated = false;
    data.customer.requiresManualReview = true;
    
    // Add to error collection for batch processing
    data.errors = data.errors || [];
    data.errors.push({
      step: 'crm_creation',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
```

Tasks are the foundation of ALOMA automations. Their schemaless, evolving nature enables flexible, adaptive workflows that can handle diverse scenarios while maintaining clean separation between data and logic. Master task design and manipulation to build robust, scalable automations that grow with your needs.
