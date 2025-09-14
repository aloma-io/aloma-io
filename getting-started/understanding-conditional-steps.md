# Understanding Conditional Steps

## Understanding Conditional Steps

The key to mastering ALOMA is understanding how conditional execution differs from traditional sequential workflows. This paradigm shift enables automation that's more flexible, maintainable, and naturally scalable.

### Traditional vs. Conditional Thinking

#### Traditional Workflow Thinking

```
1. Validate email
2. Add to CRM  
3. Send welcome email
4. Complete onboarding
```

_Fixed sequence, rigid branching, complex error handling_

#### ALOMA Conditional Thinking

```
- When data has unvalidated email → validate it
- When email is validated → add to CRM
- When email is validated → send welcome email  
- When both CRM and email are complete → finish onboarding
```

_Data-driven activation, natural parallelism, emergent workflows_

### Condition Pattern Matching

ALOMA uses JSON pattern matching to determine when steps should execute. Understanding these patterns is crucial to effective automation design.

#### Type Matching

Match on JavaScript types for flexible conditions:

```javascript
export const condition = {
  user: {
    name: String,      // Must be a string
    age: Number,       // Must be a number  
    active: Boolean,   // Must be a boolean
    tags: Array        // Must be an array
  }
};
```

#### Value Matching

Match on exact values for specific triggers:

```javascript
export const condition = {
  order: {
    status: "pending",    // Exact value match
    priority: "high",     // Must equal "high"
    type: "premium"       // Must equal "premium"
  }
};
```

#### Nested Object Matching

Handle complex data structures with nested conditions:

```javascript
export const condition = {
  customer: {
    address: {
      country: "US",
      state: String,      // Any US state
      zipCode: Number     // Numeric zip code
    }
  }
};
```

#### Array Content Matching

Match arrays by their content structure:

```javascript
export const condition = {
  items: [
    {
      sku: String,
      quantity: Number,
      price: Number
    }
  ]
};
// Matches if items array contains at least one object with these fields
```

#### Mixed Pattern Matching

Combine different matching types for precise conditions:

```javascript
export const condition = {
  order: {
    id: String,
    total: Number,
    status: "pending",
    items: Array,
    customer: {
      type: "enterprise",
      verified: true
    }
  }
};
```

### Data Flow and State Evolution

Understanding how task data evolves through step execution is fundamental to ALOMA automation design.

#### Task Lifecycle Example

Let's trace how data evolves through a customer onboarding process:

**Initial State:**

```json
{
  "customer": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe", 
    "status": "new"
  }
}
```

_Triggers: Email validation step_

**After Validation:**

```json
{
  "customer": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "new",
    "validated": true,
    "validatedAt": "2025-01-15T10:30:00Z"
  }
}
```

_Triggers: CRM creation AND welcome email steps (parallel)_

**After CRM and Email:**

```json
{
  "customer": {
    "email": "john@example.com",
    "firstName": "John", 
    "lastName": "Doe",
    "status": "new",
    "validated": true,
    "validatedAt": "2025-01-15T10:30:00Z",
    "crmId": "12345",
    "crmCreated": true,
    "welcomeEmailSent": true,
    "emailSentAt": "2025-01-15T10:30:15Z"
  }
}
```

_Triggers: Completion step_

**Final State:**

```json
{
  "customer": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe", 
    "status": "onboarded",
    "validated": true,
    "validatedAt": "2025-01-15T10:30:00Z",
    "crmId": "12345",
    "crmCreated": true,
    "welcomeEmailSent": true,
    "emailSentAt": "2025-01-15T10:30:15Z",
    "onboardedAt": "2025-01-15T10:30:30Z"
  }
}
```

_Task completed_

#### Step Specificity and Selection

When multiple steps match the same task, ALOMA selects the **most specific** match:

```javascript
// Task data
{
  "user": {
    "name": "John",
    "age": 25,
    "role": "admin",
    "department": "engineering"
  }
}

// Step A (specificity: 1 field matched)
export const condition = { user: { name: String } };

// Step B (specificity: 2 fields matched)  
export const condition = { user: { name: String, age: Number } };

// Step C (specificity: 4 fields matched) - SELECTED
export const condition = {
  user: {
    name: String,
    age: Number, 
    role: "admin",
    department: String
  }
};
```

ALOMA counts matched fields and selects the step with the highest specificity score.

### Advanced Conditional Patterns

#### State Machine Pattern

Model business processes as state transitions:

```javascript
export const condition = {
  order: {
    state: "pending",
    paymentMethod: String
  }
};

export const content = async () => {
  // Transition based on business logic
  let nextState;
  
  switch (data.order.state) {
    case 'pending':
      nextState = data.order.paymentConfirmed ? 'processing' : 'cancelled';
      break;
    case 'processing':
      nextState = data.order.shipped ? 'shipped' : 'processing';
      break;
    case 'shipped':
      nextState = data.order.delivered ? 'delivered' : 'shipped';
      break;
  }
  
  data.order.previousState = data.order.state;
  data.order.state = nextState;
  data.order.stateChangedAt = new Date().toISOString();
  
  console.log(`Order state: ${data.order.previousState} → ${nextState}`);
};
```

#### Fan-out Pattern

Create multiple parallel processes from a single trigger:

```javascript
export const condition = {
  customer: {
    type: "enterprise",
    onboarded: true
  }
};

export const content = async () => {
  // Create multiple parallel workflows
  const workflows = [
    { type: "crm_setup", priority: "high" },
    { type: "account_setup", priority: "medium" },
    { type: "training_setup", priority: "low" }
  ];
  
  workflows.forEach((workflow, index) => {
    data[`workflow_${index}`] = {
      ...workflow,
      customerId: data.customer.id,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
  });
  
  console.log(`Created ${workflows.length} parallel workflows`);
};
```

#### Aggregation Pattern

Wait for multiple processes to complete:

```javascript
export const condition = {
  workflow_0: { status: "complete" },
  workflow_1: { status: "complete" },
  workflow_2: { status: "complete" }
};

export const content = async () => {
  console.log('All workflows complete - finalizing customer setup');
  
  data.customer.setupComplete = true;
  data.customer.completedAt = new Date().toISOString();
  
  // Calculate total processing time
  const workflows = [data.workflow_0, data.workflow_1, data.workflow_2];
  const startTime = Math.min(...workflows.map(w => new Date(w.createdAt)));
  const endTime = Date.now();
  
  data.customer.totalProcessingTime = endTime - startTime;
  
  task.complete();
};
```

#### Error Handling Pattern

Handle errors through data state rather than try-catch:

```javascript
export const condition = {
  payment: {
    status: "failed",
    retryCount: Number
  }
};

export const content = async () => {
  const maxRetries = 3;
  
  if (data.payment.retryCount < maxRetries) {
    console.log(`Retrying payment (attempt ${data.payment.retryCount + 1}/${maxRetries})`);
```
