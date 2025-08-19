# Bank Sales Research Automation

**Automates AI-powered industry research and personalized sales outreach for investment banking teams with comprehensive report generation and client intelligence.**

## What This Workflow Does

Transforms company data from Google Sheets into comprehensive research reports and personalized outreach emails using dual AI models. Perfect for investment banks wanting to streamline prospect research, industry intelligence, and client engagement using ALOMA's code-first automation platform.

## Workflow Steps

| Step Name                     | Trigger Condition                         | Action                                                   |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `get_google_sheet_data`       | `getData = true`                          | Retrieves company data from Google Sheets with filtering |
| `get_industry_news_part_1`    | `getIndustryNews = true AND nextStep = 1` | Generates comprehensive industry overview with AI        |
| `get_industry_news_part_2`    | `getIndustryNews = true AND nextStep = 2` | Orchestrates batch processing flow control               |
| `get_industry_news_part_3`    | `getIndustryNews = true AND nextStep = 3` | Creates subtasks for company-specific research           |
| `get_industry_news_subtask`   | `runsubtask2 = true`                      | AI research for individual companies                     |
| `get_industry_news_part_4`    | `getIndustryNews = true AND nextStep = 4` | Compiles final industry report                           |
| `get_company_news_step_1`     | `getCompanyNews = true AND nextStep = 1`  | Manages company research batch processing                |
| `get_company_news_step_2`     | `getCompanyNews = true AND nextStep = 2`  | Creates subtasks for detailed company analysis           |
| `get_company_news_subtask`    | `runsubtask = true`                       | Comprehensive company background research                |
| `email_message_construction`  | `getCompanyNews = true AND nextStep = 3`  | Generates personalized sales emails with AI              |
| `add_to_google_sheet`         | `companies[].message = String`            | Updates sheets with emails and research                  |
| `generate_pdf`                | `generatePDF = true`                      | Creates PDF reports from research                        |
| `save_to_google_drive_folder` | `pdfCreated = true`                       | Uploads PDFs to Google Drive                             |
| `email_industry_news`         | `sendEmail = true`                        | Distributes industry reports via email                   |

## Prerequisites

* Aloma [CLI installed](https://github.com/aloma-io/aloma-io/tree/main/docs/CLI)
* Access to Google Sheets, Google Drive, and email (SMTP OAuth) accounts
* Perplexity AI and Claude AI API keys

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/bank-sales-research-automation
```

### 2. Update Connector Keys/Tokens and Secrets in Deploy File

Edit `deploy.yaml` and update the following secrets and connectors with your actual values:

```yaml
workspaces:
  - name: "Aalto-test"
    
    connectors:      
      - connectorName: "Document Generation"
      - connectorName: "Google Sheets"
      - connectorName: "E-Mail (SMTP - OAuth)"
      - connectorName: "Perplexity"
        config:
          apiKey: "your-perplexity-api-key"
      - connectorName: "Google Drive"
      - connectorName: "Claude-ai"
        config:
          apiKey: "your-claude-api-key"

    secrets:
      - name: "GOOGLE_DRIVE_FOLDER"
        value: "your-google-drive-folder-id"
        description: "Google drive folder ID"
        encrypted: false
      - name: "GOOGLE_SHEET"
        value: "your-google-sheet-id"
        description: "Google sheet ID"
        encrypted: false
```

To find these values:

* **GOOGLE\_DRIVE\_FOLDER**: The ID from your Google Drive folder URL (everything after `/folders/`)
* **GOOGLE\_SHEET**: The ID from your Google Sheets URL (the long string between `/d/` and `/edit`)
* **Perplexity API Key**: From perplexity.ai settings → API keys
* **Claude API Key**: From console.anthropic.com → API keys

### 3. Set Up Google Sheets Structure

Create a Google Sheet with two tabs:

**Data Tab:**

* Row 1: Configuration filters (industry type, development phase, etc.)
* Row 2: Headers including: `Client name`, `Business Industry Type`, `Business Development Phase`, `Aloma processed`, etc.
* Row 3+: Company data

**Emails Tab:**

* Headers: `Client name`, `Subject`, `Message`, `Profile`

### 4. Deploy the Workflow

Run the following command from the `bank-sales-research-automation` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Complete OAuth Configuration

After deployment, configure OAuth for connectors requiring it:

```bash
# List deployed connectors
aloma connector list

# Configure OAuth for connectors requiring it
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <google-drive-connector-id>
aloma connector oauth <email-smtp-connector-id>

# Follow the OAuth flow to authorize access
```

### 6. Test the Workflow

Create a test task to verify everything is working:

1. **For Industry News Research:**

```bash
aloma task new "test industry news" -d '{"getData": true, "getIndustryNews": true}'
```

2. **For Company-Specific Research:**

```bash
aloma task new "test company research" -d '{"getData": true, "getCompanyNews": true}'
```

3. Monitor execution:

```bash
# View detailed execution logs
aloma task log <task-id> --logs --changes
```

**CLI Documentation:** [Complete CLI Guide](../docs/cli/)

4. Verify that:
   * Company data is retrieved from Google Sheets
   * AI research is performed for each company
   * Personalized emails are generated
   * PDFs are created and saved to Google Drive
   * Google Sheets are updated with results
   * Email notifications are sent

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
   * **Google Sheets** - Add connector, complete OAuth authorization
   * **Google Drive** - Add connector, complete OAuth authorization
   * **E-Mail (SMTP - OAuth)** - Add connector, complete OAuth authorization
   * **Perplexity** - Add connector, configure with API key
   * **Claude-ai** - Add connector, configure with API key
   * **Document Generation** - Add connector for PDF creation

**Step 2: Configure Environment Variables**

1. Go to **Settings → Environment Variables/Secrets**
2. Click **Add** for each required variable:

| Variable Name         | Value                  | Notes                   |
| --------------------- | ---------------------- | ----------------------- |
| `GOOGLE_DRIVE_FOLDER` | Google Drive Folder ID | Extract from folder URL |
| `GOOGLE_SHEET`        | Google Sheet ID        | Extract from sheet URL  |

**Step 3: Create Steps** Use **Add New Step** to create each step with the condition and content from the step files:

1. `get_google_sheet_data.js`
2. `get_industry_news_part_1.js`
3. `get_industry_news_part_2.js`
4. `get_industry_news_part_3.js`
5. `get_industry_news_subtask.js`
6. `get_industry_news_part_4.js`
7. `get_company_news_step_1.js`
8. `get_company_news_step_2.js`
9. `get_company_news_subtask.js`
10. `email_message_construction.js`
11. `add_to_google_sheet.js`
12. `generate_pdf.js`
13. `save_to_google_drive_folder.js`
14. `email_industry_news.js`

**Step 4: Test the Workflow**

1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test bank research"
4. Use the appropriate trigger data:
   * Industry research: `{"getData": true, "getIndustryNews": true}`
   * Company research: `{"getData": true, "getCompanyNews": true}`
5. Click **Create**
6. Monitor execution in the task timeline
7. Use the **Console** and **Development** tabs to debug

**Web UI Documentation:** [Complete Web UI Guide](../docs/web-UI/)

## Workflow Features

### Data Management & Intelligence

1. **Google Sheets Integration**: Automatically retrieves company data with sophisticated filtering capabilities
2. **Dynamic Processing**: Processes companies in batches based on configured filters and business rules
3. **Status Tracking**: Marks processed companies to avoid duplication and maintain audit trails
4. **Configurable Filters**: Industry type, development phase, and processing status filtering

### AI-Powered Research & Analysis

5. **Dual AI Architecture**: Perplexity for comprehensive research, Claude for personalized communication
6. **Industry Intelligence**: Generates detailed industry reports with global trends, UK market analysis, and transaction highlights
7. **Company Deep Dives**: Creates comprehensive company background reports with competitive analysis
8. **Financial Transaction Analysis**: Tracks M\&A activity, funding rounds, and strategic partnerships
9. **Competitive Intelligence**: Analyzes market position, competitor activities, and strategic opportunities
10. **AI Impact Assessment**: Evaluates technology disruption effects on target companies and industries

### Sales Enablement & Outreach

11. **Personalized Email Generation**: Uses Claude AI to create tailored sales emails with strategic messaging
12. **Professional Templates**: Maintains compliance with formal email structures and banking standards
13. **Strategic Messaging**: References competitive threats, growth opportunities, and market positioning
14. **Subject Line Optimization**: AI-generated subject lines designed to capture CEO attention

### Document Management & Distribution

15. **Professional PDF Generation**: Creates formatted reports suitable for client meetings
16. **Cloud Storage Integration**: Automatically saves documents to Google Drive with proper organization
17. **Link Management**: Updates spreadsheets with shareable document links
18. **Version Control**: Date-stamped file naming for easy tracking and retrieval

### Communication & Collaboration

19. **Email Distribution**: Sends industry reports to stakeholders with professional formatting
20. **Progress Tracking**: Updates Google Sheets with processing status and completion markers
21. **Batch Processing**: Handles multiple companies efficiently with parallel AI processing
22. **Error Handling**: Graceful handling of missing data and API limitations

## Advanced Configuration

### AI Model Configuration

Choose between different Perplexity models based on research depth requirements:

```javascript
// For comprehensive, high-quality research (recommended)
model: 'sonar-deep-research'

// For faster processing with good quality
model: 'llama-3.1-sonar-small-128k-chat'
```

### Batch Processing Optimization

Customize batch sizes based on your API limits and performance requirements:

```javascript
// Industry news processing (4 companies per batch)
const batchSize = 4;

// Company research processing (3 companies per batch)
const batchSize = 3;
```

### Research Prompt Customization

Modify research focus by customizing prompts in the step files:

**Industry Research Enhancement:**

```javascript
// In get_industry_news_part_1.js
```
