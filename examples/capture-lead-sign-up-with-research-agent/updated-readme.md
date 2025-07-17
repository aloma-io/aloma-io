# Capture Lead Sign-up with Research Agent

**Automates the complete lead capture process from signup to team notification with AI-powered research.**

## Table of Contents

- [Quick Deploy](#quick-deploy)
- [What This Workflow Does](#what-this-workflow-does)
- [Workflow Steps](#workflow-steps)
- [Development Options](#development-options)
  - [CLI Development (Recommended)](#cli-development-recommended)
  - [Web UI Development](#web-ui-development)
- [Configuration](#configuration)
- [Sample Task](#sample-task)
- [Setup Instructions](#setup-instructions)
- [CLI Commands Reference](#cli-commands-reference)
- [Customization](#customization)
- [File Structure](#file-structure)
- [Related Workflows](#related-workflows)
- [Troubleshooting](#troubleshooting)
- [ALOMA Ecosystem](#aloma-ecosystem)
- [Support](#support)

## Quick Deploy

```bash
# Clone and navigate to the workflow
git clone https://github.com/aloma-io/aloma-io.git
cd aloma-io/examples/capture-lead-sign-up-with-research-agent

# Deploy to your ALOMA workspace
aloma deploy deploy.yaml
```

**Prerequisites:** HubSpot, Google Sheets, Slack, Perplexity AI accounts, plus email service (Gmail/Outlook)

## What This Workflow Does

Transforms raw lead signups into enriched contacts with automated team notifications and AI research. Perfect for SaaS companies wanting to qualify and engage leads immediately using ALOMA's code-first automation platform.

**Key Features:**
- Automatic CRM contact creation with duplicate handling
- Personalized welcome emails with AI-generated content
- Real-time team notifications via Slack
- AI-powered prospect research using Perplexity
- Centralized data logging in Google Sheets
- Conditional execution ensuring proper step ordering

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| `add_contact_to_hubspot` | `$via.name = "Webform"` | Creates contact in HubSpot CRM |
| `add_to_google_sheet` | `hubspotCreate = true` | Logs contact data to spreadsheet |
| `send_email_for_new_contact` | `googleAdded = true` | Sends personalized welcome email |
| `post_to_slack_when_new_contact` | `emailSent = true` | Notifies team in Slack channel |
| `cto_research` | `jobTitle = "CTO" AND hubspotCreate = true` | AI research for CTO prospects |
| `update_hubspot_with_cto_research` | `contactResearch = String` | Updates CRM with research findings |

## Development Options

### CLI Development (Recommended)

This workflow is designed for CLI-first development using your preferred IDE and tools.

#### Initial Setup
```bash
# Install ALOMA CLI
npm install -g @aloma.io/aloma

# Setup and authenticate
aloma setup
aloma auth

# Switch to your target workspace
aloma workspace list
aloma workspace switch <workspace-name>
```

#### Setup Instructions

**1. API Credentials**
- **HubSpot**: Create Private App in Settings → Integrations with contacts:write permissions
- **Perplexity**: Get API key from https://www.perplexity.ai/settings/api
- **Google Sheets**: Create spreadsheet and note the ID from URL
- **Slack**: Get channel ID by right-clicking channel → Copy channel ID

**2. API Keys and Environment Variables**

Configure required credentials:

| File/Location | Variable/Key | Value | Notes |
|---------------|-------------|--------|--------|
| `connector/connector-hubspot.json` | `apiToken` | HubSpot Private App Token | Requires contacts:write permission |
| `connector/connector-perplexity.json` | `apiKey` | Perplexity API Key | From perplexity.ai settings |
| `deploy.yaml` secrets | `HUBSPOT_ACCOUNT_ID` | Your HubSpot Account ID | Found in HubSpot Settings → Account Setup |
| `deploy.yaml` secrets | `WAIT_LIST_SPREADSHEET` | Google Sheet ID | Extract from sheet URL |
| `deploy.yaml` secrets | `SLACK_CHANNEL` | Slack Channel ID | Right-click channel → Copy channel ID |

**3. Deploy and Configure**
```bash
# Deploy all resources
aloma deploy deploy.yaml

# List deployed connectors
aloma connector list

# Configure OAuth for connectors requiring it
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <email-smtp-connector-id>  
aloma connector oauth <slack-connector-id>
```

**4. Test the Workflow**
```bash
# Create test task
aloma task new "test signup" -f task/test_waitlist.json

# Monitor execution in real-time
aloma task list --watch

# View detailed execution logs
aloma task log <task-id> --logs --changes
```

#### Complete CLI Workflow
```bash
# 1. Pull existing steps (if any)
aloma step pull

# 2. Set up connectors with configuration files
# Update connector files with API keys per table above
# Update deploy.yaml with environment variables per table above

# 3. Deploy the complete workflow
aloma deploy deploy.yaml

# 4. Configure OAuth for connectors requiring it
aloma connector list
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <email-smtp-connector-id>  
aloma connector oauth <slack-connector-id>

# 5. Test with sample data
aloma task new "test signup" -f task/test_waitlist.json

# 6. Monitor task execution
aloma task list --state processing
aloma task log <task-id> --logs --changes

# 7. Make modifications and sync
# Edit step files in your IDE
aloma step sync

# 8. Deploy configuration updates
aloma deploy deploy.yaml
```

#### CLI Development Workflow
```bash
# Daily development cycle
aloma step pull                    # Get latest from workspace
# Edit steps in your preferred IDE
aloma step sync                    # Push changes to workspace
aloma task new "test" -f task/test_waitlist.json  # Test changes
aloma task log <task-id> --logs    # Debug if needed
```

**CLI Documentation:** [Complete CLI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

### Web UI Development

This workflow can be built entirely using ALOMA's web-based IDE without any local development tools.

#### Accessing the Web UI
1. Go to [home.aloma.io](https://home.aloma.io)
2. Login to your ALOMA account
3. Navigate to your target workspace

#### Complete Web UI Workflow

**Step 1: Set up Connectors**
1. Go to **Settings → Integrations**
2. Click the **Connectors** tab
3. Click **Manage** to add connectors
4. Add these connectors one by one:
   - **HubSpot** - Add connector, configure with API token
   - **Google Sheets** - Add connector, complete OAuth authorization
   - **Slack** - Add connector, complete OAuth authorization  
   - **Perplexity AI** - Add connector, configure with API key
   - **Email (SMTP - OAuth)** - Add connector, complete OAuth authorization

**Step 2: Configure Environment Variables**
1. Go to **Settings → Environment Variables/Secrets**
2. Click **Add** for each required variable:

| Variable Name | Value | Notes |
|---------------|--------|--------|
| `HUBSPOT_ACCOUNT_ID` | Your HubSpot Account ID | Found in HubSpot Settings → Account Setup |
| `WAIT_LIST_SPREADSHEET` | Google Sheet ID | Extract from sheet URL |
| `SLACK_CHANNEL` | Slack Channel ID | Right-click channel → Copy channel ID |

**Step 3: Create Steps**
Use **Add New Step** to create each step with the following details:

1. **Step: add_contact_to_hubspot**
   - **Condition:**
     ```json
     {
       "$via": {
         "name": "Webform"
       }
     }
     ```
   - **Code:** Copy from `step/add_contact_to_hubspot.js`

2. **Step: add_to_google_sheet**
   - **Condition:**
     ```json
     {
       "hubspotCreate": true
     }
     ```
   - **Code:** Copy from `step/add_to_google_sheet.js`

3. **Step: send_email_for_new_contact**
   - **Condition:**
     ```json
     {
       "googleAdded": true
     }
     ```
   - **Code:** Copy from `step/send_email_for_new_contact.js`

4. **Step: post_to_slack_when_new_contact**
   - **Condition:**
     ```json
     {
       "emailSent": true
     }
     ```
   - **Code:** Copy from `step/post_to_slack_when_new_contact.js`

5. **Step: cto_research**
   - **Condition:**
     ```json
     {
       "jobTitle": "CTO",
       "hubspotCreate": true
     }
     ```
   - **Code:** Copy from `step/cto_research.js`

6. **Step: update_hubspot_with_cto_research**
   - **Condition:**
     ```json
     {
       "jobTitle": "CTO",
       "hubspotCreate": true,
       "contactResearch": "String"
     }
     ```
   - **Code:** Copy from `step/update_hubspot_with_cto_research.js`

**Step 4: Test the Workflow**
1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test signup"
4. Paste the JSON from `task/test_waitlist.json`
5. Click **Create**
6. Monitor execution in the task timeline
7. Use the **Console** and **Development** tabs to debug

**Step 5: Monitor and Debug**
- View task execution in real-time on the task detail page
- Check **Console** logs for step output
- Use **Changes** tab to see data modifications
- Click step names to edit conditions or code
- Use the lightning bolt icon to re-trigger steps

**Web UI Documentation:** [Complete Web UI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/web-UI)

## Configuration

### Required Connectors

Configure these connectors with the specified authentication methods (click product names for developer documentation):

- **[HubSpot](https://developers.hubspot.com/docs/api/private-apps)** - CRM contact management and lead tracking
- **[Google Sheets](https://developers.google.com/sheets/api/guides/authorizing)** - Centralized contact logging and reporting  
- **[Slack](https://api.slack.com/authentication/oauth-v2)** - Real-time team notifications
- **[Perplexity AI](https://docs.perplexity.ai/docs/getting-started)** - Intelligent prospect research
- **[Email (SMTP - OAuth)]()** - Automated welcome emails

## Sample Task

```json
{
  "firstName": "Sarah",
  "lastName": "Chen", 
  "fullName": "Sarah Chen",
  "email": "sarah.chen@techcorp.com",
  "company": "TechCorp",
  "phone": "+1-555-0123",
  "jobTitle": "CTO",
  "message": "Interested in automating our workflows",
  "$via": {
    "name": "Webform"
  }
}
```

## Setup Instructions

### 1. API Credentials
- **HubSpot**: Create Private App in Settings → Integrations with contacts:write permissions
- **Perplexity**: Get API key from https://www.perplexity.ai/settings/api
- **Google Sheets**: Create spreadsheet and note the ID from URL
- **Slack**: Get channel ID by right-clicking channel → Copy channel ID

### 2. Deploy and Configure
```bash
# Deploy all resources
aloma deploy deploy.yaml

# List deployed connectors
aloma connector list

# Configure OAuth for connectors requiring it
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <email-smtp-connector-id>  
aloma connector oauth <slack-connector-id>
```

### 3. Test the Workflow
```bash
# Create test task
aloma task new "test signup" -f task/test_waitlist.json

# Monitor execution in real-time
aloma task list --watch

# View detailed execution logs
aloma task log <task-id> --logs --changes
```

## CLI Commands Reference

### Managing Steps
```bash
# Pull all steps from workspace to local files
aloma step pull

# Sync local step files to workspace
aloma step sync

# List all steps
aloma step list

# View specific step details
aloma step show <step-id>
```

### Managing Connectors
```bash
# List available connector types
aloma connector list-available

# Add a connector
aloma connector add <connector-type-id> -n <name>

# View connector logs
aloma connector logs <connector-id>

# Update connector configuration
aloma connector update <connector-id> -f ./connector/config.json
```

### Managing Tasks
```bash
# Create task from file
aloma task new "signup" -f ./task/test_waitlist.json

# Filter tasks by state
aloma task list --state done
aloma task list --state error

# View task execution details
aloma task log <task-id> --changes --logs
```

## Customization

**Common modifications:**
- **Add qualification logic**: Modify conditions to filter by company size or industry
- **Custom research prompts**: Update the AI prompt in `cto_research.js` for different roles
- **Additional notifications**: Add steps for SMS, Teams, or other communication channels
- **Lead scoring**: Integrate scoring APIs to prioritize high-value prospects
- **Custom email templates**: Modify email content based on prospect data

**Example: Add Lead Scoring**
```javascript
// In a new step file: step/calculate_lead_score.js
export const condition = { hubspotCreate: true };
export const content = async () => {
  const score = calculateLeadScore(data.company, data.jobTitle);
  data.leadScore = score;
  if (score > 80) data.highPriority = true;
};
```

## File Structure

```
capture-lead-sign-up-with-research-agent/
├── README.md
├── deploy.yaml                    # Complete deployment configuration
├── step/
│   ├── add_contact_to_hubspot.js  # Creates HubSpot contact
│   ├── add_to_google_sheet.js     # Logs to spreadsheet  
│   ├── send_email_for_new_contact.js  # Welcome email
│   ├── post_to_slack_when_new_contact.js  # Slack notification
│   ├── cto_research.js            # AI-powered research
│   └── update_hubspot_with_cto_research.js  # Updates CRM
├── connector/
│   ├── connector-hubspot.json     # HubSpot API config
│   └── connector-perplexity.json  # Perplexity AI config
└── task/
    └── test_waitlist.json         # Sample test data
```

## Related Workflows

- [HubSpot Integration](../hubspot/) - CRM automation and contact management
- View all [Example Workflows](../) - Browse the complete examples library

## Troubleshooting

**Common Issues:**
- **OAuth failures**: Ensure you're logged into correct accounts during setup
- **Missing HubSpot contact**: Check API token permissions include contacts:write
- **Perplexity research not running**: Verify API key and CTO job title matching
- **Email not sending**: Confirm SMTP OAuth is authorized for your email provider
- **Slack notifications missing**: Verify channel ID format and bot permissions

**For CLI users:** See complete [CLI Commands Reference](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI) for debugging commands

## ALOMA Ecosystem

This workflow demonstrates ALOMA's core capabilities:
- **Code-first approach** - All logic in JavaScript, no visual workflow limitations
- **Real-time deployment** - Instant step deployment and testing
- **Parallel execution** - Tasks process independently with automatic scaling
- **Developer-friendly** - Use your preferred IDE and development tools

**Learn More:**
- [ALOMA Getting Started Guide](https://github.com/aloma-io/aloma-io/tree/main/docs/getting-started)
- [Toy Example Tutorial](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md)
- [CLI Documentation](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

## Support

For issues with this workflow:
- [Create an issue](../../issues) in the repository
- Email connector-request@aloma.io for new connector requests
- Check [ALOMA documentation](https://github.com/aloma-io/aloma-io/tree/main/docs) for detailed guides
- Review [Getting Started Guide](../../docs/getting-started) for fundamentals
