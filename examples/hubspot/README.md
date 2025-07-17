# HubSpot Data Retrieval Workflow

This workflow demonstrates how to retrieve and process HubSpot data by:
1. Fetching companies from HubSpot CRM
2. Retrieving associated contacts for each company
3. Processing and displaying the data

## Prerequisites

- Aloma CLI installed
- Access to HubSpot account with API access
- HubSpot Private App configured

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/hubspot
```

### 2. Update Connector Keys/Tokens

#### HubSpot Connector
Edit `deploy.yaml`:
```yaml
connectors:
  - connectorName: "hubspot.com (private)"
    config:
      apiToken: "********"
```

To get your HubSpot API token:
1. Go to HubSpot Settings → Integrations → Private apps
2. Create a new Private app or use an existing one

### 3. Deploy the Workflow

Run the following command from the `hubspot` folder:

```bash
aloma deploy deploy.yaml
```

### 4. Test the Workflow

This deploy created a test task to verify everything is working:

1. Run `aloma task log <id> --logs --changes` with the id shown in the deploy
and verify that:
   - Companies are retrieved from HubSpot
   - Associated contacts are fetched for each company
   - Data is processed and logged

## Workflow Steps

1. **Get HubSpot Companies**: Retrieves up to 3 companies from HubSpot with properties like name, description, LinkedIn page, website, country, and industry
2. **Get Company Contacts**: For each company, fetches associated contacts with detailed information including first name, last name, email, phone, LinkedIn URL, and other properties

## Support

If you encounter issues, check the Aloma documentation or contact support.
