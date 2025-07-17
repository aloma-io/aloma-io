

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

- **[HubSpot](https://developers.hubspot.com/docs/api/private-apps)**
- **[Google Sheets](https://developers.google.com/sheets/api/guides/authorizing)** - Centralized contact logging and reporting  
- **[Slack](https://api.slack.com/authentication/oauth-v2)** - Real-time team notifications
- **[Perplexity AI](https://docs.perplexity.ai/docs/getting-started)** - Intelligent prospect research
- **[Email (SMTP - OAuth)]()** - Automated welcome emails




## Support

For issues with this workflow:
- [Create an issue](../../issues) in the repository
- Email connector-request@aloma.io for new connector requests
- Check [ALOMA documentation](https://github.com/aloma-io/aloma-io/tree/main/docs) for detailed guides
- Review [Getting Started Guide](../../docs/getting-started) for fundamentals
