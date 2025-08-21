# Libraries and Code Reuse

## Libraries and Code Reuse

**Libraries in ALOMA enable you to create reusable JavaScript modules that can be shared across multiple steps within a workspace. They provide the foundation for maintainable, scalable automations by eliminating code duplication and organizing common functionality.**

Unlike traditional automation platforms that limit reusability, ALOMA libraries let you build a comprehensive toolkit of functions that evolve with your business needs. From simple utility functions to complex business logic, libraries transform your automation workspace into a powerful development environment.

### Understanding ALOMA Libraries

Libraries in ALOMA are self-contained JavaScript modules with clear interfaces, comprehensive documentation, and robust error handling. Each library consists of function declarations (the public API), implementation code (the actual logic), and documentation that helps other developers understand and use your functions.

#### Library Components

Every ALOMA library has five essential components:

**Display Name** - Human-readable identifier that appears in the library list **Namespace** - Internal identifier used to access the library in steps\
**Documentation** - JSDoc comments describing purpose and usage **Function Declarations** - TypeScript-style definitions of the public interface **Implementation Code** - The actual JavaScript code that implements the functionality

### Creating Libraries

#### Library Structure

When creating a library, follow this structure for maximum clarity and maintainability:

```javascript
/**
 * Customer data validation and processing utilities
 * Provides email, phone, and address validation with normalization
 **/

// Function declarations define the public interface
declare function validateEmail(email: string): boolean;
declare function validatePhone(phone: string): { valid: boolean; formatted: string };
declare function normalizeAddress(address: object): object;
declare function calculateRiskScore(customer: object): number;

// Implementation provides the actual functionality
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = email.trim().toLowerCase();
  
  return emailRegex.test(cleanEmail);
};

const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, formatted: '' };
  }
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Validate US phone number format
  if (digits.length === 10) {
    const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return { valid: true, formatted };
  } else if (digits.length === 11 && digits[0] === '1') {
    const formatted = `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return { valid: true, formatted };
  }
  
  return { valid: false, formatted: '' };
};

const normalizeAddress = (address) => {
  if (!address || typeof address !== 'object') return {};
  
  return {
    street: (address.street || '').trim().toLowerCase(),
    city: (address.city || '').trim().toLowerCase(),
    state: (address.state || '').trim().toUpperCase(),
    zipCode: (address.zipCode || '').replace(/\D/g, '').slice(0, 5),
    country: (address.country || 'US').toUpperCase()
  };
};

const calculateRiskScore = (customer) => {
  let score = 0;
  
  // Email domain scoring
  if (customer.email) {
    const domain = customer.email.split('@')[1];
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (freeDomains.includes(domain)) score += 20;
  }
  
  // Phone validation scoring
  const phoneResult = validatePhone(customer.phone);
  if (!phoneResult.valid) score += 30;
  
  // Address completeness scoring
  const requiredFields = ['street', 'city', 'state', 'zipCode'];
  const missingFields = requiredFields.filter(field => !customer.address?.[field]);
  score += missingFields.length * 10;
  
  return Math.min(score, 100); // Cap at 100
};

// Export functions for use in steps
module.exports = { 
  validateEmail, 
  validatePhone, 
  normalizeAddress, 
  calculateRiskScore 
};
```

#### Advanced Library Patterns

**Configuration-Driven Libraries**

Create libraries that adapt to different environments and use cases:

```javascript
/**
 * Environment-aware API client with retry logic and rate limiting
 **/

declare function createApiClient(config: object): object;
declare function makeRequest(client: object, endpoint: string, options?: object): Promise<any>;
declare function handleRateLimit(response: object): Promise<void>;

const createApiClient = (config = {}) => {
  const defaults = {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    rateLimit: 60, // requests per minute
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  return { ...defaults, ...config, requestCount: 0, lastRequest: 0 };
};

const makeRequest = async (client, endpoint, options = {}) => {
  // Rate limiting check
  const now = Date.now();
  const timeSinceLastRequest = now - client.lastRequest;
  const minInterval = (60 * 1000) / client.rateLimit; // ms between requests
  
  if (timeSinceLastRequest < minInterval) {
    const delay = minInterval - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  const url = `${client.baseUrl}${endpoint}`;
  const requestOptions = {
    method: 'GET',
    timeout: client.timeout,
    headers: { ...client.headers, ...options.headers },
    ...options
  };
  
  let lastError;
  
  // Retry logic
  for (let attempt = 1; attempt <= client.retries; attempt++) {
    try {
      client.lastRequest = Date.now();
      client.requestCount++;
      
      const response = await fetch(url, requestOptions);
      
      if (response.status === 429) {
        await handleRateLimit(response);
        continue; // Retry after rate limit handling
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < client.retries) {
        const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw new Error(`Request failed after ${client.retries} attempts: ${lastError.message}`);
};

const handleRateLimit = async (response) => {
  const retryAfter = response.headers.get('Retry-After');
  const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // Default 1 minute
  
  console.log(`Rate limited. Waiting ${delay}ms before retry...`);
  await new Promise(resolve => setTimeout(resolve, delay));
};

module.exports = { createApiClient, makeRequest, handleRateLimit };
```

**Data Processing Libraries**

Build sophisticated data transformation utilities:

```javascript
/**
 * Advanced data processing and transformation utilities
 **/

declare function transformData(data: any, schema: object): any;
declare function validateSchema(data: any, schema: object): { valid: boolean; errors: string[] };
declare function aggregateMetrics(records: array, groupBy: string, metrics: object): object;

const transformData = (data, schema) => {
  if (!data || !schema) return data;
  
  const transformed = {};
  
  for (const [key, transform] of Object.entries(schema)) {
    const value = getNestedValue(data, key);
    
    if (value !== undefined) {
      transformed[key] = applyTransformation(value, transform);
    }
  }
  
  return transformed;
};

const validateSchema = (data, schema) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = getNestedValue(data, field);
    
    // Required field check
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Field '${field}' is required`);
      continue;
    }
    
    if (value !== undefined) {
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(`Field '${field}' must be of type ${rules.type}`);
      }
      
      // Range validation for numbers
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`Field '${field}' must be at least ${rules.min}`);
      }
      
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`Field '${field}' must be at most ${rules.max}`);
      }
      
      // String length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
      }
      
      // Pattern validation
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        errors.push(`Field '${field}' does not match required pattern`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
};

const aggregateMetrics = (records, groupBy, metrics) => {
  const groups = {};
  
  // Group records
  records.forEach(record => {
    const groupKey = getNestedValue(record, groupBy) || 'unknown';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(record);
  });
  
  // Calculate metrics for each group
  const results = {};
  
  for (const [groupKey, groupRecords] of Object.entries(groups)) {
    results[groupKey] = {};
    
    for (const [metricName, metricConfig] of Object.entries(metrics)) {
      const values = groupRecords
        .map(record => getNestedValue(record, metricConfig.field))
        .filter(value => value !== undefined && value !== null);
      
      switch (metricConfig.operation) {
        case 'sum':
          results[groupKey][metricName] = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          results[groupKey][metricName] = values.length > 0 
            ? values.reduce((sum, val) => sum + val, 0) / values.length 
            : 0;
          break;
        case 'count':
          results[groupKey][metricName] = values.length;
          break;
        case 'min':
          results[groupKey][metricName] = values.length > 0 ? Math.min(...values) : null;
          break;
        case 'max':
          results[groupKey][metricName] = values.length > 0 ? Math.max(...values) : null;
          break;
        default:
          results[groupKey][metricName] = values;
      }
    }
  }
  
  return results;
};

// Helper functions
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const applyTransformation = (value, transform) => {
  switch (transform.type) {
    case 'uppercase':
      return value.toString().toUpperCase();
    case 'lowercase':
      return value.toString().toLowerCase();
    case 'number':
      return parseFloat(value) || 0;
    case 'date':
      return new Date(value).toISOString();
    case 'trim':
      return value.toString().trim();
    default:
      return value;
  }
};

module.exports = { transformData, validateSchema, aggregateMetrics };
```

### Using Libraries in Steps

Once created, libraries integrate seamlessly into your steps through the `lib` namespace:

#### Basic Library Usage

```javascript
export const condition = {
  customer: {
    email: String,
    phone: String
  }
};

export const content = async () => {
  console.log('Validating customer data...');
  
  // Use validation library functions
  const emailValid = lib.customerUtils.validateEmail(data.customer.email);
  const phoneResult = lib.customerUtils.validatePhone(data.customer.phone);
  
  if (emailValid && phoneResult.valid) {
    data.customer.validated = true;
    data.customer.phone = phoneResult.formatted; // Use formatted phone
    data.customer.riskScore = lib.customerUtils.calculateRiskScore(data.customer);
    
    console.log(`Customer validated with risk score: ${data.customer.riskScore}`);
  } else {
    data.customer.validated = false;
    data.customer.validationErrors = [];
    
    if (!emailValid) {
      data.customer.validationErrors.push('Invalid email format');
    }
    if (!phoneResult.valid) {
      data.customer.validationErrors.push('Invalid phone number');
    }
  }
};
```

#### Advanced Library Integration

```javascript
export const condition = {
  orders: Array,
  analysis: { type: "revenue_by_region" }
};

export const content = async () => {
  console.log('Performing revenue analysis...');
  
  // Use data processing library for complex analysis
  const schema = {
    'customer.region': { required: true, type: 'string' },
    'total': { required: true, type: 'number', min: 0 },
    'date': { required: true, type: 'string' }
  };
  
  // Validate data structure
  const validationResults = data.orders.map(order => 
    lib.dataProcessor.validateSchema(order, schema)
  );
  
  const validOrders = data.orders.filter((order, index) => 
    validationResults[index].valid
  );
  
  // Aggregate revenue by region
  const revenueByRegion = lib.dataProcessor.aggregateMetrics(
    validOrders,
    'customer.region',
    {
      totalRevenue: { field: 'total', operation: 'sum' },
      orderCount: { field: 'id', operation: 'count' },
      avgOrderValue: { field: 'total', operation: 'avg' }
    }
  );
  
  data.analysis = {
    type: 'revenue_by_region',
    results: revenueByRegion,
    totalOrders: validOrders.length,
    invalidOrders: data.orders.length - validOrders.length,
    generatedAt: new Date().toISOString()
  };
  
  console.log(`Analysis complete: ${Object.keys(revenueByRegion).length} regions processed`);
};
```

#### Library Function Chaining

```javascript
export const condition = {
  documents: Array,
  process: { type: "batch_normalize" }
};

export const content = async () => {
  console.log('Processing document batch...');
  
  const processedDocuments = data.documents.map(doc => {
    // Chain multiple library functions
    const normalized = lib.textUtils.normalizeText(doc.content);
    const classified = lib.mlUtils.classifyDocument(normalized);
    const enriched = lib.dataEnrichment.addMetadata(doc, classified);
    
    return {
      ...doc,
      normalized,
      classification: classified,
      metadata: enriched,
      processedAt: new Date().toISOString()
    };
  });
  
  data.documents = processedDocuments;
  data.processing = {
    completed: true,
    totalProcessed: processedDocuments.length,
    classifications: lib.dataProcessor.aggregateMetrics(
      processedDocuments,
      'classification.category',
      { count: { field: 'id', operation: 'count' } }
    )
  };
};
```

### Library Management and CLI Integration

#### Creating Libraries via CLI

While libraries are typically created through the web interface, you can manage them using ALOMA CLI commands:

```bash
# List all libraries in workspace

# Deploy workspace configuration including libraries
aloma deploy workspace-config.yaml
```

#### Version Control for Libraries

Treat libraries as code assets that should be version controlled:

```javascript
/**
 * Customer Validation Library v2.1.0
 * 
 * Changelog:
 * v2.1.0 - Added international phone number support
 * v2.0.0 - Breaking: Changed return format for validatePhone
 * v1.0.0 - Initial release
 **/

// Version information accessible in library
const VERSION = '2.1.0';
const LAST_UPDATED = '2025-08-18';

declare function getVersion(): string;
declare function validateEmail(email: string): boolean;

const getVersion = () => VERSION;

// Rest of library implementation...
module.exports = { getVersion, validateEmail, validatePhone };
```

#### Library Testing Patterns

Implement testing within your library functions:

```javascript
/**
 * Self-testing utilities library with built-in validation
 **/

declare function runTests(): { passed: number; failed: number; results: array };

const runTests = () => {
  const tests = [
    {
      name: 'validateEmail - valid email',
      test: () => validateEmail('test@example.com'),
      expected: true
    },
    {
      name: 'validateEmail - invalid email',
      test: () => validateEmail('invalid-email'),
      expected: false
    },
    {
      name: 'validatePhone - US format',
      test: () => validatePhone('(555) 123-4567').valid,
      expected: true
    }
  ];
  
  const results = tests.map(test => {
    try {
      const result = test.test();
      const passed = result === test.expected;
      return {
        name: test.name,
        passed,
        result,
        expected: test.expected
      };
    } catch (error) {
      return {
        name: test.name,
        passed: false,
        error: error.message
      };
    }
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  
  return { passed, failed, results };
};

module.exports = { runTests, validateEmail, validatePhone };
```

### Best Practices for Library Development

#### Design Principles

**Single Responsibility** - Each library should focus on one domain or type of functionality **Clear Interface** - Function signatures should be intuitive and well-documented **Error Handling** - Always handle edge cases and provide meaningful error messages **Performance** - Consider the impact of library functions on step execution time

#### Naming Conventions

Use consistent, descriptive naming patterns:

```javascript
// ✅ Good: Clear, descriptive names
lib.customerUtils.validateEmail()
lib.dataProcessor.aggregateMetrics()
lib.apiClient.makeRequest()

// ❌ Avoid: Vague or unclear names
lib.utils.process()
lib.helper.doStuff()
lib.lib.function()
```

#### Documentation Standards

Include comprehensive JSDoc documentation:

```javascript
/**
 * Advanced customer data validation and processing utilities
 * 
 * Provides comprehensive validation for customer data including:
 * - Email format and domain validation
 * - International phone number formatting
 * - Address normalization and geocoding
 * - Risk scoring based on multiple factors
 * 
 * @version 2.1.0
 * @author DevOps Team
 * @since 2025-01-15
 **/

/**
 * Validates email address format and checks domain reputation
 * 
 * @param {string} email - Email address to validate
 * @param {object} options - Validation options
 * @param {boolean} options.checkDomain - Whether to verify domain exists
 * @param {string[]} options.blockedDomains - List of blocked email domains
 * @returns {boolean} True if email is valid and not blocked
 * 
 * @example
 * const isValid = validateEmail('user@example.com', { checkDomain: true });
 */
declare function validateEmail(email: string, options?: object): boolean;
```

#### Error Handling Patterns

Implement consistent error handling across library functions:

```javascript
const validateEmail = (email, options = {}) => {
  // Input validation
  if (!email) {
    throw new Error('Email parameter is required');
  }
  
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  
  try {
    // Main validation logic
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(cleanEmail)) {
      return false;
    }
    
    // Additional domain checking if requested
    if (options.checkDomain) {
      const domain = cleanEmail.split('@')[1];
      if (options.blockedDomains?.includes(domain)) {
        return false;
      }
    }
    
    return true;
    
  } catch (error) {
    // Log error for debugging but don't throw
    console.error('Email validation error:', error.message);
    return false;
  }
};
```

#### Performance Optimization

Design libraries for efficiency:

```javascript
// ✅ Good: Reuse expensive operations
const domainCache = new Map();

const validateEmailDomain = (domain) => {
  if (domainCache.has(domain)) {
    return domainCache.get(domain);
  }
  
  // Expensive domain validation
  const isValid = performDomainLookup(domain);
  domainCache.set(domain, isValid);
  
  return isValid;
};

// ✅ Good: Batch operations when possible
const validateEmailBatch = (emails) => {
  return emails.map(email => ({
    email,
    valid: validateEmail(email)
  }));
};
```

Libraries are the cornerstone of maintainable ALOMA automations. By building a comprehensive library of reusable functions, you create a powerful toolkit that accelerates development, ensures consistency, and scales with your automation needs. Master library development to transform your workspace into a sophisticated automation platform.
