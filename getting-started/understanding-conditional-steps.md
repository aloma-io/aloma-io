# Understanding Conditional Steps

## Understanding Conditional Steps

**This is the key concept that makes ALOMA different from every other automation platform.**

Most programming is **imperative**: you write code that says "do this, then do that, then do something else." ALOMA introduces **conditional execution**: you write code that says "when the data looks like this, do that."

This fundamental shift transforms how you build automations - from rigid sequences to intelligent, adaptive workflows.

### Traditional vs. Conditional Approach

#### Traditional Imperative Programming

```javascript
// You define the exact sequence
function processOrder(order) {
  // Step 1: Always happens first
  const validated = validatePayment(order);
  
  // Step 2: Always happens second
  const inventory = updateInventory(order);
  
  // Step 3: Always happens third
  sendConfirmation(order, validated, inventory);
}
```

**Problems with this approach:**

* ❌ Rigid sequence that can't adapt to different scenarios
* ❌ Error in step 1 breaks the entire workflow
* ❌ Hard to add new logic without changing existing code
* ❌ Doesn't handle parallel operations efficiently
* ❌ Complex branching requires duplicate code paths

#### ALOMA Conditional Execution

```javascript
// Step 1: Payment validation
export const condition = { 
  order: { 
    status: "pending", 
    payment: { method: String, amount: Number } 
  } 
};

export const content = async () => {
  console.log('Validating payment...');
  // Payment validation logic here
  data.order.paymentValidated = true;
};

// Step 2: Inventory update (runs independently)
export const condition = { 
  order: { 
    items: Array,
    status: "pending" 
  } 
};

export const content = async () => {
  console.log('Updating inventory...');
  // Inventory logic here
  data.order.inventoryUpdated = true;
};

// Step 3: Confirmation (waits for both previous steps)
export const condition = { 
  order: { 
    paymentValidated: true,
    inventoryUpdated: true 
  } 
};

export const content = async () => {
  console.log('Sending confirmation...');
  // Confirmation logic here
  data.order.status = "confirmed";
  task.complete();
};
```

**Benefits of conditional execution:**

* ✅ Steps run automatically when conditions are met
* ✅ Self-healing: errors in one step don't stop others
* ✅ Easy to add new steps without modifying existing ones
* ✅ Workflows adapt to different data scenarios

### How Step Matching Works

#### 1. JSON Pattern Matching

ALOMA uses JSON patterns to define when steps should execute:

**Type Matching**

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

**Value Matching**

```javascript
export const condition = {
  order: {
    status: "pending",           // Exact value match
    priority: "high",            // Must equal "high"
    type: "premium"              // Must equal "premium"
  }
};
```

**Nested Object Matching**

```javascript
export const condition = {
  customer: {
    address: {
      country: "US",
      state: String,
      zipCode: Number
    }
  }
};
```

**Array Content Matching**

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

#### 2. Advanced Operators

ALOMA supports sophisticated matching operators for complex conditions:

**Comparison Operators**

```javascript
export const condition = {
  user: {
    age: { $gt: 18 },           // Greater than 18
    score: { $gte: 100 },       // Greater than or equal to 100
    credits: { $lt: 50 },       // Less than 50
    attempts: { $lte: 3 }       // Less than or equal to 3
  }
};
```

**Inclusion/Exclusion**

```javascript
export const condition = {
  user: {
    role: { $in: ["admin", "moderator"] },      // Role is admin OR moderator
    status: { $nin: ["banned", "suspended"] }   // Status is NOT banned or suspended
  }
};
```

**Existence Checks**

```javascript
export const condition = {
  order: {
    paymentMethod: { $exists: true },    // Payment method field exists
    discountCode: { $exists: false }     // Discount code field doesn't exist
  }
};
```

#### 3. Best Match Selection

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

ALOMA counts the number of matched fields and selects the step with the highest specificity score.

### Data Flow and State Evolution

#### Understanding Task State Changes

Your task data evolves as steps execute, triggering new steps to become eligible:

```javascript
// Initial task
{
  "order": {
    "id": "12345",
    "items": [{"product": "laptop", "qty": 1}],
    "customer": {"email": "user@example.com"}
  }
}

// After payment processing step
{
  "order": {
    "id": "12345",
    "items": [{"product": "laptop", "qty": 1}],
    "customer": {"email": "user@example.com"},
    "payment": {"status": "completed", "amount": 999}
  }
}

// After inventory step
{
  "order": {
    "id": "12345",
    "items": [{"product": "laptop", "qty": 1, "reserved": true}],
    "customer": {"email": "user@example.com"},
    "payment": {"status": "completed", "amount": 999},
    "inventory": {"updated": true}
  }
}
```

Each step can modify the task data, potentially triggering additional steps to become eligible.

#### Workflow Orchestration Example

Let's trace through a complete e-commerce order workflow:

```javascript
// E-commerce order processing

// Step 1: Validate customer (runs immediately)
export const condition = { 
  order: { 
    customer: { email: String } 
  } 
};

export const content = async () => {
  // Customer validation logic
  const isValid = data.order.customer.email.includes('@');
  data.order.customer.validated = isValid;
  console.log('Customer validated:', isValid);
};

// Step 2: Check inventory (runs in parallel with step 1)
export const condition = { 
  order: { 
    items: Array 
  } 
};

export const content = async () => {
  // Inventory check logic
  let allInStock = true;
  for (const item of data.order.items) {
    const stock = await connectors.inventory.check({
      sku: item.sku,
      quantity: item.quantity
    });
    if (!stock.available) allInStock = false;
  }
  data.order.inventory = { available: allInStock, checked: true };
  console.log('Inventory checked:', allInStock);
};

// Step 3: Process payment (waits for customer validation)
export const condition = { 
  order: { 
    customer: { validated: true },
    payment: { method: String }
  } 
};

export const content = async () => {
  // Payment processing logic
  const result = await connectors.stripe.charge({
    amount: data.order.total,
    source: data.order.payment.method
  });
  data.order.payment.processed = result.success;
  console.log('Payment processed:', result.success);
};

// Step 4: Ship order (waits for all prerequisites)
export const condition = { 
  order: { 
    customer: { validated: true },
    inventory: { available: true },
    payment: { processed: true }
  } 
};

export const content = async () => {
  // Shipping logic
  const shipment = await connectors.shipping.create({
    orderId: data.order.id,
    items: data.order.items
  });
  data.order.status = "shipped";
  data.order.trackingNumber = shipment.tracking;
  
  // Send confirmation email
  await connectors.eMailSmtpOAuth.sendEmail({
    to: data.order.customer.email,
    subject: `Order ${data.order.id} Shipped`,
    html: `Your order is on the way! Tracking: ${shipment.tracking}`
  });
  
  task.complete();
};
```

#### Execution Flow Analysis

1. **Initial trigger**: Order data arrives
2. **Parallel execution**: Steps 1 and 2 run simultaneously
3. **Conditional progression**: Step 3 waits for step 1 to complete
4. **Final coordination**: Step 4 waits for all prerequisites
5. **Automatic completion**: Task ends when conditions are met

### Benefits of Conditional Execution

#### 1. **Self-Organizing Logic**

Steps automatically execute in the right order based on data dependencies, not predefined sequences.

**Example: Dynamic workflow based on user type**

```javascript
// Premium users get immediate processing
export const condition = {
  user: { tier: "premium" },
  order: { status: "pending" }
};

export const content = async () => {
  data.order.priority = "high";
  data.order.approved = true; // Skip approval workflow
};

// Standard users need approval for high-value orders
export const condition = {
  user: { tier: "standard" },
  order: { 
    status: "pending",
    total: { $gt: 1000 }
  }
};

export const content = async () => {
  data.order.requiresApproval = true;
  data.order.priority = "normal";
};
```

#### 2. **Parallel Processing**

Independent steps run simultaneously, improving performance:

```javascript
// These three steps all run in parallel
// Customer validation
export const condition = { order: { customer: Object } };

// Inventory check  
export const condition = { order: { items: Array } };

// Tax calculation
export const condition = { order: { total: Number, location: String } };
```

#### 3. **Fault Tolerance**

Errors in one step don't prevent other independent steps from running:

```javascript
// Even if email step fails, SMS notification can still succeed
export const condition = { 
  notification: { type: "email" },
  customer: { email: String }
};

export const content = async () => {
  try {
    await connectors.email.send({
      to: data.customer.email,
      subject: "Order Update"
    });
    data.notification.emailSent = true;
  } catch (error) {
    console.error('Email failed:', error);
    data.notification.emailFailed = true;
  }
};

// Fallback SMS step
export const condition = {
  notification: { emailFailed: true },
  customer: { phone: String }
};

export const content = async () => {
  await connectors.sms.send({
    to: data.customer.phone,
    message: "Order update - check your account"
  });
  data.notification.smsSent = true;
};
```

#### 4. **Incremental Development**

Add new steps without modifying existing ones:

```javascript
// Original workflow: payment → fulfillment

// Later, add fraud detection without changing existing steps
export const condition = {
  order: {
    payment: { processed: true },
    total: { $gt: 500 }  // Only for high-value orders
  }
};

export const content = async () => {
  const fraudCheck = await connectors.fraudDetection.analyze(data.order);
  data.order.fraudScore = fraudCheck.score;
  data.order.fraudApproved = fraudCheck.score < 0.5;
};

// Update fulfillment step to check fraud score
export const condition = { 
  order: { 
    payment: { processed: true },
    fraudApproved: true  // Add new requirement
  } 
};

export const content = async () => {
  //Notify the fraud
};
```

#### 5. **Dynamic Workflows**

The same set of steps handles different scenarios based on input data:

```javascript
// Task 1: B2B order (triggers approval workflow)
{
  "order": {
    "type": "B2B",
    "total": 5000,
    "customer": {"type": "business"}
  }
}

// Task 2: B2C order (direct to fulfillment)
{
  "order": {
    "type": "B2C", 
    "total": 50,
    "customer": {"type": "individual"}
  }
}

// Same steps handle both scenarios differently
export const condition = {
  order: {
    type: "B2B",
    total: { $gt: 1000 }
  }
};

export const content = async () => {
  data.order.requiresApproval = true;
  data.order.approver = "sales-manager";
};
```

### Common Conditional Patterns

#### Sequential Processing

```javascript
// Step 1: Start processing
export const condition = { stage: "start" };
export const content = async () => { 
  data.stage = "processing"; 
};

// Step 2: Continue processing
export const condition = { stage: "processing" };
export const content = async () => { 
  data.stage = "complete"; 
};
```

#### Parallel Processing

```javascript
// Both run simultaneously when order arrives
export const condition = { 
  order: { status: "new" },
  customer: { email: String }
};

export const condition = { 
  order: { status: "new" },
  inventory: { check: true }
};
```

#### Conditional Branching

```javascript
// Different paths based on data
export const condition = { 
  user: { type: "premium" } 
};

export const condition = { 
  user: { type: "standard" } 
};
```

#### Aggregation Pattern

```javascript
// Wait for multiple conditions
export const condition = { 
  emailSent: true, 
  smsNotified: true, 
  databaseUpdated: true 
};

export const content = async () => {
  console.log('All notifications complete');
  task.complete();
};
```

#### Retry and Recovery

```javascript
// Initial attempt
export const condition = {
  apiCall: { url: String, attempts: { $lt: 3 } }
};

export const content = async () => {
  try {
    const result = await connectors.externalApi.call(data.apiCall.url);
    data.apiCall.success = true;
    data.apiCall.result = result;
  } catch (error) {
    data.apiCall.attempts = (data.apiCall.attempts || 0) + 1;
    data.apiCall.lastError = error.message;
    console.log(`Attempt ${data.apiCall.attempts} failed, will retry`);
    step.redo();
};
```

### Best Practices for Conditional Steps

#### 1. **Design Specific Conditions**

```javascript
// ✅ Good: Specific conditions
export const condition = {
  order: {
    status: "paid",
    customer: { tier: "premium" },
    total: { $gt: 1000 }
  }
};

// ❌ Avoid: Overly broad conditions
export const condition = {
  order: Object  // Matches any order, inefficient
};
```

#### 2. **Use Clear Data Markers**

```javascript
// ✅ Good: Clear boolean flags
export const content = async () => {
  // Process customer
  data.customer.validated = true;
  data.customer.validatedAt = new Date().toISOString();
};

// Next step clearly depends on validation
export const condition = {
  customer: { validated: true }
};
```

#### 3. **Handle Edge Cases**

```javascript
export const condition = {
  order: {
    items: Array,
    customer: { validated: true }
  }
};

export const content = async () => {
  // Handle empty cart
  if (data.order.items.length === 0) {
    data.order.status = "empty_cart";
    return;
  }
  
  // Normal processing
  data.order.status = "processing";
};
```

#### 4. **Use Consistent Naming**

```javascript
// ✅ Consistent pattern: [action] + [entity] + [status]
data.customer.validated = true;
data.payment.processed = true;
data.email.sent = true;
data.inventory.checked = true;
```

### Debugging Conditional Steps

#### Understanding Why Steps Don't Match

```javascript
export const content = async () => {
  // Debug current data structure
  console.log('Current data:', JSON.stringify(data, null, 2));
  
  // Check specific fields
  console.log('Customer exists:', !!data.customer);
  console.log('Email exists:', !!data.customer?.email);
  console.log('Order status:', data.order?.status);
  
  // Your step logic here
};
```

#### Common Matching Issues

1. **Typos in field names**: `data.customer.emai` vs `data.customer.email`
2. **Type mismatches**: Expecting `Number` but getting `String`
3. **Missing nested objects**: Condition expects `customer.address.zip` but `address` is undefined
4. **Array structure**: Expecting array of objects but getting array of strings

#### Using Task Visualization

```javascript
export const content = async () => {
  // Visualize current data state
  task.visualize({
    type: 'data',
    name: 'Current Task State',
    data: data
  });
  
  // Your processing logic
};
```

This conditional execution model is what makes ALOMA uniquely powerful for building complex, maintainable automations that scale elegantly as your requirements grow. Instead of fighting rigid workflows, you create intelligent systems that adapt to your data.
