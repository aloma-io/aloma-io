# Waitlist Automation Workflow

A comprehensive ALOMA workflow that automatically processes waitlist signups, enriches contact data, and manages multi-channel notifications through Slack, email, and CRM integration.

## What This Workflow Does

This workflow processes incoming waitlist form submissions by:
- Capturing lead information from web forms
- Enriching contact data with company research using AI
- Adding contacts to Google Sheets for tracking
- Creating or updating HubSpot CRM records
- Sending personalized welcome emails
- Notifying the sales team via Slack with enriched data

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| collect_waitlist_data | Webhook received | Captures form submission data and validates required fields |
| enrich_contact_data | firstName exists | Uses AI to research company and enrich contact information |
| add_to_spreadsheet | email exists | Adds contact data to Google Sheets waitlist tracker |
| create_hubspot_contact | email exists | Creates or updates contact in HubSpot CRM |
| send_welcome_email | email exists | Sends personalized welcome email to new subscriber |
| notify_slack | firstName and email exist | Posts enriched contact data to sales Slack channel |

## Prerequisites

### Required Tools
- [ALOMA CLI](https://docs.aloma.io/cli/installation) installed and configured
- Git for repository management

### Required Service Accounts & APIs
- **OpenAI API Key** - For contact data enrichment
- **Google Service Account** - For Google Sheets access with edit permissions
- **HubSpot Private App Token** - With contacts read/write permissions
- **Perplexity API Key** - For company research
- **SMTP Email Account** - For sending welcome emails
- **Slack Webhook or Bot Token** - For team notifications

### Additional Requirements
- Google Sheets document for waitlist tracking
- HubSpot account with API access
- Slack workspace with channel for notifications

## Setup Instructions

### 1. Repository Setup
```bash
git clone [your-repository-url]
cd waitlist-automation
```

### 2. Configure Services

Update the `deploy.yaml` file with your credentials:

```yaml
connectors:
  - connectorName: "openai.com"
    config:
      apiKey: "sk-your-openai-api-key"
  
  - connectorName: "Google Sheets"
    config:
      googleServiceAccountKey: |
        {
          "type": "service_account",
          "project_id": "your-project-id",
          "private_key_id": "your-key-id",
          "private_key": "-----BEGIN PRIVATE KEY-----\n...",
          "client_email": "your-service@project.iam.gserviceaccount.com",
          "client_id": "your-client-id",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token"
        }
  
  - connectorName: "hubspot.com (private)"
    config:
      apiToken: "pat-na1-your-hubspot-token"
  
  - connectorName: "Perplexity"
    config:
      apiKey: "pplx-your-perplexity-key"
  
  - connectorName: "E-Mail (SMTP)"
    config:
      smtpHost: "smtp.gmail.com"
      smtpUser: "your-email@gmail.com"
      smtpPassword: "your-app-password"
  
  - connectorName: "slack.com (slack)"
    config:
      mapping: "your-slack-webhook-url-or-bot-token"

secrets:
  - name: "WAIT_LIST_SPREADSHEET"
    value: "your-google-sheets-id-from-url"
    description: "Google Sheets ID for waitlist tracking"
    encrypted: false
```

### 3. Deploy the Workflow
```bash
aloma deploy deploy.yaml
```

### 4. Configure Webhook
After deployment, configure your webform to send POST requests to:
```
https://api.aloma.io/webhooks/[your-webhook-id]
```

### 5. Test the Setup
Create a test task:
```bash
aloma task new "Test Waitlist Signup" -f task/example.json
```

## Development Options

### CLI Development

#### View Workflow Status
```bash
aloma workspace list
aloma step list
aloma task list --status running
```

#### Test Individual Steps
```bash
# Test with example data
aloma task new "Development Test" -f task/example.json

# Monitor execution
aloma task logs [task-id]

# Debug specific steps
aloma step logs collect_waitlist_data
```

#### Update and Redeploy
```bash
# After making changes to step files
aloma deploy deploy.yaml

# Check deployment status
aloma deployment status
```

### Web UI Development

#### 1. Access ALOMA Dashboard
- Navigate to [https://app.aloma.io](https://app.aloma.io)
- Log in to your account
- Select "Waitlist automation" workspace

#### 2. Monitor Workflow Execution
- Click on "Tasks" tab to view all executions
- Select individual tasks to see step-by-step execution
- Use "Logs" section to debug issues

#### 3. Edit Workflow Steps
- Navigate to "Steps" section
- Click on any step name to view/edit code
- Use "Test Step" button to run individual steps
- Click "Save & Deploy" to update the workflow

#### 4. Manage Connectors
- Go to "Connectors" section
- Click "Test Connection" to verify API integrations
- Update credentials as needed
- View usage statistics and rate limits

#### 5. Configure Webhooks
- Access "Webhooks" section
- Copy webhook URL for form integration
- View incoming webhook payloads
- Test webhook delivery

#### 6. Analytics and Monitoring
- Use "Analytics" dashboard to track workflow performance
- Set up alerts for failed executions
- Monitor API usage and costs
- Export execution data for analysis

## Workflow Steps Summary

1. **Collect Waitlist Data** - Receives and validates form submissions from website
2. **Enrich Contact Data** - Uses AI to research the contact's company and role
3. **Add to Spreadsheet** - Logs contact information in Google Sheets for tracking
4. **Create HubSpot Contact** - Adds or updates contact in CRM system
5. **Send Welcome Email** - Delivers personalized welcome message to subscriber
6. **Notify Slack** - Alerts sales team with enriched contact information

## Configuration Details

### Required Form Fields
Your webform should include these fields:
- `firstName` (required)
- `lastName` (required) 
- `email` (required)
- `company` (optional)
- `jobTitle` (optional)
- `phone` (optional)
- `questions` (optional)

### Google Sheets Setup
Create a Google Sheet with these columns:
- Timestamp
- First Name
- Last Name
- Email
- Company
- Job Title
- Phone
- Questions
- Enriched Data

### HubSpot Configuration
Ensure your HubSpot private app has permissions for:
- Read contacts
- Write contacts
- Read companies
- Write companies

### Email Templates
The workflow sends HTML emails with your branding. Customize the email template in the `send_welcome_email` step.

## Troubleshooting

### Common Issues

**Webhook not triggering:**
- Verify webhook URL is correct
- Check that form is sending POST requests
- Ensure Content-Type is application/json

**Google Sheets errors:**
- Verify service account has edit access to the sheet
- Check that WAIT_LIST_SPREADSHEET secret contains correct sheet ID
- Ensure sheet exists and has proper column headers

**HubSpot integration issues:**
- Confirm API token has required scopes
- Check rate limiting (100 requests per 10 seconds)
- Verify contact properties exist in HubSpot

**Email delivery problems:**
- Check SMTP credentials and app passwords
- Verify sender email is authenticated
- Monitor for spam filter issues

## Support

For technical support and documentation:
- [ALOMA Documentation](https://docs.aloma.io)
- [API Reference](https://docs.aloma.io/api)
- Support: [support@aloma.io](mailto:support@aloma.io)
