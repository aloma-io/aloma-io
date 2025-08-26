# Step writing best practices

## ALOMA Step Development Best Practices

**The definitive guide to architecting maintainable, reusable, and adaptable automations using ALOMA's conditional execution model.**

_Based on analysis of production ALOMA implementations and optimization patterns from enterprise deployments._

### Philosophy: Think Data State, Not Workflow Sequence

ALOMA's fundamental strength lies in conditional execution driven by data state rather than predefined sequences. Successful ALOMA architectures embrace this paradigm shift completely.

**Important:** ALOMA's conditional step matching has specific limitations. It supports:
- Exact value matching
- Type-based matching (String, Number, Boolean, Array, Object)
- Nested object structure matching
- Array content and structure matching
- RegExp pattern matching
- Null/undefined handling
- Not equal operator ($ne) - **ONLY with null values**

**Not supported:**
- Comparison operators ($gt, $lt, $gte, $lte)
- Logical operators ($or, $and, $not)
- Set operators ($in, $nin)
- $ne with non-null values

When you need comparison logic, implement it in the step content rather than in the condition.

**Traditional Mindset:**

```
"First do A, then do B, then do C"
```

**ALOMA Mindset:**

```
"When data looks like X, do Y"
"When conditions Z are met, execute W"
```

This mental shift is crucial for designing steps that are maintainable, reusable, and naturally adaptive.

***

### 1. Condition Design Principles

#### 1.1 Design Precise, Specific Conditions

**✅ Good: Specific conditions that match exact requirements**

```javascript
export const condition = {
  order: {
    status: "payment_confirmed",
    customer: { tier: "enterprise" },
    total: Number,
    items: Array
  }
};
```

**❌ Avoid: Overly broad conditions that match too many scenarios**

```javascript
export const condition = {
  order: Object  // Matches any order, unpredictable behavior
};
```

#### 1.2 Use Data State Markers, Not Time-Based Logic

**✅ Good: Data-driven progression**

```javascript
// Step sets clear completion marker
export const content = async () => {
  await processPayment();
  data.paymentProcessed = true;
  data.paymentProcessedAt = new Date().toISOString();
};

// Next step waits for data state
export const condition = {
  paymentProcessed: true,
  fulfillmentReady: null
};
```

**❌ Avoid: Time-based dependencies**

```javascript
// Fragile - assumes timing
export const content = async () => {
  await sleep(5000); // Wait 5 seconds
  // Assume previous step completed
};
```

#### 1.3 Design for Data Evolution

Structure conditions to naturally evolve with your data:

```javascript
// Initial processing
export const condition = {
  customer: {
    email: String,
    validated: null
  }
};

// After validation
export const condition = {
  customer: {
    validated: true,
    tier: String,
    accountCreated: null
  }
};

// After account creation
export const condition = {
  customer: {
    accountCreated: true,
    welcomeEmailSent: null
  }
};
```

***

### 2. Step Architecture Patterns

#### 2.1 Single Responsibility Principle

Each step should handle one specific business concern:

**✅ Good: Focused responsibility**

```javascript
// Email validation step
export const condition = {
  user: {
    email: String,
    emailValidated: null
  }
};

export const content = async () => {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user.email);
  
  data.user.emailValidated = emailValid;
  data.user.emailValidatedAt = new Date().toISOString();
  
  if (!emailValid) {
    data.user.validationErrors = data.user.validationErrors || [];
    data.user.validationErrors.push('Invalid email format');
  }
};
```

**❌ Avoid: Multiple responsibilities in one step**

```javascript
// Bad: Does validation, account creation, AND email sending
export const content = async () => {
  // Validate email
  const emailValid = validateEmail(data.user.email);
  
  // Create account
  const account = await createAccount(data.user);
  
  // Send welcome email
  await sendWelcomeEmail(data.user.email);
  
  // Too many responsibilities!
};
```

#### 2.2 Parallel-First Design

Design steps to run in parallel whenever possible:

```javascript
// These three steps can run simultaneously
// Customer validation
export const condition = {
  order: { customer: Object },
  customerValidated: null
};

// Inventory check
export const condition = {
  order: { items: Array },
  inventoryChecked: null
};

// Fraud detection
export const condition = {
  order: { total: Number },
  fraudChecked: null
};

// Coordination step waits for all three
export const condition = {
  customerValidated: true,
  inventoryChecked: true,
  fraudChecked: true,
  readyToProcess: null
};
```

#### 2.3 Error Isolation Pattern

Design steps so errors don't cascade:

```javascript
// Main processing step
export const condition = {
  order: {
    validated: true,
    paymentProcessed: null
  }
};

export const content = async () => {
  try {
    const result = await processPayment(data.order);
    data.order.paymentProcessed = true;
    data.order.transactionId = result.id;
  } catch (error) {
    console.error('Payment processing failed:', error.message);
    data.order.paymentError = error.message;
    data.order.paymentProcessed = false;
    data.order.requiresManualReview = true;
    // Don't re-throw - let other processes continue
  }
};

// Error handling step (runs independently)
export const condition = {
  order: {
    paymentError: String,
    errorHandled: null
  }
};

export const content = async () => {
  // Handle payment error without affecting other processes
  await notifyCustomerService(data.order.paymentError);
  data.order.errorHandled = true;
};
```

***

### 3. Data Structure Best Practices

#### 3.1 Hierarchical Data Organization

Structure data logically for easy step matching:

```javascript
// ✅ Good: Logical hierarchy
{
  "customer": {
    "profile": {
      "email": "user@example.com",
      "tier": "enterprise"
    },
    "validation": {
      "emailVerified": true,
      "phoneVerified": false,
      "completedAt": "2025-08-18T10:30:00Z"
    },
    "preferences": {
      "newsletter": true,
      "smsAlerts": false
    }
  },
  "order": {
    "details": {
      "total": 1250.00,
      "currency": "USD"
    },
    "processing": {
      "stage": "payment_confirmed",
      "startedAt": "2025-08-18T10:32:00Z"
    },
    "fulfillment": {
      "warehouse": "TX-MAIN",
      "priority": "high"
    }
  }
}
```

#### 3.2 Progressive Data Enrichment

Build data incrementally through step execution:

```javascript
// Initial minimal data
{
  "lead": {
    "email": "prospect@company.com",
    "source": "website"
  }
}

// After enrichment step
{
  "lead": {
    "email": "prospect@company.com",
    "source": "website",
    "company": {
      "name": "TechCorp Inc",
      "industry": "Software",
      "size": "50-100 employees"
    },
    "score": 85,
    "enrichedAt": "2025-08-18T10:35:00Z"
  }
}

// After qualification step
{
  "lead": {
    "email": "prospect@company.com",
    "source": "website",
    "company": { ... },
    "score": 85,
    "enrichedAt": "2025-08-18T10:35:00Z",
    "qualification": {
      "status": "qualified",
      "reason": "high_score_enterprise_prospect",
      "assignedTo": "senior_sales_rep",
      "qualifiedAt": "2025-08-18T10:37:00Z"
    }
  }
}
```

#### 3.3 Boolean Flags for Control Flow

Use clear boolean flags to control step execution:

```javascript
// ✅ Good: Clear boolean progression
export const content = async () => {
  // Perform validation
  const isValid = validateData(data.customer);
  
  data.customer.validated = isValid;
  data.customer.validatedAt = new Date().toISOString();
  
  if (isValid) {
    data.customer.readyForProcessing = true;
  } else {
    data.customer.requiresManualReview = true;
  }
};
```

***

### 4. Error Handling Architecture

#### 4.1 Graceful Degradation Pattern

Design for graceful failure that doesn't stop other processes:

```javascript
export const condition = {
  customer: {
    validated: true,
    notificationSent: null
  }
};

export const content = async () => {
  try {
    // Try primary notification method
    await connectors.email.send({
      to: data.customer.email,
      subject: "Welcome aboard!"
    });
    data.customer.notificationSent = true;
    data.customer.notificationMethod = "email";
    
  } catch (emailError) {
    console.error('Email failed:', emailError.message);
    
    try {
      // Fallback to SMS
      await connectors.sms.send({
        to: data.customer.phone,
        message: "Welcome! Check your email for details."
      });
      data.customer.notificationSent = true;
      data.customer.notificationMethod = "sms";
      
    } catch (smsError) {
      console.error('SMS also failed:', smsError.message);
      data.customer.notificationSent = false;
      data.customer.notificationError = `Email: ${emailError.message}, SMS: ${smsError.message}`;
      data.customer.requiresManualNotification = true;
    }
  }
};
```

#### 4.2 Error Context Preservation

Preserve rich error context for debugging and recovery:

```javascript
export const content = async () => {
  try {
    const result = await complexOperation();
    data.operationResult = result;
    data.operationSuccessful = true;
    
  } catch (error) {
    // Preserve rich error context
    data.operationError = {
      message: error.message,
      type: error.constructor.name,
      timestamp: new Date().toISOString(),
      step: 'complex_operation',
      inputData: {
        customerType: data.customer.type,
        orderValue: data.order.total,
        processingMode: data.processing.mode
      },
      stackTrace: error.stack,
      attemptCount: (data.operationAttempts || 0) + 1
    };
    
    data.operationSuccessful = false;
    data.operationAttempts = (data.operationAttempts || 0) + 1;
  }
};
```

#### 4.3 Retry Logic with Exponential Backoff

Implement intelligent retry patterns:

```javascript
export const condition = {
  apiCall: {
    url: String,
    maxRetries: Number,
    maxRetriesReached: null,
    lastFailure: String
  }
};

export const content = async () => {
  const attempt = (data.apiCall.attempts || 0) + 1;
  const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30s
  
  // Wait before retry
  if (attempt > 1) {
    console.log(`Retrying API call (attempt ${attempt}) after ${backoffMs}ms backoff`);
    await new Promise(resolve => setTimeout(resolve, backoffMs));
  }
  
  try {
    const result = await connectors.api.call(data.apiCall);
    
    data.apiCall.successful = true;
    data.apiCall.result = result;
    data.apiCall.completedAt = new Date().toISOString();
    
  } catch (error) {
    data.apiCall.attempts = attempt;
    data.apiCall.lastFailure = {
      message: error.message,
      timestamp: new Date().toISOString(),
      attempt: attempt
    };
    
    if (attempt >= (data.apiCall.maxRetries || 3)) {
      data.apiCall.failed = true;
      data.apiCall.maxRetriesReached = true;
    }
  }
};
```

***

### 5. Reusability Patterns

#### 5.1 Library-First Development

Extract common functionality into libraries:

```javascript
// In library: validationUtils
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    normalized: email.toLowerCase().trim()
  };
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return {
    isValid: cleaned.length >= 10,
    normalized: cleaned,
    formatted: formatPhoneNumber(cleaned)
  };
};

module.exports = { validateEmail, validatePhone };

// In steps: Use library functions
export const content = async () => {
  const emailResult = lib.validationUtils.validateEmail(data.customer.email);
  const phoneResult = lib.validationUtils.validatePhone(data.customer.phone);
  
  data.customer.emailValid = emailResult.isValid;
  data.customer.email = emailResult.normalized;
  
  data.customer.phoneValid = phoneResult.isValid;
  data.customer.phone = phoneResult.normalized;
  
  data.customer.validated = emailResult.isValid && phoneResult.isValid;
};
```

#### 5.2 Parameterized Step Templates

Design steps that work across different contexts:

```javascript
// Generic approval step template
export const condition = {
  approval: {
    type: String,
    amount: Number,
    status: "pending"
  }
};

export const content = async () => {
  const approvalConfig = {
    "expense": { threshold: 1000, approver: "manager" },
    "purchase": { threshold: 5000, approver: "finance" },
    "contract": { threshold: 10000, approver: "legal" }
  };
  
  const config = approvalConfig[data.approval.type];
  
  if (data.approval.amount > config.threshold) {
    await connectors.slack.send({
      channel: `#${config.approver}-approvals`,
      text: `${data.approval.type} approval needed: $${data.approval.amount}`
    });
    data.approval.escalated = true;
  } else {
    data.approval.status = "auto_approved";
    data.approval.autoApproved = true;
  }
};
```

#### 5.3 Composable Data Patterns

Design data structures that work across multiple workflows:

```javascript
// Standard contact enrichment pattern
const enrichContactData = async (contact) => {
  return {
    ...contact,
    enrichment: {
      company: await lookupCompany(contact.email),
      social: await lookupSocialProfiles(contact.email),
      score: await calculateLeadScore(contact),
      enrichedAt: new Date().toISOString()
    }
  };
};

// Reusable across sales, marketing, support workflows
export const condition = {
  contact: {
    email: String,
    enriched: null
  }
};

export const content = async () => {
  data.contact = await enrichContactData(data.contact);
  data.contact.enriched = true;
};
```

***

### 6. Performance Optimization

#### 6.1 Efficient Condition Matching

Structure conditions for optimal matching performance:

```javascript
// ✅ Good: Most specific conditions first
export const condition = {
  order: {
    status: "pending",           // Specific value match
    total: Number,              // Numeric type check
    customer: {                 // Nested object check
      tier: "enterprise",
      verified: true
    },
    items: Array               // Type check last
  }
};

// ❌ Avoid: Expensive operations in conditions
export const condition = {
  complexCalculation: { $ne: null },  // Better to calculate in previous step
  order: Object                           // Too broad, matches everything
};
```

#### 6.2 Batch Processing Patterns

Handle multiple items efficiently:

```javascript
export const condition = {
  orders: Array,
  batchProcessed: null
};

export const content = async () => {
  const batchSize = 10;
  const batches = [];
  
  // Split into batches
  for (let i = 0; i < data.orders.length; i += batchSize) {
    batches.push(data.orders.slice(i, i + batchSize));
  }
  
  // Process batches in parallel
  const batchPromises = batches.map(async (batch, index) => {
    console.log(`Processing batch ${index + 1}/${batches.length}`);
    
    const batchResults = await Promise.all(
      batch.map(order => processOrder(order))
    );
    
    return batchResults;
  });
  
  const allResults = await Promise.all(batchPromises);
  
  data.orderResults = allResults.flat();
  data.batchProcessed = true;
  data.processedCount = data.orders.length;
};
```

#### 6.3 Resource Management

Optimize connector usage and external API calls:

```javascript
export const content = async () => {
  // Cache frequently accessed data
  if (!data.customerCache) {
    data.customerCache = await connectors.crm.getCustomer(data.customerId);
  }
  
  // Batch API calls when possible
  const updates = data.orders.map(order => ({
    id: order.id,
    status: order.newStatus
  }));
  
  // Single batch update instead of individual calls
  await connectors.crm.batchUpdateOrders(updates);
  
  // Use connection pooling for multiple calls
  const inventoryPromises = data.items.map(item => 
    connectors.inventory.checkStock(item.sku)
  );
  
  const inventoryResults = await Promise.all(inventoryPromises);
  data.inventoryResults = inventoryResults;
};
```

***

### 7. Testing and Validation Strategies

#### 7.1 Self-Validating Steps

Build validation into your steps:

```javascript
export const content = async () => {
  // Validate input data
  if (!data.customer?.email) {
    throw new Error('Customer email is required for processing');
  }
  
  if (!data.order?.items?.length) {
    throw new Error('Order must contain at least one item');
  }
  
  // Perform processing
  const result = await processCustomerOrder(data.customer, data.order);
  
  // Validate output
  if (!result.success) {
    throw new Error(`Processing failed: ${result.error}`);
  }
  
  if (!result.orderId) {
    throw new Error('Processing completed but no order ID returned');
  }
  
  // Store validated results
  data.processingResult = result;
  data.orderProcessed = true;
};
```

#### 7.2 Test Data Patterns

Design steps to work with test data:

```javascript
export const content = async () => {
  // Check for test mode
  const isTestMode = data.environment === 'test' || data.testMode === true;
  
  if (isTestMode) {
    console.log('Running in test mode');
    
    // Use test endpoints and mock data
    data.paymentResult = {
      success: true,
      transactionId: 'test_txn_' + Math.random().toString(36).substr(2, 9),
      amount: data.order.total,
      testMode: true
    };
  } else {
    // Real payment processing
    data.paymentResult = await connectors.stripe.charge({
      amount: data.order.total,
      source: data.payment.token
    });
  }
  
  data.paymentProcessed = true;
};
```

#### 7.3 Debugging and Observability

Add comprehensive logging and state visualization:

```javascript
export const content = async () => {
  // Log entry state
  console.log('Step starting with data:', {
    customerId: data.customer?.id,
    orderTotal: data.order?.total,
    processingStage: data.processing?.stage,
    timestamp: new Date().toISOString()
  });
  
  // Visualize current state for debugging
  task.visualize({
    type: 'data',
    name: 'Pre-Processing State',
    data: {
      customer: data.customer,
      order: data.order,
      processing: data.processing
    }
  });
  
  try {
    // Main processing logic
    const result = await processData();
    
    // Log success
    console.log('Processing completed successfully:', {
      resultId: result.id,
      processingTime: result.duration,
      itemsProcessed: result.itemCount
    });
    
    // Visualize results
    task.visualize({
      type: 'data',
      name: 'Post-Processing Results',
      data: result
    });
    
    data.processingResult = result;
    data.processingSuccessful = true;
    
  } catch (error) {
    // Log detailed error context
    console.error('Processing failed:', {
      error: error.message,
      stack: error.stack,
      inputData: {
        customerType: data.customer?.type,
        orderValue: data.order?.total,
        itemCount: data.order?.items?.length
      },
      timestamp: new Date().toISOString()
    });
    
    throw error; // Re-throw to trigger error handling
  }
};
```

***

### 8. Maintenance and Evolution Strategies

#### 8.1 Backward Compatibility

Design steps that gracefully handle data evolution:

```javascript
export const condition = {
  customer: {
    email: String,
    processed: null
  }
};

export const content = async () => {
  // Handle legacy data format
  if (data.customer.name && !data.customer.firstName) {
    const nameParts = data.customer.name.split(' ');
    data.customer.firstName = nameParts[0];
    data.customer.lastName = nameParts.slice(1).join(' ');
  }
  
  // Handle new data format additions
  const customerData = {
    email: data.customer.email,
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    // New fields with defaults
    tier: data.customer.tier || 'standard',
    preferences: data.customer.preferences || {},
    // Handle schema evolution
    version: data.customer.version || '1.0'
  };
  
  await processCustomer(customerData);
  data.customer.processed = true;
};
```

#### 8.2 Feature Flags and A/B Testing

Build flexibility into your steps:

```javascript
export const content = async () => {
  // Feature flag for new processing logic
  const useNewAlgorithm = task.config('USE_NEW_ALGORITHM') === 'true';
  
  if (useNewAlgorithm) {
    console.log('Using new algorithm for processing');
    data.processingResult = await newProcessingAlgorithm(data.order);
    data.algorithm = 'v2';
  } else {
    console.log('Using legacy algorithm for processing');
    data.processingResult = await legacyProcessingAlgorithm(data.order);
    data.algorithm = 'v1';
  }
  
  // A/B testing for customer communication
  const testGroup = data.customer.id % 2 === 0 ? 'A' : 'B';
  
  if (testGroup === 'A') {
    data.emailTemplate = 'standard_welcome';
  } else {
    data.emailTemplate = 'personalized_welcome';
  }
  
  data.testGroup = testGroup;
  data.orderProcessed = true;
};
```

#### 8.3 Monitoring and Metrics

Build observability into your automations:

```javascript
export const content = async () => {
  const startTime = Date.now();
  
  try {
    // Main processing
    const result = await performOperation();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Record success metrics
    data.metrics = {
      duration: duration,
      success: true,
      itemsProcessed: result.count,
      throughput: result.count / (duration / 1000), // items per second
      timestamp: new Date().toISOString()
    };
    
    // Performance warning
    if (duration > 10000) { // 10 seconds
      console.warn(`Operation took ${duration}ms, which is longer than expected`);
    }
    
    data.operationComplete = true;
    
  } catch (error) {
    const endTime = Date.now();
    
    // Record failure metrics
    data.metrics = {
      duration: endTime - startTime,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    throw error;
  }
};
```

***

### 9. Security and Compliance

#### 9.1 Secure Data Handling

Use stash for sensitive information:

```javascript
export const content = async () => {
  // Store sensitive data in stash (not visible in UI)
  data.$stash.apiKey = await getApiKey();
  data.$stash.customerSSN = data.customer.ssn;
  data.$stash.paymentToken = data.payment.token;
  
  // Process using stashed data
  const result = await connectors.secure.process({
    apiKey: data.$stash.apiKey,
    customerData: {
      email: data.customer.email,
      // Don't include SSN in regular data
    }
  });
  
  // Remove sensitive data from regular data
  delete data.customer.ssn;
  delete data.payment.token;
  
  data.processingResult = result;
  data.secureProcessingComplete = true;
};
```

#### 9.2 Audit Trail Creation

Maintain comprehensive audit logs:

```javascript
export const content = async () => {
  // Create audit entry
  const auditEntry = {
    action: 'customer_data_update',
    userId: data.user.id,
    timestamp: new Date().toISOString(),
    ipAddress: data.request?.ipAddress,
    userAgent: data.request?.userAgent,
    changes: {
      before: data.customer.originalData,
      after: data.customer.updatedData
    },
    reason: data.updateReason,
    approvedBy: data.approver?.id
  };
  
  // Store audit trail
  await connectors.auditLog.create(auditEntry);
  
  // Process the actual update
  await updateCustomerData();
  
  data.auditTrailCreated = true;
  data.dataUpdated = true;
};
```

***

### 10. Advanced Patterns

#### 10.1 Dynamic Step Generation

Create steps that adapt to data structure:

```javascript
export const condition = {
  dynamicProcessing: {
    workflows: Array,
    currentIndex: Number
  }
};

// Note: Index validation logic should be implemented in step content

export const content = async () => {
  // Validate current index is within bounds
  if (data.dynamicProcessing.currentIndex >= data.dynamicProcessing.workflows.length) {
    data.dynamicProcessing.completed = true;
  } else {
    // Continue with processing logic
    const currentIndex = data.dynamicProcessing.currentIndex;
    const workflow = data.dynamicProcessing.workflows[currentIndex];
    
    console.log(`Processing workflow ${currentIndex + 1}/${data.dynamicProcessing.workflows.length}: ${workflow.name}`);
    
    // Execute workflow-specific logic
    switch (workflow.type) {
      case 'email':
        await connectors.email.send(workflow.config);
        break;
      case 'api_call':
        await connectors.api.call(workflow.config);
        break;
      case 'data_transform':
        data[workflow.outputField] = transformData(data[workflow.inputField], workflow.rules);
        break;
    }
    
    // Move to next workflow
    data.dynamicProcessing.currentIndex = currentIndex + 1;
    
    // Check if all workflows completed
    if (data.dynamicProcessing.currentIndex >= data.dynamicProcessing.workflows.length) {
      data.dynamicProcessing.completed = true;
    }
  }
};
```

#### 10.2 State Machine Pattern

Implement complex state transitions:

```javascript
export const condition = {
  order: {
    state: String,
    stateTransition: null
  }
};

export const content = async () => {
  const currentState = data.order.state;
  const validTransitions = {
    'pending': ['validated', 'cancelled'],
    'validated': ['processing', 'cancelled'],
    'processing': ['completed', 'failed'],
    'failed': ['pending', 'cancelled'],
    'completed': ['refunded'],
    'cancelled': [],
    'refunded': []
  };
  
  // Determine next state based on current conditions
  let nextState;
  
  switch (currentState) {
    case 'pending':
      nextState = data.order.validationPassed ? 'validated' : 'cancelled';
      break;
    case 'validated':
      nextState = data.order.paymentConfirmed ? 'processing' : 'cancelled';
      break;
    case 'processing':
      nextState = data.order.processingError ? 'failed' : 'completed';
      break;
    // ... other transitions
  }
  
  // Validate transition
  if (!validTransitions[currentState].includes(nextState)) {
    throw new Error(`Invalid state transition from ${currentState} to ${nextState}`);
  }
  
  // Execute state transition
  data.order.previousState = currentState;
  data.order.state = nextState;
  data.order.stateChangedAt = new Date().toISOString();
  data.order.stateTransition = true;
  
  console.log(`Order state changed: ${currentState} → ${nextState}`);
};
```

***

### Conclusion: The ALOMA Advantage

Following these best practices transforms your ALOMA automations from simple scripts into robust, enterprise-grade systems that:

* **Scale effortlessly** as your business grows
* **Adapt naturally** to changing requirements
* **Maintain themselves** through clear data-driven logic
* **Debug easily** with rich context and logging
* **Reuse components** across multiple workflows
* **Handle errors gracefully** without cascading failures

The key insight is that ALOMA's conditional execution model isn't just a different way to build workflows—it's a fundamentally superior architecture for business process automation that embraces the chaotic, evolving nature of real business requirements.

**Remember:** Great ALOMA automations are designed around data state evolution, not sequential task execution. Master this principle, and you'll build automations that are not just functional, but truly exceptional.

### Working Around ALOMA's Operator Limitations

Since ALOMA doesn't support comparison operators in conditions, implement the logic in your step content:

```javascript
// ❌ This won't work in ALOMA conditions:
export const condition = {
  order: { total: { $gt: 1000 } }  // $gt not supported
};

// ✅ Instead, do this:
export const condition = {
  order: { total: Number }  // Match any number
};

export const content = async () => {
  // Implement comparison logic here
  if (data.order.total > 1000) {
    data.order.priority = "high";
    data.order.requiresApproval = true;
  } else {
    data.order.priority = "normal";
    data.order.requiresApproval = false;
  }
  
  data.order.processed = true;
};
```

**Common Patterns:**
- Use type matching in conditions (Number, String, Boolean, Array, Object)
- Implement comparison logic in step content
- Set boolean flags to control subsequent step execution
- Use null/undefined matching for optional fields

***

\*This guide represents distilled wisdom from hundreds of production ALOMA implementations. Apply these patterns, and your automations will be maintainable, scalable,
