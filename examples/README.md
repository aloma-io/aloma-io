# Aloma Examples

Real-world automation examples that demonstrate Aloma's capabilities for business process automation.

## Available Examples

### [HubSpot Integration](hubspot/): **Company and Contact Management Automation**
### [Waitlist Automation](waitlist_automation/): **Complete Lead Processing Workflow**

## Getting Started with Examples

### Prerequisites
- Aloma account ([sign up here](https://home.aloma.io/))
- [Basic understanding](../getting-started/) of Aloma concepts
- [Install CLI](../CLI/)


### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/waitlist_automation
```

### 2. Update Secret and Connector Keys/Tokens

#### HubSpot Connector (example)
Edit `connector/connector-hubspot.json`:
```json
{
  "config": {
    "apiToken": "your-hubspot-api-token"
  }
}
```

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

### 4. Deploy the Workflow

Run the following command from the `waitlist_automation` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Complete OAuth Configuration

After deployment, you'll need to configure OAuth for the required connectors (see examples for specifics and requirements):

#### Slack Example
1. Run `aloma connector list` to find the "slack.com" connector id
2. Run `aloma connector oauth <id>` (replace `<id>` with the actual connector id)
3. Follow the OAuth flow to authorize Slack access

### 6. Test the Workflow

Create the test task provided in the example to verify everything is working. 

## Support

- [Toy Example Tutorial](https://github.com/aloma-io/aloma-io/blob/main/docs/getting-started/toy-example.md)
- [CLI Documentation](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)
- [Create an issue](../../issues) in the repository
- Email connector-request@aloma.io for new connector requests
- Check [ALOMA documentation](https://github.com/aloma-io/aloma-io/tree/main/docs) for detailed guides
- Review [Getting Started Guide](../../docs/getting-started) for fundamentals

---

**Ready to start?** Pick an example and start building your first workflow.
