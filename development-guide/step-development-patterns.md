# Step Development Patterns

## Step Development Patterns

**Master the conditional execution patterns that make ALOMA automations intelligent, maintainable, and scalable. These battle-tested patterns enable you to build complex workflows that adapt to data conditions rather than rigid sequences.**

Step development in ALOMA follows a fundamentally different approach than traditional programming. Instead of writing imperative sequences, you define conditions and responses that create self-organizing workflows. This page covers the essential patterns every ALOMA developer should master.

### Foundation Patterns

#### Sequential Processing

Create ordered step execution through data dependencies:

```javascript
// Step 1: Initialize processing
export const condition = { 
  order: { status: "new" } 
};

export const content = async () => {
  console.log('Starting order processing...');
  data.order.status = "processing";
  data.order.startedAt = new Date().toISOString();
};

// Step 2: Validate order
export const condition = { 
  order: { status: "processing" } 
};

export const content = async () => {
  console.log('Validating order...');
  
  // Validation logic here
  const isValid = data.order.items.length > 0 && data.order.customer.email;
  
  if (isValid) {
    data.order.status = "validated";
    data.order.validatedAt = new Date().toISOString();
  } else {
    data.order.status = "invalid";
    data.order.errors = ["Missing items or customer email"];
  }
};

// Step 3: Process validated order
export const condition = { 
  order: { status: "validated" } 
};

export const content = async () => {
  console.log('Processing validated order...');
  data.order.status = "complete";
  data.order.completedAt = new Date().toISOString();
  
  task.complete();
};
```

#### Parallel Processing

Enable simultaneous execution of independent operations:

```javascript
// Payment processing (runs immediately)
export const condition = {
  order: { 
    status: "new",
    payment: { method: String, amount: Number }
  }
};

export const content = async () => {
  console.log('Processing payment...');
  
  const paymentResult = await connectors.stripe.createPaymentIntent({
    amount: data.order.payment.amount,
    currency: 'usd'
  });
  
  data.order.payment.processed = true;
  data.order.payment.transactionId = paymentResult.id;
};

// Inventory check (runs simultaneously)
export const condition = {
  order: { 
    status: "new",
    items: Array
  }
};

export const content = async () => {
  console.log('Checking inventory...');
  
  for (const item of data.order.items) {
    const available = await connectors.inventory.checkStock({
      sku: item.sku,
      quantity: item.quantity
    });
    
    item.available = available;
  }
  
  data.order.inventory = { checked: true, available: true };
};

// Coordination step (waits for both)
export const condition = {
  order: {
    payment: { processed: true },
    inventory: { checked: true }
  }
};

export const content = async () => {
  console.log('Both payment and inventory complete - fulfilling order');
  data.order.status = "fulfilled";
  data.order.fulfilledAt = new Date().toISOString();
};
```

#### Conditional Branching

Handle different scenarios with specific logic paths:

```javascript
// Premium customer workflow
export const condition = {
  customer: { 
    tier: "premium",
    verified: true
  }
};

export const content = async () => {
  console.log('Processing premium customer...');
  
  data.customer.priority = "high";
  data.customer.supportLevel = "white-glove";
  data.customer.processingTime = "immediate";
  
  // Skip standard approval process
  data.customer.autoApproved = true;
};

// Standard customer workflow
export const condition = {
  customer: { 
    tier: "standard",
    verified: true
  }
};

export const content = async () => {
  console.log('Processing standard customer...');
  
  data.customer.priority = "normal";
  data.customer.supportLevel = "standard";
  
  // Require approval for high-value orders
  if (data.order?.total > 1000) {
    data.customer.requiresApproval = true;
    data.customer.approver = "sales-manager";
  } else {
    data.customer.autoApproved = true;
  }
};

// Enterprise customer workflow
export const condition = {
  customer: { 
    tier: "enterprise",
    verified: true
  }
};

export const content = async () => {
  console.log('Processing enterprise customer...');
  
  data.customer.priority = "urgent";
  data.customer.supportLevel = "dedicated";
  data.customer.accountManager = "enterprise-team";
  
  // Always auto-approve enterprise customers
  data.customer.autoApproved = true;
  
  // Notify account manager
  await connectors.slackCom.send({
    channel: "#enterprise-accounts",
    text: `New enterprise order from ${data.customer.name}: $${data.order.total}`
  });
};
```

### Advanced Patterns

#### Aggregation Pattern

Wait for multiple conditions before proceeding:

```javascript
// Collect multiple verification types
export const condition = {
  verification: {
    email: { status: "verified" },
    phone: { status: "verified" },
    identity: { status: "verified" },
    address: { status: "verified" }
  }
};

export const content = async () => {
  console.log('All verifications complete - activating account');
  
  data.customer.status = "active";
  data.customer.verificationScore = 100;
  data.customer.activatedAt = new Date().toISOString();
  
  // Grant full permissions
  data.customer.permissions = ["read", "write", "transfer", "admin"];
  
  await connectors.eMailSmtpOAuth.sendEmail({
    to: data.customer.email,
    subject: "Account Activated",
    html: `Your account is now fully activated with all features enabled.`
  });
  
  task.complete();
};
```

#### Retry and Recovery Pattern

Handle failures with exponential backoff:

```javascript
// Initial API call attempt
export const condition = {
  apiCall: { 
    url: String,
    failed: null
  }
};

export const content = async () => {
  try {
    console.log(`API call attempt ${(data.apiCall.attempts || 0) + 1}`);
    
    const result = await connectors.externalApi.request({
      url: data.apiCall.url,
      options: data.apiCall.options
    });
    
    data.apiCall.success = true;
    data.apiCall.result = result;
    data.apiCall.completedAt = new Date().toISOString();
    
  } catch (error) {
    data.apiCall.attempts = (data.apiCall.attempts || 0) + 1;
    data.apiCall.lastError = error.message;
    data.apiCall.lastAttemptAt = new Date().toISOString();
    
    console.log(`Attempt ${data.apiCall.attempts} failed: ${error.message}`);
    
    // Add exponential backoff delay
    const delayMs = Math.pow(2, data.apiCall.attempts) * 1000;
    data.apiCall.retryAfter = new Date(Date.now() + delayMs).toISOString();
    
    // Mark for retry if under limit
    if (data.apiCall.attempts < 3) {
      console.log(`Will retry in ${delayMs}ms`);
      task.park(delayMs)
      step.redo()
    } else {
      console.log('Max attempts reached - marking as failed');
      data.apiCall.failed = true;
    }
  }
};

// Handle final failure
export const condition = {
  apiCall: {
    failed: true,
  }
};

export const content = async () => {
  console.log('API call permanently failed - triggering fallback');
  
  data.apiCall.status = "permanently_failed";
  data.fallback = { required: true, reason: "api_unavailable" };
  
  // Notify operations team
  await connectors.slackCom.send({
    channel: "#alerts",
    text: `🚨 API call failed permanently: ${data.apiCall.url}\nError: ${data.apiCall.lastError}`
  });
};
```

#### Dynamic Workflow Selection

Route tasks to different workflows based on data characteristics:

```javascript
// High-value B2B order approval workflow
export const condition = {
  order: {
    type: "B2B",
    highValue: true, // eg total > 10000 
    customer: { verified: true }
  }
};

export const content = async () => {
  console.log('High-value B2B order detected - approval workflow');
  
  data.order.workflow = "high_value_approval";
  data.order.requiresApproval = true;
  data.order.approver = "sales-director";
  data.order.priority = "high";
  
  // Notify approver immediately
  await connectors.slackCom.send({
    channel: "#approvals",
    text: `🔔 High-value B2B order requires approval: $${data.order.total.toLocaleString()}\nCustomer: ${data.customer.name}\nApprove: ${data.order.approvalLink}`
  });
  
  // Set approval deadline
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 4);
  data.order.approvalDeadline = deadline.toISOString();
};

// Standard B2C auto-approval workflow
export const condition = {
  order: {
    type: "B2C",
    highValue: false, // eg total < 10000 
    customer: { verified: true }
  }
};

export const content = async () => {
  console.log('Standard B2C order - auto-approval');
  
  data.order.workflow = "auto_approval";
  data.order.approved = true;
  data.order.approvedBy = "system";
  data.order.approvedAt = new Date().toISOString();
  data.order.priority = "normal";
};

// Suspicious order security workflow
export const condition = {
  order: {
    customer: { riskScore: { $gt: 70 } }
  }
};

export const content = async () => {
  console.log('High-risk order detected - security review');
  
  data.order.workflow = "security_review";
  data.order.requiresSecurityReview = true;
  data.order.reviewer = "security-team";
  data.order.priority = "urgent";
  data.order.frozen = true;
  
  // Immediate security notification
  await connectors.slackCom.send({
    channel: "#security",
    text: `🚨 High-risk order flagged for review\nRisk Score: ${data.order.customer.riskScore}\nOrder: ${data.order.id}\nAction required immediately`
  });
};
```

### Data Management Patterns

#### Progressive Data Enrichment

Build rich data sets through incremental steps:

```javascript
// Basic customer data validation
export const condition = {
  customer: {
    email: String,
    name: String
  }
};

export const content = async () => {
  console.log('Enriching customer data...');
  
  // Validate email format
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer.email);
  data.customer.emailValid = emailValid;
  
  // Extract domain for company lookup
  if (emailValid) {
    data.customer.emailDomain = data.customer.email.split('@')[1];
    data.customer.enrichmentReady = true;
  }
};

// Company enrichment
export const condition = {
  customer: {
    emailDomain: String,
    enrichmentReady: true
  }
};

export const content = async () => {
  console.log('Looking up company information...');
  
  try {
    const companyData = await connectors.clearbit.companyLookup({
      domain: data.customer.emailDomain
    });
    
    data.customer.company = {
      name: companyData.name,
      industry: companyData.category.industry,
      size: companyData.metrics.employees,
      revenue: companyData.metrics.annualRevenue,
      enriched: true
    };
    
  } catch (error) {
    console.log('Company lookup failed, using defaults');
    data.customer.company = {
      name: data.customer.emailDomain,
      enriched: false,
      error: error.message
    };
  }
  
  data.customer.scoringReady = true;
};

// Lead scoring
export const condition = {
  customer: {
    company: { enriched: Boolean },
    scoringReady: true
  }
};

export const content = async () => {
  console.log('Calculating lead score...');
  
  let score = 0;
  
  // Email domain scoring
  if (data.customer.emailValid) score += 20;
  
  // Company size scoring
  if (data.customer.company.enriched) {
    const employees = data.customer.company.size || 0;
    if (employees > 1000) score += 30;
    else if (employees > 100) score += 20;
    else if (employees > 10) score += 10;
  }
  
  // Industry scoring
  const highValueIndustries = ['technology', 'finance', 'healthcare'];
  if (highValueIndustries.includes(data.customer.company.industry)) {
    score += 25;
  }
  
  data.customer.leadScore = score;
  data.customer.tier = score > 70 ? 'premium' : score > 40 ? 'standard' : 'basic';
  data.customer.processed = true;
  
  console.log(`Customer scored: ${score} (${data.customer.tier})`);
};
```

#### Bulk Processing Pattern

Handle large datasets efficiently with batching:

```javascript
// Initialize batch processing
export const condition = {
  companies: Array,
  processAll: true
};

export const content = async () => {
  console.log(`Starting batch processing for ${data.companies.length} companies`);
  
  data.batch = {
    size: 5,
    index: 0,
    total: data.companies.length,
    processed: 0
  };
  
  data.processing = { stage: "batch_ready" };
};

// Process batch
export const condition = {
  processing: { stage: "batch_ready" },
  batch: { index: { $lt: data.companies?.length || 0 } }
};

export const content = async () => {
  const { index, size } = data.batch;
  const batch = data.companies.slice(index, index + size);
  
  console.log(`Processing batch ${Math.floor(index / size) + 1}: companies ${index + 1}-${index + batch.length}`);
  
  // Create subtasks for parallel processing
  for (let i = 0; i < batch.length; i++) {
    const company = batch[i];
    const taskName = `Research: ${company.name}`;
    const taskData = {
      company: company,
      research: { type: "company_analysis" }
    };
    
    task.subtask(taskName, taskData, {
      into: `companies.${index + i}.research`,
      waitFor: true
    });
  }
  
  // Update batch tracking
  data.batch.index = index + size;
  data.batch.processed += batch.length;
  
  // Continue or complete
  if (data.batch.index >= data.companies.length) {
    data.processing.stage = "batch_complete";
    console.log('All batches processed');
  } else {
    // Trigger next batch
    step.redo();
  }
};
```

#### Error Recovery and Fallback

Create resilient workflows with graceful degradation:

```javascript
// Primary processing attempt
export const condition = {
  document: {
    type: "invoice",
    content: String
  }
};

export const content = async () => {
  try {
    console.log('Attempting primary document processing...');
    
    const result = await connectors.documentAI.extract({
      content: data.document.content,
      type: "invoice"
    });
    
    data.document.extracted = result;
    data.document.processed = true;
    data.document.method = "ai_extraction";
    
  } catch (error) {
    console.log('Primary processing failed:', error.message);
    
    data.document.primaryError = error.message;
    data.document.fallbackRequired = true;
  }
};

// Fallback processing
export const condition = {
  document: {
    fallbackRequired: true,
    type: "invoice"
  }
};

export const content = async () => {
  try {
    console.log('Attempting fallback OCR processing...');
    
    const ocrResult = await connectors.ocrService.processDocument({
      content: data.document.content
    });
    
    // Parse OCR text with simpler extraction
    const extracted = {
      total: extractTotal(ocrResult.text),
      date: extractDate(ocrResult.text),
      vendor: extractVendor(ocrResult.text)
    };
    
    data.document.extracted = extracted;
    data.document.processed = true;
    data.document.method = "ocr_fallback";
    
  } catch (error) {
    console.log('Fallback processing also failed:', error.message);
    
    data.document.ocrError = error.message;
    data.document.manualReviewRequired = true;
  }
};

// Manual review queue
export const condition = {
  document: {
    manualReviewRequired: true
  }
};

export const content = async () => {
  console.log('Document requires manual review');
  
  data.document.status = "manual_review";
  data.document.assignedTo = "document-review-team";
  data.document.priority = "normal";
  
  // Create review task
  await connectors.slackCom.send({
    channel: "#document-review",
    text: `📄 Document requires manual review\nType: ${data.document.type}\nErrors: AI failed, OCR failed\nReview: ${data.document.reviewLink}`
  });
  
  // Track for SLA monitoring
  data.document.reviewRequestedAt = new Date().toISOString();
};
```

### Performance Patterns

#### Conditional Execution Control

Optimize performance by running steps only when necessary:

```javascript
// Only process high-value orders
export const condition = {
  order: {
    highValue: true, // eg total > 10000
    status: "new"
  }
};

export const content = async () => {
  console.log('Processing high-value order...');
  data.order.highValue = true;
  data.order.requiresApproval = true;
};

// Skip processing for small orders
export const condition = {
  order: {
    highValue: false, // eg total <= 100 
    status: "new"
  }
};

export const content = async () => {
  console.log('Auto-approving small order...');
  data.order.approved = true;
  data.order.approvedBy = "system";
  data.order.autoProcessed = true;
};
```

#### Throttling and Rate Limiting

Respect external API limits:

```javascript
// Process with rate limiting
export const condition = {
  apiCalls: Array,
  rateLimited: false
};

export const content = async () => {
  const maxCallsPerMinute = 60;
  const callsThisMinute = data.apiCalls.filter(call => {
    const callTime = new Date(call.timestamp);
    const now = new Date();
    return (now - callTime) < 60000; // Last minute
  }).length;
  
  if (callsThisMinute >= maxCallsPerMinute) {
    console.log('Rate limit reached, throttling...');
    data.rateLimited = true;
    data.nextAllowedCall = new Date(Date.now() + 60000).toISOString();
  } else {
    // Make API call
    const result = await connectors.externalApi.call(data.apiRequest);
    
    // Track the call
    data.apiCalls.push({
      timestamp: new Date().toISOString(),
      result: result
    });

    step.redo()
  }
};
```

### Debugging Patterns

#### Data State Visualization

Understand what's happening in your automation:

```javascript
export const condition = {
  customer: {
    email: String
  }
};

export const content = async () => {
  // Visualize current task state
  task.visualize({
    type: 'data',
    name: 'Customer Processing State',
    data: {
      customer: data.customer,
      processing: data.processing,
      timestamp: new Date().toISOString()
    }
  });
  
  // Debug logging
  console.log('Customer data:', JSON.stringify(data.customer, null, 2));
  console.log('Processing stage:', data.processing?.stage);
  
  // Your processing logic here
  data.customer.debugVisualized = true;
};
```

#### Step Execution Tracking

Monitor step execution patterns:

```javascript
export const condition = {
  order: { status: "new" }
};

export const content = async () => {
  // Track step execution
  data.executionTrace = data.executionTrace || [];
  data.executionTrace.push({
    step: 'order_validation',
    timestamp: new Date().toISOString(),
    data: { orderId: data.order.id, status: data.order.status }
  });
  
  console.log(`Step executed: order_validation`);
  console.log(`Execution trace:`, data.executionTrace);
  
  // Your validation logic
  data.order.status = "validated";
};
```

### Best Practices

#### Design Specific Conditions

Create precise, efficient matching conditions:

```javascript
// ✅ Good: Specific conditions
export const condition = {
  order: {
    status: "paid",
    customer: { tier: "premium" },
    total: { $ne: null }
  }
};

// ❌ Avoid: Overly broad conditions
export const condition = {
  order: Object  // Matches any order, inefficient
};
```

#### Use Clear Data Markers

Establish consistent patterns for step coordination:

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

#### Handle Edge Cases

Anticipate and handle exceptional scenarios:

```javascript
export const condition = {
  order: {
    items: Array,
    customer: { validated: true }
  }
};

export const content = async () => {
  // Handle empty cart
  if (!data.order.items || data.order.items.length === 0) {
    data.order.status = "empty_cart";
    data.order.error = "No items in order";
    return;
  }
  
  // Handle invalid items
  const validItems = data.order.items.filter(item => 
    item.sku && item.quantity > 0 && item.price > 0
  );
  
  if (validItems.length !== data.order.items.length) {
    data.order.status = "invalid_items";
    data.order.validItems = validItems;
    data.order.invalidItems = data.order.items.filter(item => 
      !validItems.includes(item)
    );
    return;
  }
  
  // Normal processing
  data.order.status = "processing";
};
```

#### Consistent Naming Conventions

Adopt patterns that scale across your automation:

```javascript
// ✅ Consistent pattern: [action] + [entity] + [status]
data.customer.validated = true;
data.payment.processed = true;
data.email.sent = true;
data.inventory.checked = true;

// ✅ Consistent timestamps
data.customer.validatedAt = new Date().toISOString();
data.payment.processedAt = new Date().toISOString();
data.email.sentAt = new Date().toISOString();

// ✅ Consistent error handling
data.customer.validationError = "Invalid email format";
data.payment.processingError = "Card declined";
data.email.sendError = "SMTP timeout";
```

These patterns provide the foundation for building sophisticated, maintainable automations in ALOMA. Master these fundamentals and combine them to create intelligent workflows that adapt to your data and scale with your business needs.
