# Conditional Step Matching

## Conditional Step Matching

**Step matching is ALOMA's core mechanism for determining which JavaScript code runs when. Instead of predefined sequences, steps execute when their conditions match the current task data state.**

Conditional step matching transforms automation from rigid "do A, then B, then C" workflows into intelligent, adaptive systems that respond dynamically to data patterns. This enables parallel processing, fault tolerance, and infinitely scalable complexity.

### How Step Matching Works

#### The Matching Process

1. **Task data evaluation** - ALOMA examines the current task data structure
2. **Condition checking** - All step conditions are tested against the task data
3. **Best match selection** - If multiple steps match, ALOMA selects the most specific
4. **Step execution** - The selected step runs and potentially modifies task data
5. **Re-evaluation** - Process repeats with updated data until no more matches or task completes

#### Basic Matching Example

```javascript
// Task data
{
  "customer": {
    "email": "john@company.com",
    "name": "John Smith",
    "verified": false
  }
}

// Step condition that matches this data
export const condition = {
  customer: {
    email: String,
    verified: false
  }
};

export const content = async () => {
  // This step will execute because the condition matches
  console.log('Validating customer:', data.customer.email);
  data.customer.verified = true;
  data.customer.verifiedAt = new Date().toISOString();
};
```

After this step executes, the modified task data might trigger other steps that require `verified: true`.

### JSON Pattern Matching

#### Type Matching

Match on JavaScript data types to handle any value of that type:

```javascript
export const condition = {
  user: {
    name: String,      // Any string value
    age: Number,       // Any numeric value
    active: Boolean,   // Any boolean value (true/false)
    tags: Array,       // Any array
    settings: Object   // Any object
  }
};

export const content = async () => {
  console.log(`Processing user: ${data.user.name}, age: ${data.user.age}`);
  // This matches regardless of the specific values
};
```

#### Exact Value Matching

Match on specific values for precise control:

```javascript
export const condition = {
  order: {
    status: "pending",           // Must equal exactly "pending"
    priority: "high",            // Must equal exactly "high"
    type: "premium",             // Must equal exactly "premium"
    urgent: true                 // Must equal exactly true
  }
};

export const content = async () => {
  console.log('Processing high-priority premium order');
  data.order.expedited = true;
  data.order.assignedTo = "premium-team";
};
```

#### Nested Object Matching

Match deeply nested data structures:

```javascript
export const condition = {
  customer: {
    profile: {
      tier: "enterprise",
      location: {
        country: "US",
        state: String,
        zipCode: Number
      }
    },
    subscription: {
      plan: "premium",
      active: true
    }
  }
};

export const content = async () => {
  console.log('Processing US enterprise customer');
  data.customer.profile.supportLevel = "white-glove";
  data.customer.profile.priority = "highest";
};
```

#### Array Content Matching

ALOMA supports two types of array matching:

**1. Array Structure Matching** - Match arrays containing objects with specific structure:

```javascript
export const condition = {
  order: {
    items: [
      {
        sku: String,        // Must be an array of objects with sku, quantity, price
        quantity: Number,
        price: Number
      }
    ]
  }
};

export const content = async () => {
  // Calculate order total
  const total = data.order.items.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);
  
  data.order.total = total;
  data.order.calculatedAt = new Date().toISOString();
};
```

**This would match:**
```javascript
{
  order: {
    items: [
      { sku: "ABC123", quantity: 2, price: 29.99 },
      { sku: "XYZ789", quantity: 1, price: 15.50 }
    ]
  }
}
```

**2. Array Value Matching** - Match arrays containing specific values:

```javascript
export const condition = {
  notification: {
    channels: ["email", "sms"],  // Array must contain BOTH "email" AND "sms"
    priority: "high"
  }
};

export const content = async () => {
  console.log('Sending high-priority multi-channel notification');
  data.notification.allChannelsRequired = true;
};
```

**This would match:**
```javascript
{
  notification: {
    channels: ["email", "sms", "push"],  // Contains both required values
    priority: "high"
  }
}
```

**This would NOT match:**
```javascript
{
  notification: {
    channels: ["email", "push"],  // Missing "sms"
    priority: "high"
  }
}
```

**Important Array Matching Notes:**
- **Order doesn't matter** - values can be in any order
- **Additional values are allowed** - array can contain extra items
- **All specified values must be present** - it's an AND operation, not OR
- **For object arrays** - each object must match the specified structure

#### RegExp Matching

Match text patterns using regular expressions:

```javascript
export const condition = {
  email: {
    subject: /testString/,  // Matches if subject contains "testString"
    from: String
  }
};

export const content = async () => {
  console.log('Processing email with testString in subject');
  data.email.processed = true;
};
```

**This would match:**
```javascript
{
  email: {
    subject: "This is a testString for validation",
    from: "user@example.com"
  }
}
```

**This would also match:**
```javascript
{
  email: {
    subject: "testString is important",
    from: "admin@company.com"
  }
}
```

**This would NOT match:**
```javascript
{
  email: {
    subject: "Regular email without the keyword",
    from: "user@example.com"
  }
}
```

### Supported Operators

Based on testing, ALOMA supports the following comparison operators:

#### Not Equal Operator ($ne) - Limited to null only

```javascript
export const condition = {
  user: {
    lastLogin: { $ne: null },       // ✅ WORKS - Field exists and is not null
  }
};
```

**This would match:**
```javascript
{
  user: {
    lastLogin: "2024-01-15T10:30:00Z",  // Not null, so matches $ne: null
    status: "active",
    email: "user@company.com"
  }
}
```

**This would NOT match:**
```javascript
{
  user: {
       // Is null, so doesn't match $ne: null
    status: "active",
    email: "user@company.com"
  }
}
```

**Important Limitation:** The `$ne` operator in ALOMA only works with `null` values. It cannot be used to check if a field is not equal to other values like strings, numbers, or booleans.

#### Null Matching

```javascript
export const condition = {
  user: {
    lastLogin: null,              // ✅ Matches if field exists AND is null
    age: null                     // ✅ Matches if field exists AND is null
  }
};
```

**Important Behavior:** `{age: null}` matches in TWO scenarios:
1. **Field exists and is null**: `{age: null}` ✅ **MATCHES**
2. **Field doesn't exist**: `{}` ✅ **MATCHES** (age is undefined, which matches null)

**This would match:**
```javascript
{
  user: {
    lastLogin: null,              // Field exists and is null
    age: null                     // Field exists and is null
  }
}
```

**This would ALSO match:**
```javascript
{
  user: {
    lastLogin: null               // Field exists and is null
    // age field doesn't exist (undefined, which matches null)
  }
}
```

**This would NOT match:**
```javascript
{
  user: {
    lastLogin: null,              // Field exists and is null
    age: 25                       // Field exists but is NOT null
  }
}
```

**Key Point:** In ALOMA, `null` matching is actually "null or undefined" matching. This means you can use it to check if a field either doesn't exist OR exists but is null.

### Best Match Selection

When multiple steps have conditions that match the same task data, ALOMA automatically selects the most specific match:

#### Specificity Scoring

```javascript
// Task data
{
  "user": {
    "name": "Sarah Chen",
    "age": 28,
    "role": "admin",
    "department": "engineering",
    "active": true
  }
}

// Step A - Specificity: 1 field matched
export const condition = { 
  user: { name: String } 
};

// Step B - Specificity: 2 fields matched  
export const condition = { 
  user: { name: String, age: Number } 
};

// Step C - Specificity: 4 fields matched - THIS STEP RUNS
export const condition = {
  user: {
    name: String,
    age: Number, 
    role: "admin",
    department: String
  }
};

export const content = async () => {
  console.log('Processing admin user with highest specificity match');
  data.user.adminProcessed = true;
};
```

ALOMA counts matched fields and selects the step with the highest specificity score.

#### Handling Conflicts

When specificity is equal, ALOMA uses step creation order (first created wins):

```javascript
// Both steps have equal specificity (2 fields each)
// First step created
export const condition = {
  order: {
    status: "pending",
    priority: "high"
  }
};

// Second step created - won't run if first step matches
export const condition = {
  order: {
    status: "pending", 
    type: "express"
  }
};
```

**Best practice:** Make conditions as specific as possible to avoid conflicts.

### Common Matching Patterns

#### Sequential Processing

Create data-driven sequences:

```javascript
// Step 1: Initialize processing
export const condition = { 
  stage: "start" 
};

export const content = async () => {
  console.log('Starting processing pipeline');
  data.stage = "processing";
  data.startedAt = new Date().toISOString();
};

// Step 2: Continue processing (runs after step 1)
export const condition = { 
  stage: "processing" 
};

export const content = async () => {
  console.log('Processing data');
  data.stage = "complete";
  data.processedAt = new Date().toISOString();
};

// Step 3: Finalize (runs after step 2)
export const condition = { 
  stage: "complete" 
};

export const content = async () => {
  console.log('Finalizing processing');
  data.stage = "finalized";
  task.complete();
};
```

#### Conditional Branching

Different paths based on data:

```javascript
// Premium customer path
export const condition = { 
  customer: { tier: "premium" },
  order: { status: "new" }
};

export const content = async () => {
  console.log('Processing premium customer order');
  data.order.priority = "high";
  data.order.expeditedShipping = true;
  data.order.processed = true;
};

// Standard customer path
export const condition = { 
  customer: { tier: "standard" },
  order: { status: "new" }
};

export const content = async () => {
  console.log('Processing standard customer order');
  data.order.priority = "normal";
  data.order.standardShipping = true;
  data.order.processed = true;
};
```

#### Aggregation Pattern

Wait for multiple conditions before proceeding:

```javascript
// Final step waits for all prerequisite steps to complete
export const condition = { 
  emailSent: true, 
  smsNotified: true, 
  databaseUpdated: true,
  inventoryChecked: true
};

export const content = async () => {
  console.log('All processing steps complete');
  data.allStepsComplete = true;
  data.completedAt = new Date().toISOString();
  task.complete();
};
```

#### Retry and Recovery Pattern

Handle failures gracefully:

```javascript
// Initial attempt
export const condition = {
  apiCall: { 
    url: String, 
    failed: null
  }
};

export const content = async () => {
  try {
    const result = await connectors.externalApi.call({
      url: data.apiCall.url,
      method: 'POST',
      body: data.apiCall.payload
    });
    
    data.apiCall.success = true;
    data.apiCall.result = result;
    
  } catch (error) {
    data.apiCall.attempts = (data.apiCall.attempts || 0) + 1;
    data.apiCall.lastError = error.message;
    data.apiCall.lastAttempt = new Date().toISOString();

    console.log(`API call failed, attempt ${data.apiCall.attempts}/3: ${error.message}`);
    
    if (data.apiCall.attempts >= 3) {
      data.apiCall.failed = true; //to stop processing this step
      data.apiCall.maxAttemptsReached = true;
    } else {
      step.redo(); // to re process the step
    }
  }
};

// Failure handling step
export const condition = {
  apiCall: {
    failed: true,
    maxAttemptsReached: true
  }
};

export const content = async () => {
  console.log('API call failed after maximum attempts, escalating');
  
  // Send failure notification
  await connectors.slackCom.send({
    channel: "#alerts",
    text: `API call failed after 3 attempts: ${data.apiCall.lastError}`
  });
  
  data.apiCall.escalated = true;
  data.escalatedAt = new Date().toISOString();
};
```

### Best Practices

#### Design Specific Conditions

Create precise conditions that match exactly what you need:

```javascript
// ✅ Good: Specific conditions
export const condition = {
  order: {
    status: "paid",
    customer: { tier: "premium" },
    total: { $ne: null },
    shippingMethod: "expedited"
  }
};

// ❌ Avoid: Overly broad conditions
export const condition = {
  order: Object  // Matches any order, inefficient and unpredictable
};
```

#### Use Clear Data Markers

Set clear boolean flags to control step execution:

```javascript
// ✅ Good: Clear boolean flags for step coordination
export const content = async () => {
  // Validate customer data
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email);
  
  if (emailValid) {
    data.customer.emailValidated = true;
    data.customer.validatedAt = new Date().toISOString();
  } else {
    data.customer.emailValidationFailed = true;
    data.customer.errors = data.customer.errors || [];
    data.customer.errors.push('Invalid email format');
  }
};

// Next step clearly depends on validation results
export const condition = {
  customer: { emailValidated: true }
};
```

#### Handle Edge Cases

Always account for unexpected data states:

```javascript
export const condition = {
  order: {
    items: Array,
    customer: { validated: true }
  }
};

export const content = async () => {
  // Handle empty cart edge case
  if (!data.order.items || data.order.items.length === 0) {
    console.log('Order has no items, marking as empty cart');
    data.order.status = "empty_cart";
    data.order.requiresUserAction = true;
    return;
  }
  
  // Handle missing item data
  const validItems = data.order.items.filter(item => 
    item.sku && item.quantity > 0 && item.price > 0
  );
  
  if (validItems.length !== data.order.items.length) {
    console.log('Some items have invalid data, requiring review');
    data.order.requiresReview = true;
    data.order.invalidItems = data.order.items.filter(item => 
      !item.sku || item.quantity <= 0 || item.price <= 0
    );
  }
  
  // Normal processing for valid orders
  data.order.status = "processing";
  data.order.validatedAt = new Date().toISOString();
};
```

#### Use Consistent Naming Conventions

Adopt clear patterns for data field names:

```javascript
// ✅ Consistent pattern: [action] + [entity] + [status]
export const content = async () => {
  data.customer.emailValidated = true;
  data.payment.creditCardProcessed = true;
  data.inventory.stockChecked = true;
  data.shipping.labelPrinted = true;
  data.notification.emailSent = true;
  
  // Timestamp patterns: [action] + [entity] + At
  data.customer.validatedAt = new Date().toISOString();
  data.payment.processedAt = new Date().toISOString();
  data.shipping.shippedAt = new Date().toISOString();
};
```

### Debugging Step Matching

#### Understanding Why Steps Don't Match

Use debugging techniques and CLI tools to understand matching behavior:

```bash
# List all steps to see available conditions
aloma step list

# View specific step details and conditions
aloma step show <step-id>

# Monitor task execution to see which steps match
aloma task log <task-id> --logs --changes

# Clone a step to test different conditions
aloma step clone <step-id>
```

Debug step matching in your code:

```javascript
export const content = async () => {
  // Debug current data structure
  console.log('=== STEP DEBUG INFO ===');
  console.log('Full data structure:', JSON.stringify(data, null, 2));
  
  // Check specific fields your conditions depend on
  console.log('Customer exists:', !!data.customer);
  console.log('Customer email:', data.customer?.email);
  console.log('Order status:', data.order?.status);
  console.log('Payment processed:', data.payment?.processed);
  
  // Check data types
  console.log('Order total type:', typeof data.order?.total);
  console.log('Items is array:', Array.isArray(data.order?.items));
  
  console.log('=== END DEBUG INFO ===');
  
  // Your actual step logic here
  data.debugChecked = true;
};
```

#### Common Matching Issues

Watch out for these frequent problems:

1. **Typos in field names**: `data.customer.emai` vs `data.customer.email`
2. **Type mismatches**: Expecting `Number` but getting `String`
3. **Missing nested objects**: Condition expects `customer.address.zip` but `address` is undefined
4. **Array structure mismatches**: Expecting array of objects but getting array of strings
5. **Null vs undefined**: Field exists but is `null` vs field doesn't exist
6. **Case sensitivity**: `"Premium"` vs `"premium"`

#### Using Task Visualization

Visualize task data to understand structure:

```javascript
export const content = async () => {
  // Visualize current data state for debugging
  task.visualize({
    type: 'data',
    name: 'Current Task State',
    data: data
  });
  
  // Visualize specific nested objects
  if (data.customer) {
    task.visualize({
      type: 'data',
      name: 'Customer Data',
      data: data.customer
    });
  }
  
  // Your processing logic
  console.log('Processing step with current data state');
};
```

Conditional step matching is ALOMA's superpower - enabling intelligent, adaptive automations that respond to data patterns rather than rigid sequences. Master these patterns to build workflows that scale elegantly and adapt automatically to changing requirements.

### What is NOT Supported

**Important:** ALOMA does NOT support the following advanced operators that are commonly found in other systems:

```javascript
// ❌ These operators are NOT supported:
export const condition = {
  infrastructure: {
    cpuUsage: { $gt: 80 },        // No $gt (greater than)
    memoryUsage: { $lt: 90 },     // No $lt (less than)
    status: { $in: ["running", "starting"] },  // No $in
    priority: { $gte: "medium" }  // No $gte (greater than or equal)
  }
};
```

**Workaround for comparison logic (when operators aren't available):**
```javascript
export const condition = {
  infrastructure: {
    cpuUsage: Number,        // Must be a number
    memoryUsage: Number,     // Must be a number
    status: String           // Must be a string
  }
};

export const content = async () => {
  // Do the comparison logic here
  if (data.infrastructure.cpuUsage > 80 && 
      data.infrastructure.memoryUsage < 90) {
    
    // Send alert
    data.infrastructure.alertSent = true;
    data.infrastructure.alertSentAt = new Date().toISOString();
    
    // Trigger next step
    data.highResourceUsage = true;
  }
};
```

### Summary

ALOMA's conditional step matching system provides:

**✅ Supported:**
- Exact value matching
- Type-based matching (String, Number, Boolean, Array, Object)
- Nested object structure matching
- Array content and structure matching
- RegExp pattern matching
- Null/undefined handling
- Not equal operator ($ne) - **ONLY with null values**
- Sequential step execution

**❌ Not Supported:**
- Comparison operators ($gt, $lt, $gte, $lte)
- Logical operators ($or, $and, $not)
- Set operators ($in, $nin)
- Greater/less than comparisons
- $ne with non-null values (strings, numbers, booleans)

**Current Behavior:**
- All matching steps execute (not just the "best" match)
- Execution order is sequential based on array order
- Data changes from one step are available to subsequent steps

**Testing Results:**
Based on actual testing with task data `{Test: 3}`:
- `{Test: {$ne: null}}` ✅ **WORKS** - matches when Test field exists and is not null
- `{age: null}` ✅ **WORKS** - matches when age field exists AND is null, OR when age field doesn't exist
- `{status: {$ne: 'created'}}` ❌ **DOES NOT WORK** - $ne only works with null values

**Important Discovery:** `{age: null}` is actually "null or undefined" matching - it will match both cases where the field is missing and where it exists but is null.

**Key Limitation Discovered:**
The `$ne` operator in ALOMA has a significant limitation - it only works with `null` values. It cannot be used to check if a field is not equal to other values like strings, numbers, or booleans.

Conditional step matching is ALOMA's core strength - enabling intelligent, adaptive automations that respond to data patterns rather than rigid sequences. While the current system prioritizes completeness over precision, it provides a solid foundation for building dynamic workflows that can be extended with custom logic in step content.
