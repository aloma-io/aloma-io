# Email Newsletter Automation Example

## Email Newsletter Automation Example

Now let's build something with real integrations. We'll create an automation that processes newsletter signups using Gmail and Google Sheets - services most developers have access to without any additional costs.

### What You'll Build

An automation that:

* Validates email addresses from newsletter signups
* Adds valid subscribers to a Google Sheets spreadsheet
* Sends personalized welcome emails via Gmail
* Completes onboarding with proper tracking
* Demonstrates real-world connector usage

### Prerequisites Setup

You'll need access to:

* Gmail account (free)
* Google Sheets (free)
* ALOMA CLI installed and authenticated

### Step 1: Project Setup

bash

```bash
# Create new workspace for newsletter automation
aloma workspace add "Newsletter Automation" --tags "newsletter,email,production"
aloma workspace switch "Newsletter Automation"

# Create project directory
mkdir newsletter-automation && cd newsletter-automation
```

### Step 2: Configure Connectors

Create a deployment file to set up integrations:

yaml

```yaml
# deploy.yaml
workspaces:
  - name: "Newsletter Automation"
    
    connectors:
      - connectorName: "Google Sheets"
      - connectorName: "E-Mail (SMTP - OAuth)"
    
    steps:
      - syncPath: "steps/"
    
    secrets:
      - name: "NEWSLETTER_SHEET_ID"
        value: "your-google-sheet-id"
        description: "Google Sheets ID for newsletter subscribers"
        encrypted: false
      - name: "FROM_EMAIL"
        value: "newsletter@yourdomain.com"
        description: "Email address for sending newsletters"
        encrypted: false
```

bash

```bash
# Deploy the workspace configuration
aloma deploy deploy.yaml
```

### Step 3: Complete OAuth Setup

bash

```bash
# List available connectors
aloma connector list

# Configure OAuth for Google Sheets
aloma connector oauth <google-sheets-connector-id>

# Configure OAuth for email
aloma connector oauth <email-connector-id>
```

Follow the OAuth flows to authorize ALOMA access to your Google account.

### Step 4: Create Newsletter Steps

Create the steps directory and add your automation logic:

bash

```bash
mkdir steps
```

#### Step 1: Email Validation

**steps/validate\_email.js**

javascript

```javascript
export const condition = {
  subscriber: {
    email: String,
    source: "newsletter_form"
  }
};

export const content = async () => {
  console.log('Validating email:', data.subscriber.email);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(data.subscriber.email);
  
  if (isValid) {
    data.subscriber.emailValid = true;
    data.subscriber.validatedAt = new Date().toISOString();
    console.log('Email validation passed');
  } else {
    data.subscriber.emailValid = false;
    data.subscriber.error = "Invalid email format";
    console.log('Email validation failed');
    task.complete(); // Stop processing invalid emails
  }
};
```

#### Step 2: Add to Spreadsheet

**steps/add\_to\_spreadsheet.js**

javascript

```javascript
export const condition = {
  subscriber: {
    emailValid: true,
    email: String
  }
};

export const content = async () => {
  console.log('Adding subscriber to spreadsheet...');
  
  const sheetId = task.config('NEWSLETTER_SHEET_ID');
  
  try {
    // Add subscriber to Google Sheets
    await connectors.googleSheets.append({
      spreadsheetId: sheetId,
      range: 'Subscribers!A:D',
      values: [[
        data.subscriber.email,
        data.subscriber.name || '',
        new Date().toISOString(),
        data.subscriber.source || 'unknown'
      ]]
    });
    
    data.subscriber.addedToSheet = true;
    data.subscriber.addedAt = new Date().toISOString();
    console.log('Successfully added to spreadsheet');
    
  } catch (error) {
    console.error('Failed to add to spreadsheet:', error);
    data.subscriber.error = error.message;
  }
};
```

#### Step 3: Send Welcome Email

**steps/send\_welcome\_email.js**

javascript

```javascript
export const condition = {
  subscriber: {
    addedToSheet: true,
    email: String
  }
};

export const content = async () => {
  console.log('Sending welcome email to:', data.subscriber.email);
  
  const fromEmail = task.config('FROM_EMAIL');
  
  try {
    await connectors.eMailSmtpOAuth.send({
      from: fromEmail,
      to: data.subscriber.email,
      subject: 'Welcome to Our Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Newsletter!</h2>
          <p>Hi ${data.subscriber.name || 'there'},</p>
          <p>Thank you for subscribing to our newsletter. You'll receive updates on:</p>
          <ul>
            <li>Product announcements</li>
            <li>Industry insights</li>
            <li>Exclusive content</li>
          </ul>
          <p>Best regards,<br>The Newsletter Team</p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            You can unsubscribe at any time by replying to this email.
          </p>
        </div>
      `
    });
    
    data.subscriber.welcomeEmailSent = true;
    data.subscriber.emailSentAt = new Date().toISOString();
    console.log('Welcome email sent successfully');
    
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    data.subscriber.emailError = error.message;
  }
};
```

#### Step 4: Complete Onboarding

**steps/complete\_onboarding.js**

javascript

```javascript
export const condition = {
  subscriber: {
    addedToSheet: true,
    welcomeEmailSent: true
  }
};

export const content = async () => {
  console.log('Completing subscriber onboarding...');
  
  data.subscriber.status = "active";
  data.subscriber.onboardedAt = new Date().toISOString();
  
  // Add completion metrics
  data.completion = {
    totalSteps: 4,
    successfulSteps: 4,
    processingTime: new Date() - new Date(data.subscriber.createdAt),
    success: true
  };
  
  console.log(`Subscriber ${data.subscriber.email} successfully onboarded!`);
  task.complete();
};
```

### Step 5: Deploy and Test

bash

```bash
# Sync your steps to ALOMA
aloma step sync

# Test with a sample subscriber
aloma task new "newsletter signup test" -d '{
  "subscriber": {
    "email": "test@example.com",
    "name": "Test User",
    "source": "newsletter_form",
    "createdAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
  }
}'

# Monitor execution
aloma task list
aloma task log <task-id> --logs --changes
```

### Step 6: Set Up Real Integration

To connect this to a real form, you'll need a webhook:

bash

```bash
# Create a webhook to receive form submissions
aloma webhook add "Newsletter Form Submissions"
aloma webhook list
```

Use the webhook URL in your form to automatically create tasks when people subscribe.

#### HTML Form Example

html

```html
<form action="https://connect.aloma.io/event/your-webhook-id" method="POST">
  <div>
    <label for="email">Email Address:</label>
    <input type="email" name="subscriber[email]" id="email" required>
  </div>
  <div>
    <label for="name">Name (optional):</label>
    <input type="text" name="subscriber[name]" id="name">
  </div>
  <input type="hidden" name="subscriber[source]" value="newsletter_form">
  <input type="hidden" name="subscriber[createdAt]" id="timestamp">
  <button type="submit">Subscribe</button>
</form>

<script>
document.getElementById('timestamp').value = new Date().toISOString();
</script>
```

### Understanding the Integration Example

**Real Connectors**: This example uses actual Gmail and Google Sheets APIs through ALOMA's managed connectors.

**OAuth Handling**: ALOMA handles the OAuth flow and token management automatically - you just complete it once.

**Error Handling**: Each step includes proper error handling and logging for production use.

**Conditional Flow**: Steps only run when their prerequisites are met, creating a robust pipeline that handles failures gracefully.

**Production Ready**: This pattern scales to handle thousands of subscribers automatically without infrastructure management.

**Cost Effective**: Uses free Google services for learning, but the same patterns work with enterprise systems.

### Parallel Processing in Action

Notice how this automation naturally handles parallel processing:

1. **Email validation** runs first (required for everything)
2. **Spreadsheet addition** and **email sending** could run in parallel if you modify the conditions
3. **Completion** waits for both prerequisites

To enable parallel processing, modify the email step condition:

javascript

```javascript
// Allow email sending as soon as validation passes
export const condition = {
  subscriber: {
    emailValid: true,
    email: String
  }
};
```

### Adding More Features

You can extend this automation easily by adding new steps:

* **Duplicate detection**: Check if email already exists before adding
* **Segmentation**: Tag subscribers based on signup source
* **Welcome series**: Send multiple emails over time
* **Analytics**: Track open rates and engagement
* **CRM integration**: Sync with HubSpot or Salesforce

Each new feature is just a new step with appropriate conditions - no workflow redesign required.

### Next Steps

You've now built a real automation with external integrations. This demonstrates how ALOMA's conditional execution scales from simple examples to production systems.

**Ready to master the paradigm?** Read [Understanding Conditional Steps](https://claude.ai/chat/understanding-conditional-steps.md) to learn advanced patterns.

**Want to see enterprise examples?** Check out our [Examples & Tutorials](https://claude.ai/examples-tutorials/) for complex real-world implementations.

**Ready for production deployment?** Explore our [Development Guide](https://claude.ai/development-guide/) for CLI workflows, version control, and deployment strategies.

\
