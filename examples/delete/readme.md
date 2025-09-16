# Advantage Utilities Lead Enrichment & Outreach Automation

**Automates LinkedIn and CRM lead enrichment, AI-driven email generation, and multi-channel engagement for B2B energy consulting.**

---

## What This Workflow Does

This workflow streamlines the process of capturing, enriching, and engaging leads for Advantage Utilities. It integrates LinkedIn profile visits, HubSpot CRM, Google Sheets, and AI services (OpenAI, Claude, Perplexity) to automate contact and company enrichment, validate emails, generate personalised outreach messages, and manage multi-step campaign sequences. Ideal for B2B teams seeking to automate prospect research, CRM updates, and tailored outreach at scale.

---

## Workflow Steps

| Step Name                        | Trigger Condition                                                                                                    | Action                                                                                          |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| check profile (James)             | `{"$via": {"name": "dux-soup-James"}}`                                                                              | Checks LinkedIn profile from Google Sheet, triggers enrichment if email present                 |
| check profile (Tim)               | `{"$via": {"name": "dux-soup-Tim"}}`                                                                                | Checks LinkedIn profile from Google Sheet, triggers enrichment if email present                 |
| visit profile data                | `{"visitData": true}`                                                                                               | Extracts and normalises LinkedIn/lead data, prepares for CRM enrichment                        |
| check existence in hubspot        | `{"checkHubspot": true}`                                                                                            | Searches for existing company/contact in HubSpot, sets flags for create/update                  |
| create in hubspot                 | `{"updateCreateHubspot": true}`                                                                                     | Creates or updates HubSpot company/contact with enriched fields                                 |
| send FullEnrich request           | `{"fullEnrich": true}`                                                                                              | Sends enrichment request to FullEnrich API for missing/invalid emails                          |
| search company and contact        | `{"$via": {"name": "full-enrich"}}`                                                                                 | Searches HubSpot for company/contact by domain and user_id from enrichment result              |
| update with fullenrich data       | `{"checkEnrich": true}`                                                                                             | Updates HubSpot company/contact with enrichment data, logs note, creates task                  |
| get linkedin urls (James)         | `{"visitProfilesJames": true}`                                                                                      | Reads LinkedIn URLs from Google Sheet, triggers DuxSoup profile visits                         |
| get linkedin urls (Tim)           | `{"visitProfilesTim": true}`                                                                                        | Reads LinkedIn URLs from Google Sheet, triggers DuxSoup profile visits                         |
| get hubspot companies from lists  | `{"getCompanies": true}`                                                                                            | Retrieves companies from HubSpot lists for campaign processing                                  |
| filter properties                 | `{"hubspotCompanies": "Array", "filterProps": true}`                                                                | Normalises and filters company properties for downstream steps                                  |
| get company contacts              | `{"hubspotCompanies": "Array", "getContacts": true}`                                                                | Retrieves and filters associated contacts for each company                                      |
| email verification                | `{"hubspotCompanies": [{"contacts": "Object"}], "neverBounce": true}`                                               | Validates contact emails using NeverBounce API, updates HubSpot                                |
| get industry news                 | `{"hubspotCompanies": [{"companyNews": "String"}], "AIEnrich": true}`                                               | Generates industry news using Perplexity for each company                                      |
| get company news                  | `{"AIEnrich": true}`                                                                                                | Generates company-specific news using Perplexity                                               |
| get google sheet data             | `{"hubspotCompanies": [{"industryNews": "String"}], "production": true}`                                            | Retrieves campaign prompts from Google Sheets                                                  |
| email message construction (OpenAI)| `{"hubspotCompanies": [{"emailData": "Object"}], "production": true}`                                               | Generates email content using OpenAI and campaign prompts                                      |
| Claude refine email content       | `{"hubspotCompanies": [{"subject": "String", "paragraph": "String", "challenges": "String"}], "production": true}`  | Refines AI-generated email content using Claude                                                |
| add to hubspot                    | `{"addToHubspot": true}`                                                                                            | Updates HubSpot company/contact records with AI-generated content                              |
| add to google sheet               | `{"googleSheetStep": true}`                                                                                         | Logs campaign data to Google Sheet                                                             |
| add to sequence (former production)| `{"addToSequence": true, "production": false, "sequenceAdding": false}`                                             | (Legacy) Adds validated contacts to HubSpot sequence                                           |
| add to sequence - part 1          | `{"addToSequence": true, "nextStep": 1}`                                                                            | Initiates sequence enrolment for batch of companies                                            |
| add to sequence - part 2          | `{"addToSequence": true, "nextStep": 2}`                                                                            | Runs subtask for each company/contact in batch, updates sequence status                        |
| subtask - part 1                  | `{"runsubtask": true}`                                                                                              | Enrols first contact in HubSpot sequence, updates status                                       |
| subtask - part 2                  | `{"part2": true}`                                                                                                   | Enrols second contact in HubSpot sequence, updates status                                      |
| subtask - part 3                  | `{"part3": true}`                                                                                                   | Enrols third contact in HubSpot sequence, completes task                                       |
| update company contacts           | `{"contacts": "Object", "email": "String", "update": true}`                                                         | Updates HubSpot contacts with AI-generated email paragraph                                     |
| get changed field value           | `{"$via": {"name": "hubspot"}, "items": [{"subscriptionType": "company.propertyChange", "propertyName": "ai_paragraph"}]}` | Triggers contact update on AI email paragraph change                                           |
| get contact data                  | `{"$via": {"name": "hubspot"}, "items": [{"subscriptionType": "contact.propertyChange", "propertyName": "enrich_contact"}]}` | Triggers enrichment for contact when flagged in HubSpot                                        |
| enrich contact                    | `{"enrichContact": true}`                                                                                           | Sends FullEnrich request for contact/company                                                   |
| data from google sheet            | `{"$via": {"name": "googleSheet"}}`                                                                                 | Triggers addToHubspot for Google Sheet sourced data                                            |
| get company search                | `{"hubspotCompanies": [{"industryNews": "String"}], "AIEnrich": true}`                                              | Searches for recent company news using Google Serper API                                       |
| opening sentence prompt           | `{"hubspotContacts": {"results": [{"message": "String"}]}}`                                                         | Generates opening sentence for outreach using OpenAI                                           |
| email message construction (original Claude)| `{"hubspotCompanies": [{"companySearch": "Array"}], "claude": true}`                                              | Generates subject and message using Claude                                                     |
| update with fullenrich data       | `{"checkEnrich": true}`                                                                                             | Updates HubSpot with enrichment results, logs notes and tasks                                  |
| Report errors                     | `{"reportErrors": true}`                                                                                            | Reports errors to Slack and logs                                                               |
| ... (UC/Administrate steps)       | ...                                                                                                                 | Handles UC customer sync, token management, and reporting                                      |

---

## Integrations Used in Example

- [HubSpot CRM (Private App)](https://developers.hubspot.com/docs/api/overview)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Claude AI API](https://docs.anthropic.com/claude/reference)
- [Perplexity API](https://docs.perplexity.ai/)
- [Slack API](https://api.slack.com/)
- [E-Mail (SMTP & OAuth)](https://nodemailer.com/smtp/)
- [DuxSoup API](https://www.dux-soup.com/)
- [FullEnrich API](https://app.fullenrich.com/api/docs)
- [NeverBounce API](https://developers.neverbounce.com/docs/)
- [Cron Connector](https://docs.aloma.io/connectors/cron)
- [Administrate/UC API](https://api.administrate.online/)

---

## Setup Instructions (CLI)

1. **Clone the repository and enter the workflow directory**
<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-bash">
git clone &lt;repository-url&gt;
cd &lt;workflow-directory&gt;
</code></pre>
</div>

2. **Update `deploy.yaml` with your connector keys and secrets** (see below)

3. **Deploy the workflow**
<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-bash">
aloma deploy deploy.yaml
</code></pre>
</div>

4. **(If required) Complete OAuth for Google Sheets, Slack, and SMTP**
<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-bash">
aloma connector list
aloma connector oauth &lt;connector-id&gt;
</code></pre>
</div>

5. **Test with a sample task**
<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-bash">
aloma task new "test enrichment" -f example.json
</code></pre>
</div>

6. **View task logs**
<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-bash">
aloma task log &lt;task-id&gt; --logs --changes
</code></pre>
</div>

---

## Configuration (Connectors & Secrets)

**Edit `deploy.yaml` and update the following with your actual values:**

<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-yaml">
connectors:
  - connectorName: "openai.com"
    config:
      apiKey: "<OPENAI_API_KEY>"
  - connectorName: "slack.com"
  - connectorName: "E-Mail (SMTP)"
    config:
      smtpUser: "<SMTP_USER>" # optional
      smtpPassword: "<SMTP_PASSWORD>" # optional
      smtpHost: "<SMTP_HOST>"
  - connectorName: "DuxSoup"
    config:
      userId: "<DUXSOUP_USERID>"
      authKey: "<DUXSOUP_AUTHKEY>"
  - connectorName: "DuxSoup (duxSoup2)"
    config:
      userId: "<DUXSOUP2_USERID>"
      authKey: "<DUXSOUP2_AUTHKEY>"
  - connectorName: "Cron"
    config:
      cron: "<CRON_EXPRESSION>" # optional
  - connectorName: "Claude-ai"
    config:
      apiKey: "<CLAUDE_API_KEY>"
  - connectorName: "E-Mail (SMTP - OAuth)"
  - connectorName: "Google Sheets"
    config:
      googleServiceAccountKey: "<GOOGLE_SERVICE_ACCOUNT_KEY>" # optional
  - connectorName: "hubspot.com (private)"
    config:
      apiToken: "<HUBSPOT_API_TOKEN>"
  - connectorName: "Perplexity"
    config:
      apiKey: "<PERPLEXITY_API_KEY>"

secrets:
  - name: "JAMES_DUX_SPREADSHEET"
    value: "<GOOGLE_SHEET_ID_JAMES>"
    encrypted: false
  - name: "TIM_DUX_SPREADSHEET"
    value: "<GOOGLE_SHEET_ID_TIM>"
    encrypted: false
  - name: "LINKEDIN_SPREADSHEET"
    value: "<GOOGLE_SHEET_ID_LINKEDIN>"
    encrypted: false
  - name: "NEVERBOUNCE_KEY"
    value: "<NEVERBOUNCE_API_KEY>"
    encrypted: true
  - name: "FULLENRICH_KEY"
    value: "<FULLENRICH_API_KEY>"
    encrypted: true
  - name: "COMPANIES_SPREADSHEET"
    value: "<GOOGLE_SHEET_ID_COMPANIES>"
    encrypted: false
  - name: "UCPassword"
    value: "<UC_PASSWORD>"
    encrypted: true
  - name: "HUBSPOT_LIST_IDS"
    value: "<COMMA_SEPARATED_HUBSPOT_LIST_IDS>"
    description: "Hubspot list ids to get companies"
    encrypted: false
</code></pre>
</div>

**To find these values:**
- **HubSpot API token**: HubSpot Settings → Integrations → Private Apps
- **Google Sheet IDs**: The string between `/d/` and `/edit` in the sheet URL
- **NeverBounce API Key**: [NeverBounce dashboard](https://app.neverbounce.com/settings)
- **FullEnrich API Key**: [FullEnrich dashboard](https://app.fullenrich.com/api/docs)
- **Perplexity API Key**: [Perplexity settings](https://www.perplexity.ai/settings)
- **Slack App**: [Slack API](https://api.slack.com/apps)
- **DuxSoup Auth**: [DuxSoup API](https://www.dux-soup.com/)
- **Claude API Key**: [Anthropic dashboard](https://console.anthropic.com/)
- **UCPassword**: Provided by Administrate/UC system admin
- **HUBSPOT_LIST_IDS**: HubSpot → Contacts/Companies → Lists → List details → List ID

---

## Sample Task (JSON)

<div>
<button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<pre><code class="language-json">
{
  "data": {
    "First Name": "Jane",
    "Last Name": "Doe",
    "Email": "jane.doe@company.com",
    "Company": "Example Ltd",
    "CompanyWebsite": "https://www.example.com",
