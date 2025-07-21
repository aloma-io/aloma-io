Bank Sales Research Automation
Automates the complete research and outreach process for bank sales teams with AI-powered industry analysis and personalized email generation.
What This Workflow Does
Transforms company data from Google Sheets into comprehensive research reports and personalized outreach emails. Perfect for investment banks wanting to streamline prospect research and client engagement using ALOMA's code-first automation platform.
Workflow Steps
Step Name
Trigger Condition
Action
get_google_sheet_data
getData = true
Retrieves company data from Google Sheets
get_industry_news_part_1
getIndustryNews = true AND nextStep = 1
Generates industry overview report with AI
get_industry_news_part_2
getIndustryNews = true AND nextStep = 2
Orchestrates batch processing of companies
get_industry_news_part_3
getIndustryNews = true AND nextStep = 3
Creates subtasks for company-specific research
get_industry_news_subtask
runsubtask2 = true
AI research for individual companies
get_industry_news_part_4
getIndustryNews = true AND nextStep = 4
Compiles final industry report
get_company_news_step_1
getCompanyNews = true AND nextStep = 1
Manages company research batch processing
get_company_news_step_2
getCompanyNews = true AND nextStep = 2
Creates subtasks for detailed company analysis
get_company_news_subtask
runsubtask = true
Comprehensive company background research
email_message_construction
getCompanyNews = true AND nextStep = 3
Generates personalized sales emails with AI
add_to_google_sheet
companies[].message = String
Updates sheets with emails and research
generate_pdf
generatePDF = true
Creates PDF reports from research
save_to_google_drive_folder
pdfCreated = true
Uploads PDFs to Google Drive
email_industry_news
sendEmail = true
Sends industry reports via email

Prerequisites
Aloma CLI installed
Access to Google Sheets, Google Drive, and email (SMTP OAuth) accounts
Perplexity AI and Claude AI API keys
Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd workflow-examples/bank-sales-research-automation

2. Update Connector Keys/Tokens and Secrets in Deploy File
Edit deploy.yaml and update the following secrets and connectors with your actual values:
connectors:
  - connectorName: "Perplexity"
    config:
      apiKey: "your-perplexity-api-key"
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

To find these values:
GOOGLE_DRIVE_FOLDER: The ID from your Google Drive folder URL (everything after /folders/)
GOOGLE_SHEET: The ID from your Google Sheets URL (the long string between /d/ and /edit)
Perplexity API Key: From perplexity.ai settings → API keys
Claude API Key: From console.anthropic.com → API keys
3. Set Up Google Sheets Structure
Create a Google Sheet with two tabs:
Data Tab:
Row 1: Configuration filters (industry type, development phase, etc.)
Row 2: Headers including: Client name, Business Industry Type, Business Development Phase, Aloma processed, etc.
Row 3+: Company data
Emails Tab:
Headers: Client name, Subject, Message, Profile
4. Deploy the Workflow
Run the following command from the bank-sales-research-automation folder:
aloma deploy deploy.yaml

5. Complete OAuth Configuration
After deployment, configure OAuth for connectors requiring it:
# List deployed connectors
aloma connector list

# Configure OAuth for connectors requiring it
aloma connector oauth <google-sheets-connector-id>
aloma connector oauth <google-drive-connector-id>
aloma connector oauth <email-smtp-connector-id>

# Follow the OAuth flow to authorize access

6. Test the Workflow
Create a test task to verify everything is working:
For Industry News Research:
aloma task new "test industry news" -f task/example-task.json

For Company-Specific Research:
{
  "getData": true,
  "getCompanyNews": true
}

Monitor execution:
# View detailed execution logs
aloma task log <task-id> --logs --changes

CLI Documentation: Complete CLI Guide
Verify that:
Company data is retrieved from Google Sheets
AI research is performed for each company
Personalized emails are generated
PDFs are created and saved to Google Drive
Google Sheets are updated with results
Email notifications are sent
Web UI Development
This workflow can be built entirely using ALOMA's web-based IDE without any local development tools.
Accessing the Web UI
Go to home.aloma.io
Login to your ALOMA account
Navigate to your target workspace
Complete Web UI Workflow
Step 1: Set up Connectors
Go to Settings → Integrations
Click the Connectors tab
Click Manage to add connectors
Add these connectors one by one:
Google Sheets - Add connector, complete OAuth authorization
Google Drive - Add connector, complete OAuth authorization
E-Mail (SMTP - OAuth) - Add connector, complete OAuth authorization
Perplexity - Add connector, configure with API key
Claude-ai - Add connector, configure with API key
Document Generation - Add connector for PDF creation
Step 2: Configure Environment Variables
Go to Settings → Environment Variables/Secrets
Click Add for each required variable:
Variable Name
Value
Notes
GOOGLE_DRIVE_FOLDER
Google Drive Folder ID
Extract from folder URL
GOOGLE_SHEET
Google Sheet ID
Extract from sheet URL

Step 3: Create Steps Use Add New Step to create each step with the condition and content from the step files:
get_google_sheet_data.js
get_industry_news_part_1.js
get_industry_news_part_2.js
get_industry_news_part_3.js
get_industry_news_subtask.js
get_industry_news_part_4.js
get_company_news_step_1.js
get_company_news_step_2.js
get_company_news_subtask.js
email_message_construction.js
add_to_google_sheet.js
generate_pdf.js
save_to_google_drive_folder.js
email_industry_news.js
Step 4: Test the Workflow
Go to the Tasks tab
Click New Task
Name it "test bank research"
Paste the JSON from example-task.json
Click Create
Monitor execution in the task timeline
Use the Console and Development tabs to debug
Web UI Documentation: Complete Web UI Guide
Workflow Features
Data Management
Google Sheets Integration: Automatically retrieves company data with filtering capabilities
Dynamic Processing: Processes companies in batches based on configured filters
Status Tracking: Marks processed companies to avoid duplication
AI-Powered Research
Industry Analysis: Uses Perplexity AI to generate comprehensive industry reports
Company Research: Creates detailed background reports for each target company
Competitive Intelligence: Analyzes competitors, transactions, and market trends
AI Impact Assessment: Evaluates technology disruption effects on target companies
Sales Enablement
Personalized Emails: Uses Claude AI to generate tailored sales emails
Strategic Messaging: References competitive threats and growth opportunities
Professional Templates: Maintains compliance with formal email structures
Document Management
PDF Generation: Creates professional reports from AI research
Cloud Storage: Automatically saves documents to Google Drive
Link Management: Updates spreadsheets with document links
Communication
Email Distribution: Sends industry reports to stakeholders
Progress Tracking: Updates Google Sheets with processing status
Advanced Configuration
Batch Processing
The workflow processes companies in configurable batches:
// Industry news processing (4 companies per batch)
const batchSize = 4;

// Company research processing (3 companies per batch)
const batchSize = 3;

AI Model Selection
Choose between different Perplexity models for research depth:
// For comprehensive research
model: 'sonar-deep-research'

// For faster processing
model: 'llama-3.1-sonar-small-128k-chat'

Email Customization
Modify the email template in email_message_construction.js:
const email = `Dear [CEO],

My name is xxx, Partner at anybank...

Companies are looking to partner with you to scale and meet their AI needs. ${paragraph}...

Would you be available for a call next week?

Partner, anybank`;

Research Prompts
Customize research focus by modifying prompts in the subtask files:
Industry Research: Global trends, UK market analysis, transaction highlights
Company Research: Competitive landscape, financial metrics, AI impact analysis
Strategic Recommendations: Transaction opportunities, partnership potential
Troubleshooting
Common Issues
Workflow not processing companies: Check Google Sheets filters and column headers
AI research failing: Verify API keys for Perplexity and Claude are valid
PDF generation errors: Ensure Document Generation connector is properly configured
Google Drive upload failures: Check folder permissions and connector OAuth
Debug Commands
# Check connector status
aloma connector status <connector-id>

# View workflow logs
aloma task log <task-id> --verbose

# Test connector connectivity
aloma connector test <connector-id>

Google Sheets Requirements
Ensure your sheet has the correct structure:
Filter row (row 1) with industry type and development phase
Header row (row 2) with exact column names as expected by the workflow
Data rows starting from row 3
"end" marker to signal end of data processing
Support
If you encounter issues, check the Aloma documentation or contact support.
License
This workflow is provided as an example for the Aloma automation platform.
