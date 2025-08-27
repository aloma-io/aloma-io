# Using Cloud Connectors

## Using Cloud Connectors

**Cloud connectors in ALOMA provide ready-to-use integrations with popular services like HubSpot, Slack, Google Sheets, and hundreds of other platforms. They eliminate the complexity of API authentication, rate limiting, and error handling while providing a simple, consistent interface for external service integration.**

Unlike traditional integration platforms that require complex configuration and maintenance, ALOMA's cloud connectors run managed infrastructure with built-in authentication, retry logic, and automatic updates. Simply add a connector to your workspace, configure credentials once, and start building automations immediately.

### Understanding Cloud Connectors

Cloud connectors are managed service integrations that ALOMA hosts and maintains. Each connector wraps a specific external service's API, providing simplified access through consistent patterns while handling authentication, rate limiting, and error recovery automatically.

#### Connector Types

**API Key Connectors** - Services that use simple API key authentication **OAuth Connectors** - Services requiring OAuth 2.0 authorization flows\
**Username/Password Connectors** - Legacy services using basic authentication **Token-based Connectors** - Services using bearer tokens or custom auth headers

#### Key Benefits

**No Infrastructure Management** - ALOMA handles hosting, scaling, and updates **Built-in Authentication** - Configure credentials once, use everywhere\
**Automatic Retry Logic** - Intelligent handling of transient failures **Rate Limit Management** - Automatic throttling to respect API limits **Unified Interface** - Consistent patterns across all connector types

### Adding and Configuring Connectors

#### Available Connectors

List all available cloud connectors:

```bash
# See all available connectors
aloma connector list-available

# Filter by service type
aloma connector list-available -f slack
aloma connector list-available -f hubspot
aloma connector list-available -f google
```

#### Adding Connectors to Your Workspace

Add connectors through the deploy file or CLI commands:

```bash
# Add connector using CLI
aloma connector add <connector-id> -n "My HubSpot Integration"

# List workspace connectors
aloma connector list

# Show connector details
aloma connector show <connector-instance-id>
```

#### Deploy File Configuration

Configure connectors in your `deploy.yaml`:

```yaml
workspaces:
  - name: "Sales Automation"
    
    connectors:
      # API Key connector
      - connectorName: "hubspot.com (private)"
        config:
          apiToken: "your-hubspot-api-token"
      
      # OAuth connector (configure after deployment)
      - connectorName: "Google Sheets"
      
      # Multiple auth methods
      - connectorName: "slack.com"
      
      # Custom configuration
      - connectorName: "E-Mail (SMTP - OAuth)"
        name: "Company Email Service"
        namespace: "companyEmail"
      
      # AI service connector
      - connectorName: "Perplexity"
        config:
          apiKey: "your-perplexity-api-key"
```

#### Authentication Configuration

Complete authentication setup after deployment:

```bash
# OAuth connectors require browser authorization
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <slack-connector-id>

# View connector status
aloma connector show <connector-id>s
```

### Using Connectors in Steps

#### Basic Connector Usage

Access connectors through the `connectors` namespace in your steps:

```javascript
export const condition = {
  customer: {
    email: String,
    name: String
  }
};

export const content = async () => {
  console.log('Creating HubSpot contact...');
  
  // Create contact in HubSpot
  const hubspotResponse = await connectors.hubspotCom.request({
    url: '/crm/v3/objects/contacts',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: data.customer.name.split(' ')[0],
          lastname: data.customer.name.split(' ').slice(1).join(' '),
          email: data.customer.email,
          lead_source: 'automation'
        }
      })
    }
  });
  
  data.customer.hubspotId = hubspotResponse.id;
  data.customer.crmCreated = true;
  
  console.log(`HubSpot contact created: ${hubspotResponse.id}`);
};
```

#### Connector Patterns

**Request-Response Pattern**

Most connectors use the standard request pattern:

```javascript
export const condition = {
  order: {
    id: String,
    total: Number
  }
};

export const content = async () => {
  // Standard API request pattern
  const response = await connectors.hubspotCom.request({
    url: '/crm/v3/objects/deals',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          dealname: `Order ${data.order.id}`,
          amount: data.order.total,
          dealstage: 'contractsent',
          pipeline: 'default'
        }
      })
    }
  });
  
  data.order.dealId = response.id;
  data.order.hubspotDealCreated = true;
};
```

**Simple Action Pattern**

Some connectors provide simplified action methods:

```javascript
export const condition = {
  notification: {
    channel: String,
    message: String
  }
};

export const content = async () => {
  // Simplified Slack messaging
  await connectors.slackCom.send({
    channel: data.notification.channel,
    text: data.notification.message,
    username: 'ALOMA Bot',
    icon_emoji: ':robot_face:'
  });
  
  data.notification.sent = true;
  data.notification.sentAt = new Date().toISOString();
};
```

**Specialized Service Pattern**

Connectors for specialized services provide domain-specific methods:

```javascript
export const condition = {
  email: {
    to: String,
    subject: String,
    body: String
  }
};

export const content = async () => {
  // Email connector with rich formatting
  await connectors.eMailSmtpOAuth.send({
    from: 'noreply@company.com',
    to: data.email.to,
    subject: data.email.subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to Our Service</h2>
        <p>${data.email.body}</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0;">
          <p><em>This email was sent automatically by ALOMA.</em></p>
        </div>
      </div>
    `,
    attachments: data.email.attachments || []
  });
  
  data.email.sent = true;
  data.email.sentAt = new Date().toISOString();
};
```

### Popular Cloud Connectors

#### HubSpot CRM Integration

Comprehensive CRM automation with HubSpot:

```javascript
export const condition = {
  lead: {
    email: String,
    company: String,
    source: String
  }
};

export const content = async () => {
  console.log('Processing lead through HubSpot...');
  
  // Create or update contact
  const contactData = {
    properties: {
      firstname: data.lead.firstName,
      lastname: data.lead.lastName,
      email: data.lead.email,
      company: data.lead.company,
      lead_source: data.lead.source,
      lifecyclestage: 'lead'
    }
  };
  
  try {
    const contact = await connectors.hubspotCom.request({
      url: '/crm/v3/objects/contacts',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      }
    });
    
    data.lead.hubspotContactId = contact.id;
    data.lead.hubspotCreated = true;
    
  } catch (error) {
    if (error.message.includes('409')) {
      // Contact exists, update instead
      const searchResponse = await connectors.hubspotCom.request({
        url: '/crm/v3/objects/contacts/search',
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: data.lead.email
              }]
            }]
          })
        }
      });
      
      if (searchResponse.results.length > 0) {
        const contactId = searchResponse.results[0].id;
        
        await connectors.hubspotCom.request({
          url: `/crm/v3/objects/contacts/${contactId}`,
          options: {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
          }
        });
        
        data.lead.hubspotContactId = contactId;
        data.lead.hubspotUpdated = true;
      }
    } else {
      throw error;
    }
  }
  
  console.log(`HubSpot processing complete: ${data.lead.hubspotContactId}`);
};
```

#### Slack Team Communication

Automated team notifications and communication:

```javascript
export const condition = {
  alert: {
    level: String,
    message: String,
    source: String
  }
};

export const content = async () => {
  // Determine channel and formatting based on alert level
  let channel, color, emoji;
  
  switch (data.alert.level) {
    case 'critical':
      channel = '#alerts-critical';
      color = 'danger';
      emoji = '🚨';
      break;
    case 'warning':
      channel = '#alerts-warning';
      color = 'warning';
      emoji = '⚠️';
      break;
    case 'info':
      channel = '#alerts-info';
      color = 'good';
      emoji = 'ℹ️';
      break;
    default:
      channel = '#general';
      color = 'good';
      emoji = '📢';
  }
  
  // Send rich notification
  await connectors.slackCom.send({
    channel: channel,
    username: 'ALOMA Alert System',
    icon_emoji: ':robot_face:',
    attachments: [{
      color: color,
      title: `${emoji} ${data.alert.level.toUpperCase()} Alert`,
      text: data.alert.message,
      fields: [
        {
          title: 'Source',
          value: data.alert.source,
          short: true
        },
        {
          title: 'Time',
          value: new Date().toISOString(),
          short: true
        }
      ]
    }]
  });
  
  data.alert.slackSent = true;
  data.alert.channel = channel;
};
```

#### Email Communication

Professional email automation:

```javascript
export const condition = {
  customer: {
    email: String,
    firstName: String,
    orderConfirmed: true
  }
};

export const content = async () => {
  console.log(`Sending order confirmation to ${data.customer.email}...`);
  
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #343a40; margin: 0;">Order Confirmation</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #495057;">Dear ${data.customer.firstName},</p>
        
        <p style="font-size: 16px; color: #495057;">
          Thank you for your order! We're excited to confirm that your order has been received 
          and is being processed.
        </p>
        
        <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${data.order.id}</p>
          <p><strong>Total:</strong> $${data.order.total}</p>
          <p><strong>Estimated Delivery:</strong> ${data.order.estimatedDelivery}</p>
        </div>
        
        <p style="font-size: 16px; color: #495057;">
          You'll receive another email with tracking information once your order ships.
        </p>
        
        <p style="font-size: 16px; color: #495057;">
          Best regards,<br>
          The Sales Team
        </p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
        This email was sent automatically. Please do not reply to this email.
      </div>
    </div>
  `;
  
  await connectors.eMailSmtpOAuth.send({
    from: 'orders@company.com',
    to: data.customer.email,
    subject: `Order Confirmation - #${data.order.id}`,
    html: emailTemplate,
    attachments: data.order.receiptPdf ? [{
      name: `receipt-${data.order.id}.pdf`,
      content: data.order.receiptPdf,
      contentType: 'application/pdf'
    }] : []
  });
  
  data.customer.confirmationEmailSent = true;
  data.customer.emailSentAt = new Date().toISOString();
  
  console.log('Order confirmation email sent successfully');
};
```

### Advanced Connector Patterns

#### Batch Processing with Rate Limiting

Handle large datasets while respecting API limits:

```javascript
export const condition = {
  contacts: Array,
  syncToHubSpot: true
};

export const content = async () => {
  console.log(`Syncing ${data.contacts.length} contacts to HubSpot...`);
  
  const batchSize = 10; // HubSpot batch limit
  const processedContacts = [];
  
  for (let i = 0; i < data.contacts.length; i += batchSize) {
    const batch = data.contacts.slice(i, i + batchSize);
    
    try {
      // Batch create/update contacts
      const batchInput = {
        inputs: batch.map(contact => ({
          properties: {
            firstname: contact.firstName,
            lastname: contact.lastName,
            email: contact.email,
            company: contact.company
          }
        }))
      };
      
      const batchResponse = await connectors.hubspotCom.request({
        url: '/crm/v3/objects/contacts/batch/create',
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchInput)
        }
      });
      
      // Track successful creations
      batchResponse.results.forEach((result, index) => {
        const originalContact = batch[index];
        processedContacts.push({
          ...originalContact,
          hubspotId: result.id,
          synced: true
        });
      });
      
      console.log(`Batch ${Math.floor(i/batchSize) + 1} completed: ${batchResponse.results.length} contacts`);
      
      // Rate limiting delay
      if (i + batchSize < data.contacts.length) {
        await connectors.utils.sleep({
        milliseconds: 1000
      });
      }
      
    } catch (error) {
      console.error(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
      
      // Mark batch as failed but continue processing
      batch.forEach(contact => {
        processedContacts.push({
          ...contact,
          synced: false,
          error: error.message
        });
      });
    }
  }
  
  data.contacts = processedContacts;
  data.syncResults = {
    total: data.contacts.length,
    successful: processedContacts.filter(c => c.synced).length,
    failed: processedContacts.filter(c => !c.synced).length,
    completedAt: new Date().toISOString()
  };
  
  console.log(`Sync complete: ${data.syncResults.successful}/${data.syncResults.total} contacts synchronized`);
};
```

#### Error Handling and Retry Logic

Implement robust error handling for production workflows:

```javascript
export const condition = {
  apiCall: {
    service: "hubspot",
    operation: String,
    data: Object
  }
};

export const content = async () => {
  const maxRetries = 3;
  let attempt = 0;
  let lastError;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`HubSpot API call attempt ${attempt}/${maxRetries}`);
      
      const response = await connectors.hubspotCom.request({
        url: data.apiCall.endpoint,
        options: {
          method: data.apiCall.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.apiCall.data)
        }
      });
      
      // Success - store result and exit
      data.apiCall.success = true;
      data.apiCall.response = response;
      data.apiCall.completedAt = new Date().toISOString();
      data.apiCall.attempts = attempt;
      
      console.log(`HubSpot API call successful on attempt ${attempt}`);
      return;
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // Check if error is retryable
      if (error.status === 429) {
        // Rate limited - wait longer
        const delay = Math.pow(2, attempt) * 2000; // Exponential backoff
        console.log(`Rate limited. Waiting ${delay}ms before retry...`);
        await connectors.utils.sleep({
          milliseconds: delay
        });
      } else if (error.status >= 500) {
        // Server error - short delay and retry
        const delay = 1000 * attempt;
        console.log(`Server error. Waiting ${delay}ms before retry...`);
        await connectors.utils.sleep({
          milliseconds: delay
        });
      } else {
        // Client error - don't retry
        console.log('Client error - not retrying');
        break;
      }
    }
  }
  
  // All attempts failed
  data.apiCall.success = false;
  data.apiCall.error = lastError.message;
  data.apiCall.attempts = attempt;
  data.apiCall.failedAt = new Date().toISOString();
  
  console.error(`HubSpot API call failed after ${attempt} attempts: ${lastError.message}`);
  
  // Optional: Send alert for persistent failures
  await connectors.slackCom.send({
    channel: '#alerts',
    text: `🚨 HubSpot API integration failing: ${lastError.message}`
  });
};
```

#### Multi-Service Coordination

Coordinate operations across multiple cloud connectors:

```javascript
export const condition = {
  lead: {
    email: String,
    qualified: true
  }
};

export const content = async () => {
  console.log('Processing qualified lead across multiple systems...');
  
  const results = {};
  
  try {
    // 1. Create HubSpot contact
    const hubspotContact = await connectors.hubspotCom.request({
      url: '/crm/v3/objects/contacts',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            firstname: data.lead.firstName,
            lastname: data.lead.lastName,
            email: data.lead.email,
            lead_source: 'qualified_automation'
          }
        })
      }
    });
    
    results.hubspot = { success: true, contactId: hubspotContact.id };
    
    // 2. Log to Google Sheets
    await connectors.googleSheets.appendRows({
      spreadsheetId: task.config('LEADS_SHEET_ID'),
      range: 'Qualified Leads!A:D',
      values: [[
        new Date().toISOString(),
        data.lead.firstName + ' ' + data.lead.lastName,
        data.lead.email,
        hubspotContact.id
      ]]
    });
    
    results.googleSheets = { success: true };
    
    // 3. Send Slack notification
    await connectors.slackCom.send({
      channel: '#sales-qualified-leads',
      text: `🎯 New qualified lead: ${data.lead.firstName} ${data.lead.lastName} (${data.lead.email})\nHubSpot ID: ${hubspotContact.id}`
    });
    
    results.slack = { success: true };
    
    // 4. Send welcome email
    await connectors.eMailSmtpOAuth.send({
      from: 'sales@company.com',
      to: data.lead.email,
      subject: 'Welcome! Our sales team will be in touch',
      html: `
        <p>Hi ${data.lead.firstName},</p>
        <p>Thank you for your interest in our product. A member of our sales team will reach out to you within 24 hours to schedule a demo.</p>
        <p>Best regards,<br>The Sales Team</p>
      `
    });
    
    results.email = { success: true };
    
    // All operations successful
    data.lead.processed = true;
    data.lead.hubspotId = hubspotContact.id;
    data.lead.results = results;
    data.lead.processedAt = new Date().toISOString();
    
    console.log('Lead successfully processed across all systems');
    
  } catch (error) {
    console.error('Multi-service processing failed:', error.message);
    
    data.lead.processed = false;
    data.lead.error = error.message;
    data.lead.partialResults = results;
    
    // Alert operations team
    await connectors.slackCom.send({
      channel: '#alerts',
      text: `🚨 Lead processing failed for ${data.lead.email}: ${error.message}`
    });
  }
};
```

### Connector Management and Monitoring

#### CLI Management Commands

Essential commands for connector lifecycle management:

```bash
# List all available connectors
aloma connector list-available

# Add connector to workspace
aloma connector add <connector-id> -n "Production HubSpot"

# View workspace connectors
aloma connector list

# Show detailed connector information
aloma connector show <instance-id>

# Configure OAuth authentication
aloma connector oauth <instance-id>

# View connector logs
aloma connector logs <instance-id>

# Update connector configuration
aloma connector update <instance-id> -n "Updated Name"

# Remove connector from workspace
aloma connector delete <instance-id>
```

#### Monitoring and Troubleshooting

Debug connector issues effectively:

```javascript
export const condition = {
  debug: { connector: "hubspot" }
};

export const content = async () => {
  // Test connector connectivity
  try {
    const testResponse = await connectors.hubspotCom.request({
      url: '/crm/v3/objects/contacts?limit=1',
      options: { method: 'GET' }
    });
    
    console.log('HubSpot connector test successful');
    console.log('Response sample:', JSON.stringify(testResponse, null, 2));
    
    data.debug.hubspotConnectivity = true;
    data.debug.sampleResponse = testResponse;
    
  } catch (error) {
    console.error('HubSpot connector test failed:', error.message);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    data.debug.hubspotConnectivity = false;
    data.debug.error = {
      message: error.message,
      status: error.status,
      details: error.response || {}
    };
  }
};
```

Cloud connectors are the foundation of powerful ALOMA automations. By mastering these patterns and understanding the authentication flows, error handling, and rate limiting considerations, you can build robust integrations that scale with your business needs while maintaining reliability and performance.
