**Automates the complete lead capture process from signup to team notification with AI-powered research.**

## What This Workflow Does

Transforms raw lead signups into enriched contacts with automated team notifications and AI research. Perfect for SaaS companies wanting to qualify and engage leads immediately using ALOMA's code-first automation platform.

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| `add_contact_to_hubspot` | `$via.name = "Webform"` | Creates contact in HubSpot CRM |
| `add_to_google_sheet` | `hubspotCreate = true` | Logs contact data to spreadsheet |
| `send_email_for_new_contact` | `googleAdded = true` | Sends personalized welcome email |
| `post_to_slack_when_new_contact` | `emailSent = true` | Notifies team in Slack channel |
| `cto_research` | `jobTitle = "CTO" AND hubspotCreate = true` | AI research for CTO prospects |
| `update_hubspot_with_cto_research` | `contactResearch = String` | Updates CRM with research findings |

## Prerequisites

- Aloma [CLI installed](https://github.com/aloma-io/aloma-io/tree/main/docs/CLI)
- Access to HubSpot, Google Sheets, Slack, and Perplexity AI accounts
- SMTP email service (Gmail, Outlook, etc.)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/capture-lead-sign-up-with-research-agent
```

### 2. Update Connector Keys/Tokens and Secrets in Deploy File

Edit `deploy.yaml` and update the following secrets with your actual values:

```yaml
connectors:
  - connectorName: "hubspot.com (private)"
    config:
      apiToken: "********"
  - connectorName: "Perplexity"
    config:
      apiKey: "***********"

secrets:
  - name: "HUBSPOT_ACCOUNT_ID"
    value: "your-hubspot-account-id"
    description: "Hubspot account ID"
    encrypted: false
  - name: "WAIT_LIST_SPREADSHEET"
    value: "your-google-sheet-id"
    description: "Google sheet ID"
    encrypted: false
  - name: "SLACK_CHANNEL"
    value: "your-slack-channel-id"
    description: "Slack channel ID"
    encrypted: false
```

To find these values:
- **HUBSPOT_ACCOUNT_ID**: Found in HubSpot Settings → Account Setup → Account ID
- **HubSpot API token**: Go to HubSpot Settings → Integrations → Private apps
- **WAIT_LIST_SPREADSHEET**: The ID from your Google Sheets URL (the long string between /d/ and /edit)
- **SLACK_CHANNEL**: Right-click on your Slack channel → Copy channel ID
- **Perplexity API Key**: From perplexity.ai settings 

### 3. Deploy the Workflow

Run the following command from the `capture-lead-sign-up-with-research-agent` folder:

```bash
aloma deploy deploy.yaml
```

### 4. Complete OAuth Configuration

After deployment, you'll need to configure OAuth for the following connectors:

# List deployed connectors
aloma connector list

# Configure OAuth for connectors requiring it
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <email-smtp-connector-id>  
aloma connector oauth <slack-connector-id>

# Follow the OAuth flow to authorize Slack access

### 5. Test the Workflow

Create a test task to verify everything is working:

1. Run `aloma task new "test waitlist" -f task/test_waitlist.json`
or Create a new task from the app with a JSON payload like the file

2. 
# View detailed execution logs
aloma task log <task-id> --logs --changes
```
**CLI Documentation:** [Complete CLI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

3. Verify that:
   - Contact is added to HubSpot
   - Welcome email is sent
   - Slack notification is posted
   - CTO research is performed
   - HubSpot is updated with research
   - Contact is added to Google Sheets



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
Use **Add New Step** to create each step with the condition and content from the step files

**Step 4: Test the Workflow**
1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test waitlist"
4. Paste the JSON from `task/test_waitlist.json`
5. Click **Create**
6. Monitor execution in the task timeline
7. Use the **Console** and **Development** tabs to debug

**Web UI Documentation:** [Complete Web UI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/web-UI)

## Workflow Steps

1. **Add contact to HubSpot**: Creates a new contact in your HubSpot CRM
2. **Send email for new contact**: Sends a welcome email to the new contact
3. **Post to Slack**: Notifies your team about the new contact
4. **CTO research**: Uses Perplexity AI to research the contact's company and CTO
5. **Update HubSpot with CTO research**: Adds research findings to the contact record
6. **Add to Google Sheets**: Logs the contact information in a spreadsheet

## Support

If you encounter issues, check the Aloma documentation or contact support.
