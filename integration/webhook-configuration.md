# Webhook Configuration

## Webhook Configuration

**Webhooks in ALOMA provide real-time integration with external systems by accepting incoming data that creates tasks and sending outgoing data to external endpoints. They enable instant automation triggers from websites, services, and applications without requiring complex polling or scheduled jobs.**

Unlike traditional integration methods that require constant polling or batch processing, ALOMA webhooks provide immediate task creation from external events and seamless data delivery to external systems through a unified interface.

### Understanding ALOMA Webhooks

Webhooks are HTTP endpoints that enable real-time communication between ALOMA and external systems. ALOMA supports both incoming webhooks (data flowing into ALOMA) and outgoing webhooks (data flowing from ALOMA to external systems).

#### Webhook Types

**Incoming Webhooks** - Receive data from external systems to create ALOMA tasks **Outgoing Webhooks** - Send data from ALOMA steps to external systems **Bidirectional Integration** - Combine both patterns for complete automation workflows

#### Key Benefits

**Real-time Processing** - Instant task creation from external events **No Infrastructure Required** - ALOMA hosts and manages webhook endpoints **Flexible Data Handling** - Accept any JSON payload structure **Built-in Error Handling** - Automatic retry logic and error tracking **Secure Communication** - HTTPS endpoints with optional authentication

### Incoming Webhooks

Incoming webhooks receive data from external systems and automatically create tasks in your ALOMA workspace. Each incoming payload becomes a task that triggers your conditional steps.

#### Creating Incoming Webhooks

Configure incoming webhooks through deploy files or CLI commands:

```bash
# List existing webhooks
aloma webhook list

# Add new webhook
aloma webhook add "Lead Form Submissions"

# Show webhook details
aloma webhook show <webhook-id>

# Delete webhook
aloma webhook delete <webhook-id>
```

#### Deploy File Configuration

Configure webhooks in your `deploy.yaml`:

```yaml
workspaces:
  - name: "Sales Automation"
    
    # Webhook configuration
    webhooks:
      - name: "Contact Form"
      - name: "Product Inquiries" 
      - name: "Support Tickets"
      - name: "Payment Notifications"
    
    # Steps will process webhook data
    steps:
      - syncPath: "steps/"
```

#### Webhook URL Format

ALOMA generates unique URLs for each webhook:

```
https://connect.aloma.io/event/{webhook-id}
```

Use this URL in external systems to send data to ALOMA.

#### Basic Webhook Usage

External systems send JSON data to your webhook URL:

```bash
# Example: Website form submission
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Chen", 
    "email": "sarah@company.com",
    "company": "TechCorp",
    "message": "Interested in your automation platform"
  }' \
  https://connect.aloma.io/event/abc123webhook456
```

This creates a task in ALOMA that your steps can process:

```javascript
export const condition = {
  "$via": {
    name: "Contact Form"
  }
};

export const content = async () => {
  console.log('Processing contact form submission...');
  
  // Access webhook data
  console.log('Contact:', data.firstName, data.lastName);
  console.log('Email:', data.email);
  console.log('Company:', data.company);
  
  // ALOMA automatically adds $via metadata
  console.log('Webhook name:', data.$via.name);
  console.log('Webhook type:', data.$via.type);
  console.log('Received timestamp:', data.$via.received);
  
  // Process the contact
  data.contact = {
    fullName: `${data.firstName} ${data.lastName}`,
    email: data.email,
    company: data.company,
    source: 'website_form',
    receivedAt: new Date().toISOString()
  };
  
  data.processed = true;
};
```

### Advanced Incoming Webhook Patterns

#### Multi-Source Webhook Handling

Handle different types of webhook sources with conditional processing:

```javascript
// Handle contact form submissions
export const condition = {
  "$via": {
    name: "Contact Form"
  },
  email: String
};

export const content = async () => {
  console.log('Processing contact form submission...');
  
  data.leadType = 'contact_inquiry';
  data.priority = 'normal';
  data.source = 'website_contact_form';
  
  // Validate email format
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  data.emailValid = emailValid;
  
  if (!emailValid) {
    data.validationError = 'Invalid email format';
    data.requiresReview = true;
  }
};

// Handle product inquiry forms  
export const condition = {
  "$via": {
    name: "Product Inquiries"
  },
  product: String
};

export const content = async () => {
  console.log('Processing product inquiry...');
  
  data.leadType = 'product_inquiry';
  data.priority = 'high';
  data.source = 'product_page_form';
  
  // Enrich with product information
  const productInfo = {
    'automation-platform': { category: 'Enterprise', price: 'Custom' },
    'integration-tools': { category: 'Developer', price: 'Subscription' },
    'analytics-suite': { category: 'Business', price: 'Monthly' }
  };
  
  data.productInfo = productInfo[data.product] || { category: 'Unknown', price: 'Contact Sales' };
  data.productCategory = data.productInfo.category;
};

// Handle support ticket submissions
export const condition = {
  "$via": {
    name: "Support Tickets"
  },
  issue: String
};

export const content = async () => {
  console.log('Processing support ticket...');
  
  data.ticketType = 'support_request';
  data.priority = data.urgency === 'high' ? 'urgent' : 'normal';
  data.source = 'support_form';
  
  // Categorize issue type
  const issueCategories = {
    'login': 'authentication',
    'billing': 'financial', 
    'technical': 'engineering',
    'feature': 'product'
  };
  
  const category = Object.keys(issueCategories).find(key => 
    data.issue.toLowerCase().includes(key)
  );
  
  data.category = category ? issueCategories[category] : 'general';
  data.assignedTeam = data.category;
};
```

#### Payment and Transaction Webhooks

Handle payment notifications and transaction updates:

```javascript
export const condition = {
  "$via": {
    name: "Payment Notifications"
  },
  event_type: String,
  transaction: Object
};

export const content = async () => {
  console.log(`Processing payment event: ${data.event_type}`);
  
  switch (data.event_type) {
    case 'payment.completed':
      data.paymentStatus = 'completed';
      data.requiresConfirmation = true;
      data.priority = 'high';
      
      // Extract payment details
      data.payment = {
        amount: data.transaction.amount,
        currency: data.transaction.currency,
        customerId: data.transaction.customer_id,
        transactionId: data.transaction.id,
        completedAt: data.transaction.completed_at
      };
      break;
      
    case 'payment.failed':
      data.paymentStatus = 'failed';
      data.requiresRetry = true;
      data.priority = 'urgent';
      
      data.failure = {
        reason: data.transaction.failure_reason,
        code: data.transaction.failure_code,
        customerId: data.transaction.customer_id,
        failedAt: data.transaction.failed_at
      };
      break;
      
    case 'subscription.cancelled':
      data.subscriptionStatus = 'cancelled';
      data.requiresFollowup = true;
      data.priority = 'normal';
      
      data.cancellation = {
        customerId: data.transaction.customer_id,
        reason: data.transaction.cancellation_reason,
        cancelledAt: data.transaction.cancelled_at
      };
      break;
      
    default:
      data.eventProcessed = false;
      data.requiresReview = true;
      console.log(`Unknown payment event type: ${data.event_type}`);
  }
  
  data.eventProcessed = true;
  data.processedAt = new Date().toISOString();
};
```

#### File Upload Webhooks

Handle file uploads and document processing:

```javascript
export const condition = {
  "$via": {
    name: "Document Upload"
  },
  file: Object
};

export const content = async () => {
  console.log('Processing document upload...');
  
  const file = data.file;
  
  // Validate file type and size
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/csv'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  const validation = {
    typeValid: allowedTypes.includes(file.type),
    sizeValid: file.size <= maxSize,
    nameValid: file.name && file.name.length > 0
  };
  
  data.fileValidation = validation;
  data.fileValid = Object.values(validation).every(v => v === true);
  
  if (data.fileValid) {
    // Process valid file
    data.document = {
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url,
      uploadedAt: new Date().toISOString()
    };
    
    // Determine processing type
    if (file.type === 'application/pdf') {
      data.processingType = 'pdf_extraction';
      data.extractText = true;
    } else if (file.type.startsWith('image/')) {
      data.processingType = 'image_analysis';
      data.extractMetadata = true;
    } else if (file.type === 'text/csv') {
      data.processingType = 'data_import';
      data.parseData = true;
    }
    
    data.readyForProcessing = true;
    
  } else {
    // Handle invalid file
    data.validationErrors = [];
    if (!validation.typeValid) {
      data.validationErrors.push(`Invalid file type: ${file.type}`);
    }
    if (!validation.sizeValid) {
      data.validationErrors.push(`File too large: ${file.size} bytes`);
    }
    if (!validation.nameValid) {
      data.validationErrors.push('Missing or invalid file name');
    }
    
    data.requiresUserNotification = true;
  }
};
```

### Outgoing Webhooks

Outgoing webhooks send data from ALOMA steps to external systems using the built-in `connectors.fetch` functionality.

#### Basic Outgoing Webhook Pattern

Send data to external endpoints from your steps:

```javascript
export const condition = {
  customer: {
    created: true,
    email: String
  }
};

export const content = async () => {
  console.log('Sending customer data to external CRM...');
  
  try {
    // Send data to external webhook
    const response = await connectors.fetch({
      url: 'https://external-crm.com/api/webhooks/customers',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${task.config('EXTERNAL_CRM_TOKEN')}`
        },
        body: JSON.stringify({
          event_type: 'customer.created',
          timestamp: new Date().toISOString(),
          data: {
            email: data.customer.email,
            name: data.customer.name,
            company: data.customer.company,
            source: 'aloma_automation'
          }
        })
      }
    });
    
    if (response.ok) {
      data.customer.syncedToExternalCRM = true;
      data.customer.syncedAt = new Date().toISOString();
      console.log('Customer data successfully synced to external CRM');
    } else {
      throw new Error(`CRM sync failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Failed to sync customer to external CRM:', error.message);
    data.customer.syncError = error.message;
    data.customer.requiresRetry = true;
  }
};
```

#### Multi-Endpoint Notifications

Send notifications to multiple external systems:

```javascript
export const condition = {
  order: {
    status: "completed",
    customer: Object,
    total: Number
  }
};

export const content = async () => {
  console.log('Sending order completion notifications...');
  
  const orderData = {
    orderId: data.order.id,
    customerId: data.order.customer.id,
    total: data.order.total,
    items: data.order.items,
    completedAt: new Date().toISOString()
  };
  
  const notifications = [];
  
  // Send to fulfillment system
  notifications.push(
    connectors.fetch({
      url: 'https://fulfillment.company.com/api/orders/completed',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': task.config('FULFILLMENT_API_KEY')
        },
        body: JSON.stringify({
          ...orderData,
          action: 'ship_order'
        })
      }
    })
  );
  
  // Send to analytics platform
  notifications.push(
    connectors.fetch({
      url: 'https://analytics.company.com/api/events',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${task.config('ANALYTICS_TOKEN')}`
        },
        body: JSON.stringify({
          event: 'order_completed',
          properties: orderData,
          timestamp: new Date().toISOString()
        })
      }
    })
  );
  
  // Send to customer success platform
  if (data.order.total > 1000) { // High-value orders only
    notifications.push(
      connectors.fetch({
        url: 'https://customer-success.company.com/api/high-value-orders',
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${task.config('CS_PLATFORM_TOKEN')}`
          },
          body: JSON.stringify({
            ...orderData,
            priority: 'high',
            assignToCSM: true
          })
        }
      })
    );
  }
  
  try {
    // Send all notifications in parallel
    const results = await Promise.allSettled(notifications);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
    const failed = results.length - successful;
    
    data.notifications = {
      sent: results.length,
      successful: successful,
      failed: failed,
      completedAt: new Date().toISOString()
    };
    
    if (failed > 0) {
      console.warn(`${failed} of ${results.length} notifications failed`);
      data.notifications.requiresRetry = true;
    } else {
      console.log(`All ${successful} notifications sent successfully`);
    }
    
  } catch (error) {
    console.error('Notification sending failed:', error.message);
    data.notifications = {
      error: error.message,
      requiresRetry: true,
      failedAt: new Date().toISOString()
    };
  }
};
```

#### Webhook Retry Logic

Implement robust retry logic for outgoing webhooks:

```javascript
export const condition = {
  webhookData: Object,
  retryAttempt: { $lt: 3 }
};

export const content = async () => {
  const attempt = (data.retryAttempt || 0) + 1;
  console.log(`Webhook delivery attempt ${attempt}/3`);
  
  try {
    const response = await connectors.fetch({
      url: task.config('WEBHOOK_ENDPOINT'),
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': generateSignature(data.webhookData),
          'X-Retry-Attempt': attempt.toString()
        },
        body: JSON.stringify(data.webhookData)
      }
    });
    
    if (response.ok) {
      data.webhookDelivered = true;
      data.deliveredAt = new Date().toISOString();
      data.deliveryAttempts = attempt;
      console.log(`Webhook delivered successfully on attempt ${attempt}`);
      
    } else if (response.status >= 500) {
      // Server error - retry
      throw new Error(`Server error: ${response.status}`);
    } else if (response.status === 429) {
      // Rate limited - retry with delay
      throw new Error(`Rate limited: ${response.status}`);
    } else {
      // Client error - don't retry
      data.webhookDelivered = false;
      data.deliveryError = `Client error: ${response.status} ${response.statusText}`;
      data.finalFailure = true;
      console.error(`Webhook delivery failed permanently: ${data.deliveryError}`);
    }
    
  } catch (error) {
    console.error(`Webhook delivery attempt ${attempt} failed:`, error.message);
    
    data.retryAttempt = attempt;
    data.lastError = error.message;
    data.lastAttemptAt = new Date().toISOString();
    
    if (attempt >= 3) {
      data.webhookDelivered = false;
      data.finalFailure = true;
      data.deliveryError = `Failed after ${attempt} attempts: ${error.message}`;
      
      // Send alert for permanent failure
      await connectors.slackCom.send({
        channel: '#alerts',
        text: `🚨 Webhook delivery permanently failed after ${attempt} attempts\nEndpoint: ${task.config('WEBHOOK_ENDPOINT')}\nError: ${error.message}`
      });
    } else {
      // Calculate delay for next retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      data.nextRetryAt = new Date(Date.now() + delay).toISOString();
      console.log(`Will retry in ${delay}ms`);
    }
  }
};

// Helper function (would be in a library)
function generateSignature(data) {
  // Implement webhook signature verification
  const secret = task.config('WEBHOOK_SECRET');
  const payload = JSON.stringify(data);
  // Return HMAC signature of payload with secret
  return 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
```

### Webhook Security and Best Practices

#### Input Validation

Always validate incoming webhook data:

```javascript
export const condition = {
  "$via": {
    type: "webhook"
  }
};

export const content = async () => {
  console.log('Validating webhook data...');
  
  const validation = {
    hasRequiredFields: !!(data.email && data.firstName && data.lastName),
    emailFormat: data.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) : false,
    nameLength: data.firstName && data.firstName.length >= 2 && data.lastName && data.lastName.length >= 2,
    noMaliciousContent: !containsMaliciousContent(data)
  };
  
  data.validation = validation;
  data.isValid = Object.values(validation).every(v => v === true);
  
  if (data.isValid) {
    console.log('Webhook data validation passed');
    data.readyForProcessing = true;
  } else {
    console.warn('Webhook data validation failed:', validation);
    data.validationErrors = Object.entries(validation)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    data.requiresReview = true;
  }
};

function containsMaliciousContent(data) {
  // Implement basic security checks
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i
  ];
  
  const dataString = JSON.stringify(data);
  return maliciousPatterns.some(pattern => pattern.test(dataString));
}
```

#### Rate Limiting and Throttling

Handle high-volume webhook scenarios:

```javascript
export const condition = {
  "$via": {
    type: "webhook"
  }
};

export const content = async () => {
  const webhookId = data.$via.id;
  const now = Date.now();
  
  // Initialize rate limiting data
  if (!data.rateLimiting) {
    data.rateLimiting = {
      windowStart: now,
      requestCount: 0,
      windowSize: 60000, // 1 minute window
      maxRequests: 100    // Max 100 requests per minute
    };
  }
  
  const rl = data.rateLimiting;
  
  // Reset window if expired
  if (now - rl.windowStart > rl.windowSize) {
    rl.windowStart = now;
    rl.requestCount = 0;
  }
  
  rl.requestCount++;
  
  if (rl.requestCount > rl.maxRequests) {
    console.warn(`Rate limit exceeded for webhook ${webhookId}: ${rl.requestCount}/${rl.maxRequests}`);
    
    data.rateLimited = true;
    data.dropRequest = true;
    
    // Optional: Send alert for rate limiting
    if (rl.requestCount === rl.maxRequests + 1) { // Alert only once per window
      await connectors.slackCom.send({
        channel: '#alerts',
        text: `⚠️ Webhook rate limit exceeded: ${webhookId}\nRequests: ${rl.requestCount}/${rl.maxRequests}`
      });
    }
    
  } else {
    console.log(`Webhook request accepted: ${rl.requestCount}/${rl.maxRequests}`);
    data.rateLimited = false;
    data.readyForProcessing = true;
  }
};
```

#### Error Handling and Monitoring

Implement comprehensive error tracking:

```javascript
export const condition = {
  webhookError: true
};

export const content = async () => {
  console.log('Handling webhook error...');
  
  const error = {
    timestamp: new Date().toISOString(),
    webhookId: data.$via?.id,
    webhookName: data.$via?.name,
    errorType: data.errorType || 'unknown',
    errorMessage: data.errorMessage || 'No error message provided',
    requestData: data.originalRequest || null,
    userAgent: data.userAgent || null,
    ipAddress: data.ipAddress || null
  };
  
  // Log error details
  console.error('Webhook error details:', JSON.stringify(error, null, 2));
  
  // Categorize error severity
  const highSeverityErrors = ['authentication_failed', 'rate_limit_exceeded', 'malicious_request'];
  const severity = highSeverityErrors.includes(error.errorType) ? 'high' : 'normal';
  
  data.errorDetails = error;
  data.severity = severity;
  
  // Send appropriate notifications
  if (severity === 'high') {
    await connectors.slackCom.send({
      channel: '#security-alerts',
      text: `🚨 High-severity webhook error detected\nWebhook: ${error.webhookName} (${error.webhookId})\nError: ${error.errorType}\nMessage: ${error.errorMessage}\nTime: ${error.timestamp}`
    });
  } else {
    // Log to monitoring system
    await connectors.fetch({
      url: task.config('MONITORING_ENDPOINT'),
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${task.config('MONITORING_TOKEN')}`
        },
        body: JSON.stringify({
          event: 'webhook_error',
          severity: severity,
          details: error
        })
      }
    });
  }
  
  data.errorLogged = true;
  data.loggedAt = new Date().toISOString();
};
```

### Webhook Management

#### CLI Management Commands

Essential commands for webhook lifecycle management:

```bash
# List all webhooks in workspace
aloma webhook list

# Show detailed webhook information
aloma webhook show <webhook-id>

# Add new webhook
aloma webhook add "API Integration Webhook"

# Delete webhook (be careful - this cannot be undone)
aloma webhook delete <webhook-id>

# View webhook-related tasks
aloma task list --name "webhook"

# Monitor webhook performance
aloma task log <task-id> --logs
```

#### Webhook URL Management

Protect and manage your webhook URLs:

```bash
# Webhook URLs should be treated as secrets
# Store them in environment variables or secure configuration

# Example: Configure external system
export ALOMA_WEBHOOK_URL="https://connect.aloma.io/event/your-webhook-id"

# Use in external system configuration
curl -X POST "$ALOMA_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "timestamp": "2025-08-18T10:00:00Z"}'
```

#### Monitoring and Analytics

Track webhook performance and usage:

```javascript
export const condition = {
  "$via": {
    type: "webhook"
  }
};

export const content = async () => {
  // Track webhook usage metrics
  const metrics = {
    webhookId: data.$via.id,
    webhookName: data.$via.name,
    receivedAt: new Date(data.$via.received).toISOString(),
    processingStarted: new Date().toISOString(),
    payloadSize: JSON.stringify(data).length,
    sourceIP: data.sourceIP || 'unknown',
    userAgent: data.userAgent || 'unknown'
  };
  
  // Log metrics for analytics
  console.log('Webhook metrics:', JSON.stringify(metrics, null, 2));
  
  // Store metrics for dashboard
  data.metrics = metrics;
  data.metricsRecorded = true;
  
  // Optional: Send to analytics platform
  await connectors.fetch({
    url: task.config('ANALYTICS_ENDPOINT'),
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${task.config('ANALYTICS_TOKEN')}`
      },
      body: JSON.stringify({
        event: 'webhook_received',
        timestamp: metrics.receivedAt,
        properties: metrics
      })
    }
  });
};
```

Webhooks provide the foundation for real-time automation in ALOMA. By mastering both incoming and outgoing webhook patterns, you can create responsive automations that integrate seamlessly with external systems while maintaining security, reliability, and performance.
