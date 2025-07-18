# Aalto Capital Industry News Automation

This workflow automates the process of gathering, processing, and distributing industry news for selected companies. It integrates with Google Sheets, Perplexity AI, Claude AI, Google Drive, and email to streamline research and communication.

## Prerequisites

- Aloma CLI installed
- Access to Google Sheets, Google Drive, and email (SMTP OAuth) accounts
- Perplexity AI and Claude AI API keys

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/Aalto\ Capital
```

### 2. Update Secrets and Connectors api keys in Deploy File

Edit `deploy.yaml` and update the following secrets and connectors keys with your actual values:

```yaml
secrets:
  - name: "GOOGLE_DRIVE_FOLDER"
    value: "your-google-drive-folder-id"
    description: "Google drive folder ID"
    encrypted: false
  - name: "GOOGLE_SHEET"
    value: "your-google-sheet-id"
    description: "Google sheet ID"
    encrypted: false

connectors:
  - connectorName: "Perplexity"
    config:
      apiKey: "*******"
  - connectorName: "Claude-ai"
    config:
      apiKey: "*******"
```


- **GOOGLE_DRIVE_FOLDER**: The ID from your Google Drive folder URL
- **GOOGLE_SHEET**: The ID from your Google Sheets URL (the long string between /d/ and /edit)

### 3. Deploy the Workflow

Run the following command from the `Aalto Capital` folder:

```bash
aloma deploy deploy.yaml
```

### 4. Complete OAuth Configuration

After deployment, configure OAuth for the following connectors as needed:

- Google Sheets
- E-Mail (SMTP - OAuth)
- Google Drive

Use `aloma connector list` to find connector IDs, then run:

```bash
aloma connector oauth <id>
```

and follow the prompts for each service.

### 5. Test the Workflow

Create a test task to verify everything is working. You can do this from the app or CLI. The workflow will execute the following steps:

## Workflow Steps

1. **Get Google Sheet Data**: Retrieves company data from a Google Sheet.
2. **Get Industry News - Part 1 (AI Agent)**: Uses AI to gather initial industry news.
3. **Get Industry News - Part 2**: Continues the news gathering process.
4. **Get Industry News - Part 3**: Further processes news, including subtasks for specific companies.
5. **Get Industry News - Part 4**: Finalizes the industry news collection.
6. **Generate PDF**: Compiles the news into a PDF document.
7. **Save to Google Drive Folder**: Uploads the PDF to a specified Google Drive folder.
8. **Email Industry News**: Sends the compiled news via email to recipients.

## Support

If you encounter issues, check the Aloma documentation or contact support. 
