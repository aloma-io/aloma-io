# Customer on-boarding Pipeline

## Customer Onboarding Pipeline

**A complete SaaS customer onboarding automation that demonstrates ALOMA's conditional execution model through email validation, customer type detection, account provisioning, and multi-channel communications.**

### Business Context

CloudCorp, a SaaS platform provider, processes hundreds of new user registrations daily. Their traditional webhook-to-CRM workflow was rigid and failed to handle the complexity of different customer types, validation failures, and personalized onboarding paths.

With ALOMA's conditional execution, CloudCorp transformed their onboarding into an intelligent, self-organizing system that adapts to each customer's profile and handles edge cases gracefully.

### The Traditional Approach Problem

Visual workflow tools like n8n or Zapier would require a complex diagram like this:

```
Webhook → Email Validation → IF Valid → Customer Type Detection → IF Enterprise → Provision Premium → Send Enterprise Email
                           → IF Invalid → Send Error Email
                                       → IF Individual → Provision Standard → Send Standard Email
```

This becomes exponentially complex as you add:

* Multiple validation types (email, phone, company)
* Different customer tiers (free, paid, enterprise)
* Failure handling at each step
* Parallel processing requirements

### ALOMA's Conditional Solution

Instead of predefined paths, ALOMA uses data-triggered steps that respond to changing task state:

### Initial Task Data

When a new user registers through CloudCorp's signup form:

```json
{
  "user": {
    "email": "sarah.chen@techstartup.io",
    "firstName": "Sarah",
    "lastName": "Chen",
    "company": "TechStartup Inc",
    "jobTitle": "CTO",
    "phone": "+1-555-0123"
  },
  "source": "website_signup",
  "timestamp": "2025-08-18T14:30:00Z",
  "$via": {
    "id": "webhook_signup",
    "name": "Registration Form",
    "type": "webhook"
  }
}
```

### Step 1: Email Validation

**Triggers immediately when user data arrives**

```javascript
export const condition = {
  user: {
    email: String,
    validated: null
  }
};

export const content = async () => {
  console.log('Validating email:', data.user.email);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const formatValid = emailRegex.test(data.user.email);
  
  if (formatValid) {
    // Check against disposable email services
    const domain = data.user.email.split('@')[1];
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    
    if (disposableDomains.includes(domain)) {
      data.user.validationError = "Disposable email addresses not allowed";
      data.user.emailValid = false;
    } else {
      data.user.emailValid = true;
      data.user.validatedAt = new Date().toISOString();
    }
  } else {
    data.user.validationError = "Invalid email format";
    data.user.emailValid = false;
  }
  
  data.user.validated = true;
  console.log('Email validation complete:', data.user.emailValid);
};
```

**Task state after Step 1:**

```json
{
  "user": {
    "email": "sarah.chen@techstartup.io",
    "firstName": "Sarah",
    "lastName": "Chen",
    "company": "TechStartup Inc",
    "jobTitle": "CTO",
    "phone": "+1-555-0123",
    "emailValid": true,
    "validatedAt": "2025-08-18T14:30:05Z",
    "validated": true
  },
  "source": "website_signup",
  "timestamp": "2025-08-18T14:30:00Z"
}
```

### Step 2: Customer Type Detection

**Triggers only after successful email validation**

```javascript
export const condition = {
  user: {
    emailValid: true,
    email: String,
    company: String,
    customerType: null
  }
};

export const content = async () => {
  console.log('Detecting customer type for:', data.user.company);
  
  const domain = data.user.email.split('@')[1];
  
  // Check enterprise domain patterns
  const enterpriseDomains = task.config('ENTERPRISE_DOMAINS').split(',');
  const isEnterpriseDomain = enterpriseDomains.some(entDomain => 
    domain.includes(entDomain)
  );
  
  // Detect company size signals
  const enterpriseJobTitles = ['CTO', 'CEO', 'VP', 'Director', 'Chief'];
  const hasEnterpriseTitle = enterpriseJobTitles.some(title => 
    data.user.jobTitle?.includes(title)
  );
  
  // Determine customer type
  if (isEnterpriseDomain || hasEnterpriseTitle) {
    data.user.customerType = "enterprise";
    data.user.priority = "high";
    data.user.accountManager = "enterprise-team@cloudcorp.com";
    data.user.trialDays = 30;
    data.user.features = ["advanced_analytics", "api_access", "priority_support"];
  } else if (data.user.company && data.user.company !== data.user.firstName) {
    data.user.customerType = "business";
    data.user.priority = "normal";
    data.user.accountManager = "business-team@cloudcorp.com";
    data.user.trialDays = 14;
    data.user.features = ["basic_analytics", "standard_support"];
  } else {
    data.user.customerType = "individual";
    data.user.priority = "normal";
    data.user.accountManager = "support@cloudcorp.com";
    data.user.trialDays = 7;
    data.user.features = ["basic_features"];
  }
  
  data.user.typeDetectedAt = new Date().toISOString();
  console.log('Customer type detected:', data.user.customerType);
};
```

**Task state after Step 2:**

```json
{
  "user": {
    "email": "sarah.chen@techstartup.io",
    "firstName": "Sarah",
    "lastName": "Chen",
    "company": "TechStartup Inc",
    "jobTitle": "CTO",
    "phone": "+1-555-0123",
    "emailValid": true,
    "validatedAt": "2025-08-18T14:30:05Z",
    "validated": true,
    "customerType": "enterprise",
    "priority": "high",
    "accountManager": "enterprise-team@cloudcorp.com",
    "trialDays": 30,
    "features": ["advanced_analytics", "api_access", "priority_support"],
    "typeDetectedAt": "2025-08-18T14:30:08Z"
  },
  "source": "website_signup",
  "timestamp": "2025-08-18T14:30:00Z"
}
```

### Step 3: Account Provisioning

**Triggers after customer type detection, runs in parallel with CRM creation**

```javascript
export const condition = {
  user: {
    customerType: String,
    features: Array,
    accountProvisioned: null
  }
};

export const content = async () => {
  console.log('Provisioning account for:', data.user.email);
  
  try {
    // Create user account in CloudCorp's system
    const account = await connectors.cloudCorpApi.createAccount({
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      company: data.user.company,
      customerType: data.user.customerType,
      features: data.user.features,
      trialDays: data.user.trialDays
    });
    
    data.user.accountId = account.id;
    data.user.accountUrl = `https://app.cloudcorp.com/account/${account.id}`;
    data.user.loginUrl = `https://app.cloudcorp.com/login`;
    data.user.accountProvisioned = true;
    data.user.provisionedAt = new Date().toISOString();
    
    // Set up trial expiration
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + data.user.trialDays);
    data.user.trialEndsAt = trialEnd.toISOString();
    
    console.log('Account provisioned successfully:', data.user.accountId);
    
  } catch (error) {
    console.error('Account provisioning failed:', error.message);
    data.user.provisioningError = error.message;
    data.user.accountProvisioned = false;
    data.user.requiresManualProvisioning = true;
  }
};
```

### Step 4: CRM Integration

**Runs in parallel with account provisioning**

```javascript
export const condition = {
  user: {
    customerType: String,
    priority: String,
    crmCreated: null
  }
};

export const content = async () => {
  console.log('Creating CRM contact for:', data.user.email);
  
  try {
    const crmContact = await connectors.hubspotCom.request({
      url: '/crm/v3/objects/contacts',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            email: data.user.email,
            firstname: data.user.firstName,
            lastname: data.user.lastName,
            company: data.user.company,
            jobtitle: data.user.jobTitle,
            phone: data.user.phone,
            customer_type: data.user.customerType,
            priority: data.user.priority,
            lead_source: data.source,
            trial_days: data.user.trialDays,
            account_manager: data.user.accountManager
          }
        })
      }
    });
    
    data.user.crmId = crmContact.id;
    data.user.crmCreated = true;
    data.user.crmCreatedAt = new Date().toISOString();
    
    console.log('CRM contact created:', data.user.crmId);
    
  } catch (error) {
    if (error.message.includes('409')) {
      console.log('Contact already exists in CRM');
      data.user.crmExists = true;
      data.user.crmCreated = true;
    } else {
      console.error('CRM creation failed:', error.message);
      data.user.crmError = error.message;
      data.user.crmCreated = false;
    }
  }
};
```

### Step 5: Welcome Email Communication

**Waits for both account provisioning and CRM creation to complete**

```javascript
export const condition = {
  user: {
    accountProvisioned: true,
    crmCreated: true,
    customerType: String,
    welcomeEmailSent: null
  }
};

export const content = async () => {
  console.log('Sending welcome email to:', data.user.email);
  
  // Customize email content by customer type
  let emailTemplate, subject;
  
  switch (data.user.customerType) {
    case 'enterprise':
      subject = 'Welcome to CloudCorp Enterprise - Your Account is Ready';
      emailTemplate = `
        <h2>Welcome to CloudCorp Enterprise, ${data.user.firstName}!</h2>
        <p>Your enterprise account has been provisioned with premium features.</p>
        <p><strong>Account Details:</strong></p>
        <ul>
          <li>Trial Period: ${data.user.trialDays} days</li>
          <li>Features: ${data.user.features.join(', ')}</li>
          <li>Account Manager: ${data.user.accountManager}</li>
        </ul>
        <p><a href="${data.user.loginUrl}">Access Your Account</a></p>
        <p>Your dedicated account manager will contact you within 24 hours.</p>
      `;
      break;
      
    case 'business':
      subject = 'Welcome to CloudCorp Business';
      emailTemplate = `
        <h2>Welcome to CloudCorp, ${data.user.firstName}!</h2>
        <p>Your business account is ready with ${data.user.trialDays} days trial.</p>
        <p><a href="${data.user.loginUrl}">Start Your Trial</a></p>
        <p>Questions? Contact us at ${data.user.accountManager}</p>
      `;
      break;
      
    default:
      subject = 'Welcome to CloudCorp';
      emailTemplate = `
        <h2>Welcome to CloudCorp, ${data.user.firstName}!</h2>
        <p>Your ${data.user.trialDays}-day trial is ready.</p>
        <p><a href="${data.user.loginUrl}">Get Started</a></p>
      `;
  }
  
  try {
    await connectors.eMailSmtpOAuth.sendEmail({
      from: 'welcome@cloudcorp.com',
      to: data.user.email,
      subject: subject,
      html: emailTemplate
    });
    
    data.user.welcomeEmailSent = true;
    data.user.welcomeEmailSentAt = new Date().toISOString();
    
    console.log('Welcome email sent successfully');
    
  } catch (error) {
    console.error('Welcome email failed:', error.message);
    data.user.welcomeEmailError = error.message;
    data.user.welcomeEmailSent = false;
  }
};
```

### Step 6: Team Notification

**Notifies the appropriate team based on customer type**

```javascript
export const condition = {
  user: {
    welcomeEmailSent: true,
    customerType: String,
    teamNotified: null
  }
};

export const content = async () => {
  console.log('Sending team notification for:', data.user.customerType);
  
  // Different notifications for different customer types
  let slackChannel, message;
  
  switch (data.user.customerType) {
    case 'enterprise':
      slackChannel = '#enterprise-customers';
      message = `🚀 New Enterprise Customer: ${data.user.firstName} ${data.user.lastName} from ${data.user.company}\n` +
               `Email: ${data.user.email}\n` +
               `Role: ${data.user.jobTitle}\n` +
               `Account ID: ${data.user.accountId}\n` +
               `CRM: ${data.user.crmId}\n` +
               `⚡ Requires immediate follow-up`;
      break;
      
    case 'business':
      slackChannel = '#business-customers';
      message = `💼 New Business Customer: ${data.user.firstName} ${data.user.lastName} from ${data.user.company}\n` +
               `Email: ${data.user.email}\n` +
               `Account ID: ${data.user.accountId}`;
      break;
      
    default:
      slackChannel = '#new-signups';
      message = `👋 New Individual User: ${data.user.firstName} ${data.user.lastName}\n` +
               `Email: ${data.user.email}`;
  }
  
  try {
    await connectors.slackCom.send({
      channel: slackChannel,
      text: message
    });
    
    data.user.teamNotified = true;
    data.user.teamNotifiedAt = new Date().toISOString();
    
    console.log('Team notification sent to:', slackChannel);
    
  } catch (error) {
    console.error('Team notification failed:', error.message);
    data.user.teamNotificationError = error.message;
  }
};
```

### Step 7: Onboarding Complete

**Final step that marks the process complete**

```javascript
export const condition = {
  user: {
    accountProvisioned: true,
    crmCreated: true,
    welcomeEmailSent: true,
    teamNotified: true,
    onboardingComplete: null
  }
};

export const content = async () => {
  console.log('Onboarding complete for:', data.user.email);
  
  // Mark onboarding as complete
  data.user.onboardingComplete = true;
  data.user.completedAt = new Date().toISOString();
  
  // Calculate total onboarding time
  const startTime = new Date(data.timestamp);
  const endTime = new Date();
  const processingTimeMs = endTime - startTime;
  data.user.onboardingDurationMs = processingTimeMs;
  data.user.onboardingDurationSeconds = Math.round(processingTimeMs / 1000);
  
  // Add completion metadata
  data.onboarding = {
    status: "completed",
    customerType: data.user.customerType,
    processingTime: data.user.onboardingDurationSeconds,
    completedSteps: [
      "email_validation",
      "customer_type_detection", 
      "account_provisioning",
      "crm_integration",
      "welcome_email",
      "team_notification"
    ]
  };
  
  console.log(`Onboarding completed in ${data.user.onboardingDurationSeconds} seconds`);
  
  // Set task tags for analytics
  task.tags(['onboarding', 'completed', data.user.customerType, data.source]);
  task.name(`Onboarding: ${data.user.firstName} ${data.user.lastName} (${data.user.customerType})`);
  
  task.complete();
};
```

### Final Task State

```json
{
  "user": {
    "email": "sarah.chen@techstartup.io",
    "firstName": "Sarah",
    "lastName": "Chen",
    "company": "TechStartup Inc",
    "jobTitle": "CTO",
    "phone": "+1-555-0123",
    "emailValid": true,
    "validatedAt": "2025-08-18T14:30:05Z",
    "validated": true,
    "customerType": "enterprise",
    "priority": "high",
    "accountManager": "enterprise-team@cloudcorp.com",
    "trialDays": 30,
    "features": ["advanced_analytics", "api_access", "priority_support"],
    "typeDetectedAt": "2025-08-18T14:30:08Z",
    "accountId": "acc_789xyz",
    "accountUrl": "https://app.cloudcorp.com/account/acc_789xyz",
    "loginUrl": "https://app.cloudcorp.com/login",
    "accountProvisioned": true,
    "provisionedAt": "2025-08-18T14:30:12Z",
    "trialEndsAt": "2025-09-17T14:30:12Z",
    "crmId": "contact_456abc",
    "crmCreated": true,
    "crmCreatedAt": "2025-08-18T14:30:11Z",
    "welcomeEmailSent": true,
    "welcomeEmailSentAt": "2025-08-18T14:30:15Z",
    "teamNotified": true,
    "teamNotifiedAt": "2025-08-18T14:30:16Z",
    "onboardingComplete": true,
    "completedAt": "2025-08-18T14:30:17Z",
    "onboardingDurationMs": 17000,
    "onboardingDurationSeconds": 17
  },
  "source": "website_signup",
  "timestamp": "2025-08-18T14:30:00Z",
  "onboarding": {
    "status": "completed",
    "customerType": "enterprise",
    "processingTime": 17,
    "completedSteps": [
      "email_validation",
      "customer_type_detection",
      "account_provisioning", 
      "crm_integration",
      "welcome_email",
      "team_notification"
    ]
  }
}
```

### Error Handling Example

**What happens when email validation fails:**

```javascript
// Validation error step
export const condition = {
  user: {
    emailValid: false,
    validationError: String,
    errorHandled: null
  }
};

export const content = async () => {
  console.log('Handling validation error:', data.user.validationError);
  
  // Send error notification email
  await connectors.eMailSmtpOAuth.sendEmail({
    from: 'support@cloudcorp.com',
    to: data.user.email,
    subject: 'CloudCorp Account Setup - Action Required',
    html: `
      <h2>Account Setup Issue</h2>
      <p>Hi ${data.user.firstName},</p>
      <p>We encountered an issue with your registration:</p>
      <p><strong>${data.user.validationError}</strong></p>
      <p>Please contact support@cloudcorp.com for assistance.</p>
    `
  });
  
  // Notify support team
  await connectors.slackCom.send({
    channel: '#support-alerts',
    text: `❌ Registration failed for ${data.user.email}: ${data.user.validationError}`
  });
  
  data.user.errorHandled = true;
  data.user.status = "validation_failed";
  
  task.complete();
};
```

### Key Learning Objectives

#### 1. **Conditional Execution vs Rigid Sequences**

**Traditional approach problems:**

* Fixed sequence breaks if any step fails
* Complex branching requires duplicate logic
* Parallel processing requires complex orchestration
* Adding new customer types requires rebuilding entire flow

**ALOMA's solution:**

* Steps execute based on data conditions
* Natural parallelism (steps 3 & 4 run simultaneously)
* Easy to add new steps without modifying existing ones
* Graceful error handling doesn't stop other processes

#### 2. **Self-Organizing Workflow**

Notice how the workflow organically adapts:

* Enterprise customers get immediate high-priority handling
* Individual users follow a simpler path
* Failed steps trigger error handling automatically
* Process completes when all conditions are satisfied

#### 3. **Data-Driven Dependencies**

Instead of drawing connecting lines between workflow boxes:

* Step 2 waits for `emailValid: true`
* Step 5 waits for both `accountProvisioned: true` AND `crmCreated: true`
* Error handling only triggers when `emailValid: false`

#### 4. **Scalable Complexity**

Adding a new customer type requires only:

```javascript
// New step for "startup" customer type
export const condition = {
  user: {
    emailValid: true,
    customerType: null,
    company: String,
    fundingStage: "seed" // New field
  }
};

export const content = async () => {
  data.user.customerType = "startup";
  data.user.priority = "high";
  data.user.features = ["startup_program", "investor_network"];
  data.user.trialDays = 90;
};
```

No need to modify existing steps or redraw workflow diagrams.

### Business Impact

**CloudCorp's results after implementing ALOMA:**

* **90% faster onboarding** (17 seconds vs 15+ minutes)
* **Zero failed sequences** (parallel processing + error handling)
* **50% reduction in support tickets** (better error handling)
* **Easy customization** (new customer types added in minutes)

This example demonstrates how ALOMA's conditional execution transforms complex business processes into maintainable, adaptive automations that scale with your business needs.
