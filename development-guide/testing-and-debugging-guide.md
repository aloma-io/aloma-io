# Testing & Debugging Guide

## Testing & Debugging Guide

### Testing & Debugging Guide

**Master systematic testing and debugging approaches for ALOMA automations. Learn how to validate step logic, troubleshoot conditional execution, and monitor production performance with confidence.**

Testing ALOMA automations requires understanding both traditional software testing principles and the unique aspects of conditional execution. This guide provides comprehensive strategies for validating your automations at every stage from development to production.

***

### Testing Philosophy for Conditional Execution

#### Understanding ALOMA Testing Challenges

Traditional workflow testing assumes linear execution paths, but ALOMA's conditional execution creates dynamic flows based on data state. This requires different testing strategies:

**Traditional Workflow Testing:**

```
Test: Step 1 → Step 2 → Step 3 → End
```

**ALOMA Conditional Testing:**

```
Test: Data State → Multiple Possible Step Combinations → Validate Outcomes
```

#### Core Testing Principles

**1. Data-Driven Test Design** Focus on testing different data states rather than execution sequences:

javascript

```javascript
// Test different data conditions, not step sequences
const testScenarios = [
  { name: "valid_customer", data: { customer: { email: "test@example.com", validated: null } } },
  { name: "invalid_email", data: { customer: { email: "invalid", validated: null } } },
  { name: "already_validated", data: { customer: { email: "test@example.com", validated: true } } }
];
```

**2. Condition Coverage** Ensure every condition pattern is tested:

javascript

```javascript
// Test step with complex condition
export const condition = {
  order: {
    status: "pending",
    customer: { tier: "enterprise" },
    total: Number
  }
};

// Required test scenarios:
// - Enterprise customer with pending order
// - Non-enterprise customer (should not match)
// - Enterprise customer with non-pending order
// - Missing total amount
```

**3. State Evolution Validation** Test how data evolves through step execution:

javascript

```javascript
// Validate state changes
const beforeState = JSON.parse(JSON.stringify(data));
// Execute step logic
const afterState = data;
// Assert expected changes occurred
```

***

### Development Testing Strategies

#### Test Data Management

**Organized Test Data Structure**

Create a systematic approach to test data:

bash

```bash
# Recommended project structure
my-automation/
├── steps/
│   ├── validate_customer.js
│   ├── process_order.js
│   └── send_notification.js
├── tests/
│   ├── data/
│   │   ├── valid_customer.json
│   │   ├── invalid_customer.json
│   │   ├── enterprise_order.json
│   │   └── standard_order.json
│   ├── scenarios/
│   │   ├── customer_onboarding.json
│   │   ├── order_processing.json
│   │   └── error_handling.json
│   └── README.md
└── docs/
```

**Test Data Templates**

Create reusable test data templates:

json

```json
// tests/data/valid_customer.json
{
  "customer": {
    "email": "test.user@example.com",
    "firstName": "Test",
    "lastName": "User",
    "status": "new",
    "tier": "standard"
  },
  "source": "test_data",
  "environment": "test",
  "testMode": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

json

```json
// tests/data/enterprise_order.json
{
  "order": {
    "id": "ORD-TEST-001",
    "status": "pending",
    "total": 5000.00,
    "items": [
      {"sku": "PRD-001", "quantity": 2, "price": 2500.00}
    ],
    "customer": {
      "tier": "enterprise",
      "accountValue": 50000
    }
  },
  "testMode": true,
  "environment": "test"
}
```

#### Unit Testing Individual Steps

**Self-Validating Steps**

Build validation directly into your steps:

javascript

```javascript
// steps/validate_customer.js
export const condition = {
  customer: {
    email: String,
    validated: null
  }
};

export const content = async () => {
  const startTime = Date.now();
  
  try {
    // Input validation
    if (!data.customer?.email) {
      throw new Error('Customer email is required for validation');
    }
    
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
    
    // Output validation
    if (data.customer.validated === null) {
      throw new Error('Validation step completed but validated field not set');
    }
    
    // Add execution metadata for testing
    data.customer.lastProcessedAt = new Date().toISOString();
    data.customer.lastProcessedBy = "validate_customer_step";
    data.customer.executionTime = Date.now() - startTime;
    
    console.log(`Customer validation: ${data.customer.validated ? 'PASS' : 'FAIL'}`);
    
  } catch (error) {
    console.error('Customer validation error:', error.message);
    
    data.customer.validated = false;
    data.customer.validationError = error.message;
    data.customer.lastError = {
      message: error.message,
      timestamp: new Date().toISOString(),
      step: "validate_customer",
      stackTrace: error.stack
    };
    
    // Re-throw for test frameworks to catch
    if (data.testMode) {
      throw error;
    }
  }
};
```

**Test Mode Integration**

Design steps to work with test data:

javascript

```javascript
// steps/process_payment.js
export const condition = {
  order: {
    validated: true,
    paymentProcessed: null
  }
};

export const content = async () => {
  const isTestMode = data.testMode === true || data.environment === 'test';
  
  if (isTestMode) {
    console.log('RUNNING IN TEST MODE');
    
    // Simulate payment processing
    const shouldSucceed = !data.order.testPaymentFailure;
    
    if (shouldSucceed) {
      data.order.paymentResult = {
        success: true,
        transactionId: 'test_txn_' + Math.random().toString(36).substr(2, 9),
        amount: data.order.total,
        testMode: true,
        processedAt: new Date().toISOString()
      };
    } else {
      data.order.paymentResult = {
        success: false,
        error: 'Test payment failure',
        testMode: true,
        failedAt: new Date().toISOString()
      };
    }
    
    data.order.paymentProcessed = shouldSucceed;
    
  } else {
    // Real payment processing
    try {
      const result = await connectors.stripe.charge({
        amount: data.order.total,
        source: data.payment.token,
        metadata: {
          orderId: data.order.id,
          customerId: data.customer.id
        }
      });
      
      data.order.paymentResult = result;
      data.order.paymentProcessed = true;
      
    } catch (error) {
      console.error('Payment processing failed:', error.message);
      
      data.order.paymentResult = {
        success: false,
        error: error.message,
        errorCode: error.code
      };
      data.order.paymentProcessed = false;
      data.order.requiresManualReview = true;
    }
  }
  
  console.log(`Payment processing: ${data.order.paymentProcessed ? 'SUCCESS' : 'FAILED'}`);
};
```

#### Integration Testing

**Test Complete Scenarios**

Test end-to-end automation workflows:

bash

```bash
# Test complete customer onboarding workflow
aloma task new "Complete Customer Onboarding Test" -f tests/scenarios/customer_onboarding.json

# Test order processing with different customer tiers
aloma task new "Enterprise Order Test" -f tests/scenarios/enterprise_order.json
aloma task new "Standard Order Test" -f tests/scenarios/standard_order.json

# Test error scenarios
aloma task new "Invalid Email Test" -d '{
  "customer": {"email": "invalid-email", "status": "new"},
  "testMode": true,
  "expectedError": "Invalid email format"
}'
```

**Multi-Step Coordination Testing**

Test how steps coordinate through data evolution:

json

```json
// tests/scenarios/customer_onboarding.json
{
  "scenario": "complete_customer_onboarding",
  "customer": {
    "email": "integration.test@example.com",
    "firstName": "Integration",
    "lastName": "Test",
    "status": "new",
    "company": "Test Company"
  },
  "expectedSteps": [
    "validate_customer",
    "create_crm_record", 
    "send_welcome_email",
    "complete_onboarding"
  ],
  "expectedDuration": 30000,
  "testMode": true,
  "validateFinalState": {
    "customer.validated": true,
    "customer.crmId": "String",
    "customer.welcomeEmailSent": true,
    "customer.onboardingComplete": true
  }
}
```

***

### CLI Testing Commands

#### Basic Testing Commands

**Task Creation and Monitoring**

bash

```bash
# Create test tasks with data files
aloma task new "Customer Validation Test" -f tests/data/valid_customer.json
aloma task new "Order Processing Test" -f tests/data/enterprise_order.json

# Create test tasks with inline JSON
aloma task new "Error Scenario Test" -d '{
  "customer": {"email": "invalid", "status": "new"},
  "testMode": true
}'

# Monitor task execution
aloma task list --state running
aloma task list --state error
aloma task list --state done | head -10
```

**Task Execution Analysis**

bash

```bash
# View detailed task execution
aloma task log <task-id> --logs --changes
aloma task log <task-id> --verbose

# View specific step execution
aloma task log <task-id> --step 1 --logs
aloma task log <task-id> --step 2 --logs --changes

# Filter tasks by test scenarios
aloma task list | grep "Test"
aloma task list --limit 20 | grep "integration"
```

#### Advanced Debugging Commands

**Step-Level Debugging**

bash

```bash
# View step details
aloma step list
aloma step show <step-id>
aloma step show <step-id> --verbose

# Test step modifications
aloma step edit <step-id>    # Quick edits
aloma step clone <step-id>   # Create test copy

# Validate step conditions
aloma step validate <step-id> -d '{"customer":{"email":"test@example.com"}}'
```

**Performance Analysis**

bash

```bash
# Monitor automation performance
aloma task list --state done --sort executionTime
aloma task list --state error --sort createdAt

# Analyze step performance
aloma step list --sort avgExecutionTime
aloma step performance <step-id>

# Check system health
aloma workspace show
aloma workspace health
```

#### Connector Testing

**Connector Validation**

bash

```bash
# List and verify connectors
aloma connector list
aloma connector show <connector-id>

# Test connector connectivity
aloma connector test <connector-id>
aloma connector logs <connector-id>

# Debug connector issues
aloma connector logs <connector-id> --tail
aloma connector status <connector-id> --verbose
```

***

### Debugging Techniques

#### Data State Visualization

**Task State Inspection**

Understand what's happening in your automation:

javascript

```javascript
// steps/debug_task_state.js
export const condition = {
  debug: true
};

export const content = async () => {
  // Comprehensive state logging
  console.log('=== TASK DEBUG INFO ===');
  console.log('Task ID:', task.id());
  console.log('Task created:', task.createdAt);
  console.log('Current timestamp:', new Date().toISOString());
  console.log('Task source:', data.$via?.type || 'manual');
  
  // Data state visualization
  console.log('=== CURRENT DATA STATE ===');
  console.log(JSON.stringify(data, null, 2));
  
  // Step execution history
  if (data.executionTrace) {
    console.log('=== EXECUTION TRACE ===');
    data.executionTrace.forEach((trace, index) => {
      console.log(`${index + 1}. ${trace.step} at ${trace.timestamp}`);
    });
  }
  
  // Performance metrics
  if (data.performance) {
    console.log('=== PERFORMANCE METRICS ===');
    console.log('Total execution time:', data.performance.totalTime);
    console.log('Step count:', data.performance.stepCount);
    console.log('Average step time:', data.performance.avgStepTime);
  }
  
  console.log('=========================');
  
  // Visual state representation for debugging
  task.visualize({
    type: 'data',
    name: 'Complete Task State',
    data: {
      taskInfo: {
        id: task.id(),
        createdAt: task.createdAt,
        source: data.$via?.type
      },
      currentData: data,
      executionTrace: data.executionTrace || [],
      performance: data.performance || {}
    }
  });
  
  data.debugged = true;
  data.debuggedAt = new Date().toISOString();
};
```

**Step Execution Tracking**

Monitor step execution patterns:

javascript

```javascript
// Add to any step for execution tracking
export const content = async () => {
  // Initialize execution tracking
  data.executionTrace = data.executionTrace || [];
  
  const stepStart = Date.now();
  const stepInfo = {
    step: 'process_order',  // Step identifier
    startTime: new Date().toISOString(),
    inputData: {
      orderId: data.order?.id,
      orderStatus: data.order?.status,
      customerTier: data.customer?.tier
    }
  };
  
  try {
    // Your step logic here
    console.log('Processing with EXISTING logic (stable)');
    data.canaryGroup = "stable_logic";
    
    // Existing logic implementation
    await processWithStableLogic(data);
  }
  
  // Track canary metrics
  data.canaryMetrics = {
    group: data.canaryGroup,
    timestamp: new Date().toISOString(),
    processingTime: Date.now() - startTime
  };
  
  data.canaryProcessed = true;
};
```

**Blue-Green Testing**

bash

```bash
# Test new version in separate workspace
aloma workspace add "Production Blue-Green Test" --tags "test,blue-green"
aloma workspace switch "Production Blue-Green Test"

# Deploy new version
aloma deploy deploy-new-version.yaml

# Run parallel testing
aloma task new "Blue-Green Test" -f tests/production/smoke_test.json

# Compare results with production
aloma task list --state done | grep "Blue-Green"
aloma task log <test-task-id> --logs --changes
```

***

### Advanced Debugging Techniques

#### Real-Time Monitoring

**Live Task Monitoring**

bash

```bash
# Monitor tasks in real-time
watch -n 2 'aloma task list --state running'

# Follow task logs in real-time
aloma task log <task-id> --follow

# Monitor specific automation patterns
watch -n 5 'aloma task list | grep "customer_onboarding"'
```

**Performance Profiling**

javascript

```javascript
// steps/performance_profiler.js
export const condition = {
  profilePerformance: true
};

export const content = async () => {
  const profiler = {
    startTime: Date.now(),
    memoryStart: process.memoryUsage(),
    operations: []
  };
  
  // Profile database operations
  profiler.operations.push(await profileOperation('database_query', async () => {
    return await connectors.postgresql.query('SELECT * FROM customers LIMIT 100');
  }));
  
  // Profile API calls
  profiler.operations.push(await profileOperation('api_call', async () => {
    return await connectors.hubspot.getContacts({ limit: 50 });
  }));
  
  // Profile compute-intensive operations
  profiler.operations.push(await profileOperation('data_processing', async () => {
    return data.customers.map(customer => processCustomerData(customer));
  }));
  
  // Calculate total metrics
  profiler.endTime = Date.now();
  profiler.totalTime = profiler.endTime - profiler.startTime;
  profiler.memoryEnd = process.memoryUsage();
  profiler.memoryDelta = {
    rss: profiler.memoryEnd.rss - profiler.memoryStart.rss,
    heapUsed: profiler.memoryEnd.heapUsed - profiler.memoryStart.heapUsed
  };
  
  // Store profiling results
  data.performanceProfile = profiler;
  
  // Alert on performance issues
  if (profiler.totalTime > 10000) { // 10 seconds
    await alertPerformanceIssue('Slow execution detected', profiler);
  }
  
  console.log('Performance Profile:', JSON.stringify(profiler, null, 2));
  
  data.profilingComplete = true;
};

async function profileOperation(name, operation) {
  const startTime = Date.now();
  const memoryBefore = process.memoryUsage();
  
  try {
    const result = await operation();
    const endTime = Date.now();
    const memoryAfter = process.memoryUsage();
    
    return {
      name,
      duration: endTime - startTime,
      memoryUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
      success: true,
      resultSize: JSON.stringify(result).length
    };
  } catch (error) {
    return {
      name,
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    };
  }
}
```

#### Error Investigation

**Error Pattern Analysis**

javascript

```javascript
// steps/error_analyzer.js
export const condition = {
  analyzeErrors: true
};

export const content = async () => {
  // Collect recent error data
  const recentErrors = await getRecentErrors(24); // Last 24 hours
  
  // Analyze error patterns
  const errorAnalysis = {
    totalErrors: recentErrors.length,
    errorsByType: {},
    errorsByStep: {},
    errorsByConnector: {},
    timeDistribution: {},
    commonPatterns: []
  };
  
  // Categorize errors
  recentErrors.forEach(error => {
    // By error type
    const errorType = categorizeError(error.message);
    errorAnalysis.errorsByType[errorType] = (errorAnalysis.errorsByType[errorType] || 0) + 1;
    
    // By step
    if (error.step) {
      errorAnalysis.errorsByStep[error.step] = (errorAnalysis.errorsByStep[error.step] || 0) + 1;
    }
    
    // By connector
    if (error.connector) {
      errorAnalysis.errorsByConnector[error.connector] = (errorAnalysis.errorsByConnector[error.connector] || 0) + 1;
    }
    
    // By time (hour of day)
    const hour = new Date(error.timestamp).getHours();
    errorAnalysis.timeDistribution[hour] = (errorAnalysis.timeDistribution[hour] || 0) + 1;
  });
  
  // Identify patterns
  errorAnalysis.commonPatterns = identifyErrorPatterns(recentErrors);
  
  // Generate recommendations
  const recommendations = generateErrorRecommendations(errorAnalysis);
  
  // Store analysis results
  data.errorAnalysis = {
    ...errorAnalysis,
    recommendations,
    analyzedAt: new Date().toISOString()
  };
  
  // Alert if error rate is increasing
  if (errorAnalysis.totalErrors > 50) { // Threshold: 50 errors in 24h
    await alertHighErrorRate(errorAnalysis);
  }
  
  console.log('Error Analysis Complete:', JSON.stringify(errorAnalysis, null, 2));
  
  data.errorAnalysisComplete = true;
};

function categorizeError(message) {
  const patterns = {
    'connection': /connection|timeout|network/i,
    'authentication': /auth|token|permission|unauthorized/i,
    'validation': /validation|invalid|required|missing/i,
    'rate_limit': /rate.?limit|throttle|too.?many/i,
    'system': /system|internal|server|500/i
  };
  
  for (const [category, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      return category;
    }
  }
  
  return 'unknown';
}

function identifyErrorPatterns(errors) {
  // Identify recurring error sequences, time-based patterns, etc.
  const patterns = [];
  
  // Example: Connector failures followed by retries
  const connectorFailures = errors.filter(e => e.connector && e.message.includes('failed'));
  if (connectorFailures.length > 5) {
    patterns.push({
      type: 'connector_instability',
      description: 'High connector failure rate detected',
      count: connectorFailures.length,
      recommendation: 'Check connector configuration and external service status'
    });
  }
  
  return patterns;
}
```

#### Memory and Resource Debugging

**Resource Usage Monitoring**

javascript

```javascript
// steps/resource_monitor.js
export const condition = {
  monitorResources: true
};

export const content = async () => {
  const resourceUsage = {
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    cpu: await getCpuUsage(),
    eventLoop: await getEventLoopLag(),
    activeHandles: process._getActiveHandles().length,
    activeRequests: process._getActiveRequests().length
  };
  
  // Memory leak detection
  const memoryThreshold = 500 * 1024 * 1024; // 500MB
  if (resourceUsage.memory.heapUsed > memoryThreshold) {
    console.warn('High memory usage detected:', resourceUsage.memory.heapUsed);
    
    // Trigger memory analysis
    data.memoryWarning = {
      heapUsed: resourceUsage.memory.heapUsed,
      threshold: memoryThreshold,
      timestamp: new Date().toISOString()
    };
  }
  
  // Event loop lag detection
  if (resourceUsage.eventLoop > 100) { // 100ms lag threshold
    console.warn('High event loop lag detected:', resourceUsage.eventLoop);
    
    data.performanceWarning = {
      eventLoopLag: resourceUsage.eventLoop,
      timestamp: new Date().toISOString()
    };
  }
  
  // Store resource metrics
  data.resourceUsage = resourceUsage;
  
  // Historical tracking
  data.resourceHistory = data.resourceHistory || [];
  data.resourceHistory.push(resourceUsage);
  
  // Keep only last 100 measurements
  if (data.resourceHistory.length > 100) {
    data.resourceHistory = data.resourceHistory.slice(-100);
  }
  
  data.resourceMonitoringComplete = true;
};

async function getCpuUsage() {
  const startUsage = process.cpuUsage();
  await new Promise(resolve => setTimeout(resolve, 100));
  const endUsage = process.cpuUsage(startUsage);
  
  return {
    user: endUsage.user / 1000000, // Convert to seconds
    system: endUsage.system / 1000000
  };
}

async function getEventLoopLag() {
  return new Promise(resolve => {
    const start = Date.now();
    setImmediate(() => {
      const lag = Date.now() - start;
      resolve(lag);
    });
  });
}
```

***

### Production Debugging Strategies

#### Live Production Debugging

**Safe Production Testing**

javascript

```javascript
// steps/safe_production_debug.js
export const condition = {
  debugProduction: true,
  safeMode: true
};

export const content = async () => {
  // Only debug if explicitly enabled and in safe mode
  if (!data.safeMode || !data.debugProduction) {
    console.log('Production debugging not enabled');
    return;
  }
  
  // Read-only debugging - no data modification
  const debugInfo = {
    taskId: task.id(),
    workspaceInfo: {
      name: task.workspace(),
      region: task.region()
    },
    dataStructure: getDataStructure(data),
    executionContext: {
      timestamp: new Date().toISOString(),
      source: data.$via?.type,
      userAgent: data.$via?.userAgent
    },
    systemHealth: await getSystemHealth()
  };
  
  // Log debugging information (read-only)
  console.log('Production Debug Info:', JSON.stringify(debugInfo, null, 2));
  
  // Store debug info without modifying business data
  data.$debug = debugInfo;
  
  data.productionDebugComplete = true;
};

function getDataStructure(obj, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return '[Object]';
  
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return typeof obj;
  
  if (Array.isArray(obj)) {
    return `Array(${obj.length})`;
  }
  
  const structure = {};
  for (const [key, value] of Object.entries(obj)) {
    structure[key] = getDataStructure(value, depth + 1, maxDepth);
  }
  
  return structure;
}
```

**Feature Flag Debugging**

javascript

```javascript
// steps/feature_flag_debug.js
export const condition = {
  featureFlags: Object
};

export const content = async () => {
  // Debug feature flag configuration
  const flagAnalysis = {
    activeFlags: [],
    inactiveFlags: [],
    conditionalFlags: [],
    flagConflicts: []
  };
  
  // Analyze each feature flag
  Object.entries(data.featureFlags).forEach(([flagName, flagConfig]) => {
    const analysis = {
      name: flagName,
      enabled: flagConfig.enabled,
      conditions: flagConfig.conditions,
      rolloutPercentage: flagConfig.rolloutPercentage
    };
    
    if (flagConfig.enabled) {
      flagAnalysis.activeFlags.push(analysis);
    } else {
      flagAnalysis.inactiveFlags.push(analysis);
    }
    
    if (flagConfig.conditions) {
      flagAnalysis.conditionalFlags.push(analysis);
    }
  });
  
  // Check for conflicting flags
  flagAnalysis.flagConflicts = detectFlagConflicts(data.featureFlags);
  
  // Log feature flag state
  console.log('Feature Flag Analysis:', JSON.stringify(flagAnalysis, null, 2));
  
  data.featureFlagAnalysis = flagAnalysis;
  data.featureFlagDebugComplete = true;
};

function detectFlagConflicts(flags) {
  const conflicts = [];
  
  // Example: Check for mutually exclusive flags
  const mutuallyExclusive = [
    ['newCheckoutFlow', 'legacyCheckoutFlow'],
    ['betaFeatures', 'stableOnly']
  ];
  
  mutuallyExclusive.forEach(([flag1, flag2]) => {
    if (flags[flag1]?.enabled && flags[flag2]?.enabled) {
      conflicts.push({
        type: 'mutually_exclusive',
        flags: [flag1, flag2],
        description: `${flag1} and ${flag2} should not be enabled simultaneously`
      });
    }
  });
  
  return conflicts;
}
```

#### Emergency Debugging

**Circuit Breaker Implementation**

javascript

```javascript
// steps/circuit_breaker.js
export const condition = {
  criticalOperation: true,
  circuitBreakerEnabled: true
};

export const content = async () => {
  const operationName = data.operation?.name || 'unknown';
  const circuitState = await getCircuitBreakerState(operationName);
  
  // Check circuit breaker state
  if (circuitState.state === 'OPEN') {
    console.warn(`Circuit breaker OPEN for ${operationName}. Skipping operation.`);
    
    data.circuitBreakerTriggered = true;
    data.circuitBreakerReason = circuitState.reason;
    data.fallbackExecuted = await executeFallback(data.operation);
    
    return;
  }
  
  try {
    // Execute critical operation
    const result = await executeCriticalOperation(data.operation);
    
    // Record success
    await recordCircuitBreakerSuccess(operationName);
    
    data.operationResult = result;
    data.operationSuccessful = true;
    
  } catch (error) {
    console.error(`Critical operation failed: ${error.message}`);
    
    // Record failure
    await recordCircuitBreakerFailure(operationName, error);
    
    // Check if circuit should open
    const updatedState = await getCircuitBreakerState(operationName);
    if (updatedState.shouldOpen) {
      console.warn(`Opening circuit breaker for ${operationName}`);
      await openCircuitBreaker(operationName, error.message);
    }
    
    data.operationSuccessful = false;
    data.operationError = error.message;
    data.fallbackExecuted = await executeFallback(data.operation);
  }
  
  data.criticalOperationComplete = true;
};

async function getCircuitBreakerState(operationName) {
  // Implementation would check failure rates, timing, etc.
  return {
    state: 'CLOSED', // OPEN, CLOSED, HALF_OPEN
    failureCount: 0,
    lastFailure: null,
    shouldOpen: false
  };
}
```

***

### Testing Documentation and Best Practices

#### Test Documentation

**Test Case Documentation**

markdown

````markdown
# Test Case: Customer Validation Workflow

## Objective
Verify that customer validation correctly processes valid and invalid email addresses

## Test Data
- Valid customer: `tests/data/valid_customer.json`
- Invalid email: `tests/data/invalid_email_customer.json`
- Missing email: `tests/data/missing_email_customer.json`

## Expected Results
| Scenario | Expected Outcome |
|----------|------------------|
| Valid email | `customer.validated = true` |
| Invalid email | `customer.validated = false`, error logged |
| Missing email | Step throws error, task marked as failed |

## Test Commands
```bash
# Run validation tests
aloma task new "Valid Email Test" -f tests/data/valid_customer.json
aloma task new "Invalid Email Test" -f tests/data/invalid_email_customer.json
aloma task new "Missing Email Test" -f tests/data/missing_email_customer.json

# Check results
aloma task list --state done | grep "Email Test"
aloma task list --state error | grep "Email Test"
````

### Success Criteria

* All valid emails pass validation
* Invalid emails are properly rejected with clear error messages
* Missing emails trigger appropriate error handling
* No false positives or negatives

````

### Continuous Improvement

#### Test Metrics Collection
```javascript
// steps/collect_test_metrics.js
export const condition = {
  collectTestMetrics: true
};

export const content = async () => {
  // Collect testing metrics
  const testMetrics = {
    timestamp: new Date().toISOString(),
    testSuite: data.testSuite || 'default',
    metrics: {
      totalTests: await getTestCount(),
      passedTests: await getPassedTestCount(),
      failedTests: await getFailedTestCount(),
      avgExecutionTime: await getAvgTestExecutionTime(),
      testCoverage: await calculateTestCoverage(),
      errorCategories: await getErrorCategories()
    },
    trends: {
      passRate: await calculatePassRate(),
      performanceTrend: await getPerformanceTrend(),
      reliabilityScore: await calculateReliabilityScore()
    }
  };
  
  // Store metrics for analysis
  data.testMetrics = testMetrics;
  
  // Generate test report
  const report = generateTestReport(testMetrics);
  data.testReport = report;
  
  // Alert on quality regressions
  if (testMetrics.trends.passRate < 0.95) { // 95% pass rate threshold
    await alertTestQualityRegression(testMetrics);
  }
  
  console.log('Test Metrics:', JSON.stringify(testMetrics, null, 2));
  
  data.testMetricsCollected = true;
};

function generateTestReport(metrics) {
  return {
    summary: {
      totalTests: metrics.metrics.totalTests,
      passRate: `${(metrics.trends.passRate * 100).toFixed(1)}%`,
      avgTime: `${metrics.metrics.avgExecutionTime}ms`,
      reliability: metrics.trends.reliabilityScore
    },
    recommendations: generateTestRecommendations(metrics),
    generatedAt: new Date().toISOString()
  };
}

function generateTestRecommendations(metrics) {
  const recommendations = [];
  
  if (metrics.trends.passRate < 0.95) {
    recommendations.push('Investigate failing tests and improve test stability');
  }
  
  if (metrics.metrics.avgExecutionTime > 5000) {
    recommendations.push('Optimize test execution time - consider parallel execution');
  }
  
  if (metrics.metrics.testCoverage < 0.8) {
    recommendations.push('Increase test coverage - add more edge case scenarios');
  }
  
  return recommendations;
}
````

This comprehensive Testing & Debugging Guide provides developers with the tools and strategies needed to build robust, reliable ALOMA automations. The combination of systematic testing approaches, powerful debugging techniques, and production monitoring ensures that automations work correctly in all environments and can be quickly diagnosed when issues arise.

The key to successful ALOMA automation testing is embracing the conditional execution model - testing data states rather than execution sequences, validating step coordination through data evolution, and building comprehensive observability into every automation from the start. order:', data.order.id);

```
// Business logic
data.order.status = "processing";
data.order.processedAt = new Date().toISOString();

// Success tracking
stepInfo.success = true;
stepInfo.outputData = {
  orderStatus: data.order.status,
  processedAt: data.order.processedAt
};
```

} catch (error) { // Error tracking stepInfo.success = false; stepInfo.error = { message: error.message, stack: error.stack };

```
console.error('Step execution failed:', error.message);
throw error;
```

} finally { // Execution completion tracking stepInfo.endTime = new Date().toISOString(); stepInfo.executionTime = Date.now() - stepStart;

```
data.executionTrace.push(stepInfo);

console.log(`Step completed: ${stepInfo.step} (${stepInfo.executionTime}ms)`);
```

} };

````

### Error Analysis and Recovery

#### Comprehensive Error Handling
```javascript
// steps/robust_error_handling.js
export const condition = {
  order: {
    status: "pending",
    errorHandled: null
  }
};

export const content = async () => {
  try {
    // Validate prerequisites
    if (!data.order?.id) {
      throw new Error('Order ID is required');
    }
    
    if (!data.customer?.validated) {
      throw new Error('Customer must be validated before order processing');
    }
    
    // Main processing logic
    const result = await processOrder(data.order);
    
    // Validate results
    if (!result.success) {
      throw new Error(`Order processing failed: ${result.error}`);
    }
    
    // Success path
    data.order.processed = true;
    data.order.processedAt = new Date().toISOString();
    data.order.result = result;
    
  } catch (error) {
    console.error('Order processing error:', error.message);
    
    // Detailed error information
    data.order.error = {
      message: error.message,
      timestamp: new Date().toISOString(),
      step: 'process_order',
      context: {
        orderId: data.order?.id,
        customerValidated: data.customer?.validated,
        orderStatus: data.order?.status
      },
      stack: error.stack,
      retryable: isRetryableError(error)
    };
    
    // Error recovery logic
    if (isRetryableError(error)) {
      data.order.retryCount = (data.order.retryCount || 0) + 1;
      data.order.requiresRetry = data.order.retryCount < 3;
    } else {
      data.order.requiresManualReview = true;
    }
    
    data.order.errorHandled = true;
    
    // Alert on critical errors
    if (error.message.includes('CRITICAL') || data.order.retryCount >= 3) {
      await notifyOpsTeam(error, data.order);
    }
  }
};

// Helper function for error classification
function isRetryableError(error) {
  const retryablePatterns = [
    'timeout',
    'connection',
    'rate limit',
    'temporary',
    'service unavailable'
  ];
  
  return retryablePatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern)
  );
}
````

***

### Performance Testing and Monitoring

#### Load Testing

**Bulk Task Creation**

Test automation performance under load:

bash

```bash
# Create multiple test tasks quickly
for i in {1..50}; do
  aloma task new "Load Test $i" -d "{
    \"customer\": {
      \"email\": \"loadtest$i@example.com\",
      \"status\": \"new\"
    },
    \"testMode\": true,
    \"loadTest\": true
  }"
done

# Monitor concurrent execution
aloma task list --state running | wc -l
aloma task list --state done | wc -l
aloma task list --state error | wc -l
```

**Performance Metrics Collection**

javascript

```javascript
// steps/performance_monitor.js
export const condition = {
  testMode: true,
  performanceTest: true
};

export const content = async () => {
  const startTime = Date.now();
  
  // Initialize performance tracking
  data.performance = data.performance || {
    stepTimes: [],
    totalSteps: 0,
    errors: 0,
    startTime: new Date().toISOString()
  };
  
  // Simulate various workloads
  const workloadType = data.workloadType || 'standard';
  
  switch (workloadType) {
    case 'light':
      await simulateWork(100); // 100ms work
      break;
    case 'standard':
      await simulateWork(500); // 500ms work
      break;
    case 'heavy':
      await simulateWork(2000); // 2s work
      break;
  }
  
  // Record performance metrics
  const executionTime = Date.now() - startTime;
  data.performance.stepTimes.push(executionTime);
  data.performance.totalSteps++;
  data.performance.lastStepTime = executionTime;
  data.performance.avgStepTime = 
    data.performance.stepTimes.reduce((a, b) => a + b, 0) / 
    data.performance.stepTimes.length;
  
  console.log(`Performance: ${executionTime}ms (avg: ${data.performance.avgStepTime.toFixed(2)}ms)`);
  
  data.performanceComplete = true;
};

async function simulateWork(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}
```

#### Production Monitoring

**Health Check Implementation**

bash

```bash
# Set up workspace monitoring
aloma workspace update --health-enabled true
aloma workspace update --notification-groups "devops@company.com"

# Create automated health checks
aloma task new "Health Check" -d '{
  "healthCheck": true,
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "automated": true
}'

# Monitor for failed tasks
aloma task list --state error --limit 50

# Check connector health
aloma connector list | grep -i error
aloma connector logs <connector-id> | grep -i error
```

**Performance Dashboard Data**

javascript

```javascript
// steps/collect_metrics.js
export const condition = {
  healthCheck: true
};

export const content = async () => {
  // Collect workspace metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    workspace: {
      name: task.workspace(),
      region: task.region()
    },
    tasks: {
      running: await getTaskCount('running'),
      completed: await getTaskCount('done'),
      failed: await getTaskCount('error'),
      pending: await getTaskCount('pending')
    },
    performance: {
      avgExecutionTime: await getAvgExecutionTime(),
      taskThroughput: await getTaskThroughput(),
      errorRate: await getErrorRate()
    },
    connectors: await getConnectorHealth(),
    system: {
      cpuUsage: await getCpuUsage(),
      memoryUsage: await getMemoryUsage(),
      diskUsage: await getDiskUsage()
    }
  };
  
  // Store metrics
  data.healthMetrics = metrics;
  
  // Alert on thresholds
  if (metrics.performance.errorRate > 0.05) { // 5% error rate
    await alertOpsTeam('High error rate detected', metrics);
  }
  
  if (metrics.performance.avgExecutionTime > 30000) { // 30s avg time
    await alertOpsTeam('High execution time detected', metrics);
  }
  
  console.log('Health check complete:', JSON.stringify(metrics, null, 2));
  
  data.healthCheckComplete = true;
};
```

***

### Troubleshooting Common Issues

#### Step Execution Problems

**Steps Not Triggering**

bash

```bash
# Debug condition matching
aloma step show <step-id>
aloma task log <task-id> --verbose

# Check condition specificity
aloma step list | grep "condition"

# Validate task data structure
aloma task show <task-id> --data
```

**Common Causes:**

* Condition too specific (no data matches)
* Condition too broad (conflicts with other steps)
* Data structure doesn't match expected format
* Required fields missing from task data

**Resolution Steps:**

javascript

```javascript
// Add debug step to verify data structure
export const condition = { debug: true };
export const content = async () => {
  console.log('Available data keys:', Object.keys(data));
  console.log('Data structure:', JSON.stringify(data, null, 2));
  data.debugComplete = true;
};
```

**Infinite Step Loops**

**Symptoms:**

* Tasks stuck in "running" state
* Same step executing repeatedly
* High resource usage

**Detection:**

bash

```bash
# Check for long-running tasks
aloma task list --state running --sort createdAt

# Monitor step execution count
aloma task log <task-id> --verbose | grep "Step executed"
```

**Prevention:**

javascript

```javascript
// Add loop detection
export const content = async () => {
  // Track execution count
  data.stepExecutionCount = (data.stepExecutionCount || 0) + 1;
  
  // Prevent infinite loops
  if (data.stepExecutionCount > 10) {
    throw new Error('Step execution limit exceeded - possible infinite loop');
  }
  
  // Your step logic here
  
  // Ensure clear exit condition
  data.processingComplete = true;
};
```

#### Data Validation Issues

**Schema Validation**

javascript

```javascript
// steps/validate_input.js
export const condition = {
  validateInput: true
};

export const content = async () => {
  const requiredFields = ['customer.email', 'order.total', 'order.items'];
  const errors = [];
  
  // Validate required fields
  requiredFields.forEach(field => {
    const value = getNestedValue(data, field);
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate data types
  if (data.order?.total && typeof data.order.total !== 'number') {
    errors.push('order.total must be a number');
  }
  
  if (data.order?.items && !Array.isArray(data.order.items)) {
    errors.push('order.items must be an array');
  }
  
  // Store validation results
  if (errors.length > 0) {
    data.validationErrors = errors;
    data.validationPassed = false;
    console.error('Validation failed:', errors);
  } else {
    data.validationPassed = true;
    console.log('Validation passed');
  }
  
  data.inputValidated = true;
};

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
```

#### Connector Issues

**Connector Debugging**

bash

```bash
# Check connector status
aloma connector list --verbose
aloma connector show <connector-id>

# Test connector connectivity
aloma connector test <connector-id>

# View connector logs
aloma connector logs <connector-id> --tail
aloma connector logs <connector-id> --since 1h
```

**Connector Error Handling**

javascript

```javascript
// steps/robust_connector_usage.js
export const condition = {
  customer: { email: String },
  crmRecordCreated: null
};

export const content = async () => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError;
  
  while (retryCount < maxRetries) {
    try {
      // Attempt connector operation
      const result = await connectors.hubspot.createContact({
        email: data.customer.email,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName
      });
      
      // Success
      data.customer.crmId = result.id;
      data.customer.crmRecordCreated = true;
      data.customer.crmCreatedAt = new Date().toISOString();
      
      console.log(`CRM record created: ${result.id}`);
      return; // Exit retry loop
      
    } catch (error) {
      lastError = error;
      retryCount++;
      
      console.error(`Connector attempt ${retryCount} failed:`, error.message);
      
      // Wait before retry (exponential backoff)
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed
  data.customer.crmRecordCreated = false;
  data.customer.crmError = {
    message: lastError.message,
    retries: retryCount,
    finalAttemptAt: new Date().toISOString()
  };
  
  console.error('CRM record creation failed after all retries');
  
  // Continue automation with error handling
  data.customer.requiresManualCrmCreation = true;
};
```

***

### Testing Best Practices

#### Test Organization

**Test Suite Structure**

bash

```bash
# Recommended testing workflow
my-automation/
├── tests/
│   ├── unit/           # Individual step tests
│   ├── integration/    # Multi-step workflow tests
│   ├── performance/    # Load and performance tests
│   ├── data/          # Test data files
│   └── scripts/       # Testing automation scripts
├── docs/
│   └── testing.md     # Testing documentation
└── .aloma/
    └── test-config.json
```

**Continuous Testing**

bash

```bash
#!/bin/bash
# scripts/run_tests.sh

echo "Starting ALOMA automation tests..."

# Unit tests - individual step validation
echo "Running unit tests..."
aloma task new "Unit Test - Customer Validation" -f tests/data/valid_customer.json
aloma task new "Unit Test - Order Processing" -f tests/data/valid_order.json
aloma task new "Unit Test - Error Handling" -f tests/data/invalid_data.json

# Integration tests - complete workflows
echo "Running integration tests..."
aloma task new "Integration Test - Customer Onboarding" -f tests/integration/customer_onboarding.json
aloma task new "Integration Test - Order Fulfillment" -f tests/integration/order_fulfillment.json

# Performance tests
echo "Running performance tests..."
for i in {1..10}; do
  aloma task new "Performance Test $i" -f tests/performance/load_test.json
done

# Monitor results
echo "Monitoring test execution..."
sleep 30

# Check results
FAILED_TESTS=$(aloma task list --state error | grep "Test" | wc -l)
PASSED_TESTS=$(aloma task list --state done | grep "Test" | wc -l)

echo "Test Results:"
echo "  Passed: $PASSED_TESTS"
echo "  Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -gt 0 ]; then
  echo "Some tests failed. Check logs for details."
  aloma task list --state error | grep "Test"
  exit 1
else
  echo "All tests passed!"
  exit 0
fi
```

#### Production Testing

**Canary Testing**

javascript

```javascript
// steps/canary_deployment.js
export const condition = {
  deployment: "canary",
  testGroup: String
};

export const content = async () => {
  // Route small percentage of traffic to new logic
  const canaryPercentage = 5; // 5% of traffic
  const isCanaryTraffic = Math.random() * 100 < canaryPercentage;
  
  if (isCanaryTraffic) {
    console.log('Processing with NEW logic (canary)');
    data.canaryGroup = "new_logic";
    
    // New logic implementation
    await processWithNewLogic(data);
    
  } else {
    console.log('Processing
```

\
