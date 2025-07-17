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

- Aloma [CLI installed](../../CLI/)
- Access to HubSpot, Google Sheets, Slack, and Perplexity AI accounts
- SMTP email service (Gmail, Outlook, etc.)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/capture-lead-sign-up-with-research-agent
```

### 2. Update Connector Keys/Tokens

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

#### HubSpot Connector
Edit `connector/connector-hubspot.json`:
```json
{
  "config": {
    "apiToken": "your-hubspot-api-token"
  }
}
```

To get your HubSpot API token:
1. Go to HubSpot Settings → Integrations → Private apps
2. Create a new Private app or use an existing one
3. Replace `your-hubspot-api-token` with your actual token

#### Perplexity AI Connector
Edit `connector/connector-perplexity.json`:
```json
{
  "config": {
    "apiKey": "your-perplexity-api-key"
  }
}
```

To get your Perplexity API key:
1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Sign up/login and navigate to API settings
3. Generate a new API key
4. Replace `your-perplexity-api-key` with your actual key

### 3. Update Secrets in Deploy File

Edit `deploy.yaml` and update the following secrets with your actual values:

```yaml
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
- **WAIT_LIST_SPREADSHEET**: The ID from your Google Sheets URL (the long string between /d/ and /edit)
- **SLACK_CHANNEL**: Right-click on your Slack channel → Copy channel ID

### 4. Deploy the Workflow

Run the following command from the `waitlist_automation` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Complete OAuth Configuration

After deployment, you'll need to configure OAuth for the following connectors:

#### Google Sheets
1. Run `aloma connector list` to find the "Google Sheets" connector id
2. Run `aloma connector oauth <id>` (replace `<id>` with the actual connector id)
3. Follow the OAuth flow to authorize access to your Google account

#### Email (SMTP - OAuth)
1. Run `aloma connector list` to find the "E-Mail (SMTP - OAuth)" connector id
2. Run `aloma connector oauth <id>` (replace `<id>` with the actual connector id)
3. Follow the OAuth flow for your email provider (Gmail, Outlook, etc.)

#### Slack
1. Run `aloma connector list` to find the "slack.com" connector id
2. Run `aloma connector oauth <id>` (replace `<id>` with the actual connector id)
3. Follow the OAuth flow to authorize Slack access

### 6. Test the Workflow

Create a test task to verify everything is working:

1. Run `aloma task new "test waitlist" -f task/test_waitlist.json`
or Create a new task from the app with a JSON payload like:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "company": "Example Corp",
  "phone": "+1234567890",
  "jobTitle": "CTO",
  "message": "Interested in your product",
  "$via": {
    "name": "Webform"
  }
}
```

4. Run the task and verify that:
   - Contact is added to HubSpot
   - Welcome email is sent
   - Slack notification is posted
   - CTO research is performed
   - HubSpot is updated with research
   - Contact is added to Google Sheets

## Workflow Steps

1. **Add contact to HubSpot**: Creates a new contact in your HubSpot CRM
2. **Send email for new contact**: Sends a welcome email to the new contact
3. **Post to Slack**: Notifies your team about the new contact
4. **CTO research**: Uses Perplexity AI to research the contact's company and CTO
5. **Update HubSpot with CTO research**: Adds research findings to the contact record
6. **Add to Google Sheets**: Logs the contact information in a spreadsheet

## Troubleshooting

- **OAuth issues**: Make sure you're logged into the correct accounts during OAuth setup
- **API errors**: Verify your API keys and tokens are correct
- **Permission errors**: Ensure your accounts have the necessary permissions for the integrations
- **Sheet not found**: Verify the Google Sheet ID is correct and the sheet is accessible

## Support

If you encounter issues, check the Aloma documentation or contact support.
