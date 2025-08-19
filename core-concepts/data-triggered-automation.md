# Data-Triggered Automation

## Data-Triggered Automation

**The fundamental shift from "tell the computer what to do" to "tell the computer when to act."**

Data-triggered automation represents a paradigm shift in how we think about workflow execution. Instead of defining rigid sequences of operations, you create reactive systems that respond intelligently to data conditions. This approach transforms brittle, hard-to-maintain workflows into adaptive, self-organizing automations.

### Traditional vs. Data-Triggered Approach

#### Traditional Event-Driven Systems

Most automation platforms work on a simple event model:

```
Event Occurs → Execute Predefined Sequence → End
```

**Problems with this approach:**

* **Rigid sequences**: Every scenario must follow the same path
* **Brittle error handling**: One failure breaks the entire chain
* **Complex branching**: Adding new logic requires modifying existing flows
* **Maintenance nightmares**: Changes ripple through the entire system

#### ALOMA's Data-Triggered Model

ALOMA introduces a fundamentally different approach:

Data State Changes → Eligible Steps Activate → Data State Updates → New Steps Become Eligible

**Benefits of this approach:**

* **Self-organizing**: Steps execute based on current data conditions
* **Fault tolerant**: Independent steps continue even if others fail
* **Infinitely extensible**: Add new steps without touching existing logic
* **Naturally parallel**: Independent conditions trigger simultaneously

### How Data-Triggered Automation Works

#### The Core Cycle

1. **Data arrives** or changes in your workspace
2. **ALOMA evaluates** all step conditions against current data
3. **Matching steps execute** and potentially modify the data
4. **Cycle repeats** until no more steps match or task is completed

#### Real-World Example: Customer Onboarding

Let's trace how data triggers different automation paths. First, deploy the automation:

```bash
# Create steps using CLI
aloma step add "validate_customer" -c '{"customer":{"email":"String","status":"new"}}'
aloma step add "create_crm_contact" -c '{"customer":{"validated":true}}'
aloma step add "send_welcome_email" -c '{"customer":{"validated":true}}'
aloma step add "complete_onboarding" -c '{"customer":{"crmCreated":true,"welcomeEmailSent":true}}'

# Create test task to see the flow
aloma task new "customer onboarding test" -d '{"customer":{"email":"john@company.com","firstName":"John","lastName":"Smith","status":"new"}}'

# Monitor execution
aloma task list --state running
aloma task log <task-id> --logs --changes
```

Now let's examine the step logic:

```javascript
// Step 1: New customer validation
export const condition = {
  customer: {
    email: String,
    status: "new"
  }
};

export const content = async () => {
  console.log('Validating new customer:', data.customer.email);
  
  // Validate email format
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email);
  
  if (emailValid) {
    data.customer.validated = true;
    data.customer.validatedAt = new Date().toISOString();
  } else {
    data.customer.validationError = "Invalid email format";
  }
};
```

```javascript
// Step 2: Create CRM record (only for validated customers)
export const condition = {
  customer: {
    validated: true,
    email: String
  }
};

export const content = async () => {
  console.log('Creating CRM record for validated customer');
  
  const contact = await connectors.hubspotCom.request({
    url: '/crm/v3/objects/contacts',
    options: {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          email: data.customer.email,
          firstname: data.customer.firstName,
          lastname: data.customer.lastName,
          lifecyclestage: 'lead'
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    }
  });
  
  data.customer.crmId = contact.id;
  data.customer.crmCreated = true;
};
```

```javascript
// Step 3: Send welcome email (runs in parallel with CRM creation)
export const condition = {
  customer: {
    validated: true,
    email: String
  }
};

export const content = async () => {
  console.log('Sending welcome email');
  
  await connectors.eMailSmtpOAuth.sendEmail({
    to: data.customer.email,
    subject: 'Welcome to Our Platform!',
    html: `
      <h2>Welcome ${data.customer.firstName}!</h2>
      <p>Thank you for joining us. We're excited to have you on board.</p>
    `
  });
  
  data.customer.welcomeEmailSent = true;
  data.customer.emailSentAt = new Date().toISOString();
};
```

```javascript
// Step 4: Complete onboarding (waits for all prerequisites)
export const condition = {
  customer: {
    crmCreated: true,
    welcomeEmailSent: true
  }
};

export const content = async () => {
  console.log('Completing customer onboarding');
  
  data.customer.status = "onboarded";
  data.customer.onboardedAt = new Date().toISOString();
  
  // Notify sales team about new customer
  await connectors.slackCom.send({
    channel: "#sales",
    text: `🎉 New customer onboarded: ${data.customer.firstName} ${data.customer.lastName}`,
    attachments: [{
      fields: [
        { title: "Email", value: data.customer.email, short: true },
        { title: "CRM ID", value: data.customer.crmId, short: true }
      ]
    }]
  });
  
  task.complete();
};
```

#### Data Flow Analysis

Watch how the data evolves and triggers each step:

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

_Triggers: Step 1 (validation)_

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

_Triggers: Step 2 (CRM) and Step 3 (Email) in parallel_

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

_Triggers: Step 4 (completion)_

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

### Key Principles of Data-Triggered Automation

#### 1. **Data as the Source of Truth**

Your data state determines what happens next, not predefined sequences:

```javascript
// Different customer types trigger different workflows
export const condition = {
  customer: {
    type: "enterprise",
    validated: true
  }
};

export const content = async () => {
  // Enterprise customers get white-glove onboarding
  data.customer.assignedManager = "enterprise-team";
  data.customer.priority = "high";
  data.customer.onboardingType = "white-glove";
};
```

```javascript
export const condition = {
  customer: {
    type: "individual",
    validated: true
  }
};

export const content = async () => {
  // Individual customers get self-service onboarding
  data.customer.onboardingType = "self-service";
  data.customer.priority = "normal";
};
```

#### 2. **Conditions Define Dependencies**

Instead of explicit workflow connections, conditions create natural dependencies:

```javascript
// This step waits for multiple prerequisites automatically
export const condition = {
  order: {
    paymentProcessed: true,
    inventoryReserved: true,
    addressValidated: true,
    customer: {
      verified: true
    }
  }
};

export const content = async () => {
  // All prerequisites met - safe to ship
  data.order.status = "ready_to_ship";
};
```

#### 3. **Parallel Processing by Default**

Independent conditions naturally enable parallel execution:

```javascript
// All three steps run simultaneously when order arrives
// Payment processing
export const condition = {
  order: { 
    status: "pending",
    paymentMethod: String 
  }
};

// Inventory check
export const condition = {
  order: {
    status: "pending",
    items: Array
  }
};

// Address validation  
export const condition = {
  order: {
    status: "pending",
    shippingAddress: Object
  }
};
```

#### 4. **Graceful Degradation**

Failed steps don't block independent operations:

```javascript
// Email notification step
export const condition = {
  order: { status: "completed" }
};

export const content = async () => {
  try {
    await connectors.eMailSmtpOAuth.sendEmail({
      to: data.order.customer.email,
      subject: "Order Complete"
    });
    data.order.emailNotificationSent = true;
  } catch (error) {
    console.error('Email failed:', error);
    data.order.emailNotificationFailed = true;
  }
};

// SMS fallback step (only runs if email fails)
export const condition = {
  order: {
    emailNotificationFailed: true,
    customer: { phone: String }
  }
};

export const content = async () => {
  await connectors.sms.send({
    to: data.order.customer.phone,
    message: "Your order is complete! Check your account for details."
  });
  data.order.smsNotificationSent = true;
};
```

### Advanced Data-Triggered Patterns

#### Dynamic Workflow Selection

Different data patterns trigger completely different workflow paths:

```javascript
// High-value B2B orders go through approval workflow
export const condition = {
  order: {
    type: "B2B",
    total: { $gt: 10000 }
  }
};

export const content = async () => {
  data.order.requiresApproval = true;
  data.order.approver = "sales-director";
  data.order.priority = "high";
  
  // Notify approver
  await connectors.slackCom.send({
    channel: "#approvals",
    text: `High-value B2B order requires approval: $${data.order.total}`
  });
};

// Standard B2C orders auto-approve
export const condition = {
  order: {
    type: "B2C",
    total: { $lt: 1000 }
  }
};

export const content = async () => {
  data.order.approved = true;
  data.order.approvedBy = "system";
  data.order.approvedAt = new Date().toISOString();
};
```

#### Event Aggregation

Wait for multiple data points before proceeding:

```javascript
// Only proceed when all verification steps complete
export const condition = {
  customer: {
    emailVerified: true,
    phoneVerified: true,
    identityVerified: true,
    addressVerified: true
  }
};

export const content = async () => {
  console.log('All verification complete - activating account');
  
  data.customer.status = "active";
  data.customer.activatedAt = new Date().toISOString();
  data.customer.verificationScore = 100;
  
  // Grant full access
  data.customer.permissions = ["read", "write", "admin"];
  
  task.complete();
};
```

#### Time-Based Triggers

Combine data conditions with time-based logic:

```javascript
// Follow-up for customers who haven't completed onboarding
export const condition = {
  customer: {
    status: "partial",
    createdAt: String
  }
};

export const content = async () => {
  const createdTime = new Date(data.customer.createdAt);
  const hoursSinceCreation = (Date.now() - createdTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceCreation > 24) {
    // Send follow-up email after 24 hours
    await connectors.eMailSmtpOAuth.sendEmail({
      to: data.customer.email,
      subject: "Complete Your Account Setup",
      html: "We noticed you haven't finished setting up your account..."
    });
    
    data.customer.followUpSent = true;
    data.customer.followUpSentAt = new Date().toISOString();
  }
};
```

### Benefits Over Traditional Approaches

#### Scalability

Traditional workflows become exponentially complex as you add features. Data-triggered automation scales linearly:

**Traditional (exponential complexity):**

* 2 order types × 3 customer tiers × 2 regions = 12 workflow variations
* Adding 1 new order type requires modifying 6 existing workflows

**ALOMA (linear complexity):**

* Add one new step with the right condition
* Existing steps continue working unchanged
* Complexity grows with number of steps, not combinations

#### Maintainability

Changes are isolated to individual steps:

```javascript
// Adding fraud detection doesn't break existing flow
export const condition = {
  order: {
    total: { $gt: 500 },
    customer: { newCustomer: true }
  }
};

export const content = async () => {
  const fraudCheck = await connectors.fraudDetection.analyze(data.order);
  data.order.fraudScore = fraudCheck.score;
  data.order.fraudApproved = fraudCheck.score < 0.3;
};

// Existing fulfillment step just adds fraud check to its condition
export const condition = {
  order: {
    approved: true,
    fraudApproved: true,  // New requirement
    inventoryReserved: true
  }
};
```

#### Debugging and Observability

Data-triggered automation provides clear visibility into why steps execute:

```javascript
export const content = async () => {
  // Log current data state for debugging
  console.log('Step executing with data:', {
    customerType: data.customer.type,
    orderTotal: data.order.total,
    hasValidPayment: !!data.order.payment,
    timestamp: new Date().toISOString()
  });
  
  // Visualize current state
  task.visualize({
    type: 'data',
    name: 'Current Data State',
    data: data
  });
  
  // Your step logic here
};
```

Data-triggered automation transforms workflow development from an exercise in predicting every possible scenario to building reactive systems that adapt intelligently to whatever data they encounter. This fundamental shift is what makes ALOMA uniquely powerful for complex, real-world automation challenges.
