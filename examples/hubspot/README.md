# HubSpot Company Contact Export Automation

**Automates the retrieval and processing of company and contact data from HubSpot CRM with comprehensive relationship mapping.**

## What This Workflow Does

Transforms HubSpot CRM data into organized contact lists by automatically retrieving companies and their associated contacts. Perfect for sales teams wanting to export and analyze their CRM data using ALOMA's code-first automation platform.

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| `get_company_contacts` | `getCompanies = true` | Retrieves companies from HubSpot with search criteria |
| `get_hubspot_companies` | `getContacts = true` | Fetches associated contacts for each company |

## Prerequisites

- Aloma [CLI installed](https://github.com/aloma-io/aloma-io/tree/main/docs/CLI)
- Access to HubSpot CRM with appropriate permissions
- HubSpot Private App or API token with CRM permissions

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/hubspot-company-contact-export
```

### 2. Configure HubSpot API Access in Deploy File

Edit `deploy.yaml` and configure the HubSpot connector:

```yaml
workspaces:
  - name: "hubspot-export"
    
    connectors:
      - connectorName: "hubspot.com"
        config:
          apiToken: "your-hubspot-api-token"
          # OR use OAuth for more secure access
          # clientId: "your-client-id"
          # clientSecret: "your-client-secret"

    steps:
      - syncPath: "steps/"
```

To obtain HubSpot API credentials:
- **Private App Token**: Go to HubSpot Settings → Integrations → Private Apps → Create private app
- **Required Scopes**: `crm.objects.companies.read`, `crm.objects.contacts.read`, `crm.associations.read`
- **OAuth Credentials**: Available in HubSpot Developer account for production apps

### 3. Set Up HubSpot Permissions

Ensure your HubSpot app/token has the necessary permissions:

```
Required HubSpot Scopes:
- crm.objects.companies.read
- crm.objects.contacts.read  
- crm.associations.read
- crm.objects.companies.write (if updating companies)
- crm.objects.contacts.write (if updating contacts)
```

### 4. Deploy the Workflow

Run the following command from the `hubspot-company-contact-export` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Test the Workflow

Create a test task to verify everything is working:

1. **Start the export process:**
```bash
aloma task new "test hubspot export" -d '{"getCompanies": true}'
```

2. **Monitor the workflow execution:**
```bash
# View recent tasks
aloma task list

# View detailed execution logs
aloma task log <task-id> --logs --changes
```

**CLI Documentation:** [Complete CLI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

3. **Verify data extraction:**
   - Companies are retrieved from HubSpot search
   - Associated contacts are fetched for each company
   - Contact details include email, phone, LinkedIn, and owner information
   - Data validation and logging is performed

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
4. Add the **HubSpot** connector:
   - Configure with your API token or OAuth credentials
   - Test connectivity to your HubSpot account
   - Verify required scopes are granted

**Step 2: Create Steps**
Use **Add New Step** to create each step with the condition and content from the step files:

1. `get_company_contacts.js` - Retrieves companies from HubSpot
2. `get_hubspot_companies.js` - Fetches associated contacts for companies

**Step 3: Test the Workflow**
1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test hubspot export"
4. Add the trigger data:
```json
{
  "getCompanies": true
}
```
5. Click **Create**
6. Monitor execution in the task timeline
7. Check the console logs for retrieved company and contact data

**Web UI Documentation:** [Complete Web UI Guide](https://github.com/aloma-io/aloma-io/tree/main/docs/getting-started)

//## Workflow Features

### Company Data Retrieval
1. **HubSpot Search Integration**: Uses HubSpot's search API to retrieve companies
2. **Configurable Limits**: Set batch size for processing (default: 3 companies)
3. **Comprehensive Properties**: Extracts name, description, LinkedIn, website, country, industry
4. **Error Handling**: Gracefully handles empty results and API failures

### Contact Association Management
5. **Relationship Mapping**: Automatically finds contacts associated with each company
6. **Batch Contact Retrieval**: Efficiently fetches multiple contact details in single API calls
7. **Rich Contact Data**: Includes email, phone, LinkedIn, owner, and validation status
8. **Contact Filtering**: Retrieves only relevant contact properties to optimize performance

### Data Processing
9. **Structured Output**: Organizes data in easily consumable format
10. **Logging and Monitoring**: Comprehensive logging for debugging and audit trails
11. **Null Handling**: Safely processes companies with no associated contacts
12. **Completion Management**: Automatic task completion when processing is done

## Advanced Configuration

### Company Search Customization

Modify the search criteria in `get_company_contacts.js`:

```javascript
const body = {    
  limit: 10,  // Increase batch size
  properties: ['name', 'description', 'linkedin_company_page', 'website', 'country', 'industry', 'annual_revenue'],
  filterGroups: [
    {
      filters: [
        {
          propertyName: 'country',
          operator: 'EQ',
          value: 'United States'
        },
        {
          propertyName: 'industry',
          operator: 'EQ',
          value: 'Technology'
        }
      ]
    }
  ]
};
```

### Contact Property Selection

Customize contact properties in `get_hubspot_companies.js`:

```javascript
const properties = [
  "firstname", 
  "lastname", 
  "email", 
  "phone", 
  "linkedin_url",
  "hubspot_owner_id", 
  "do_not_contact", 
  "neverbouncevalidationresult", 
  "ai_sequence_enrollment",
  "jobtitle",
  "company",
  "lifecyclestage",
  "lead_status"
];
```

### Filtering and Pagination

Add pagination for large datasets:

```javascript
// In get_company_contacts.js
const body = {    
  limit: 100,
  after: data.lastProcessedId || undefined,  // For pagination
  properties: ['name', 'description', 'linkedin_company_page', 'website', 'country', 'industry'],
  sorts: [
    {
      propertyName: 'createdate',
      direction: 'DESCENDING'
    }
  ]
};

// Store pagination token
if (hubspotCompanies.paging?.next?.after) {
  data.lastProcessedId = hubspotCompanies.paging.next.after;
  data.hasMore = true;
} else {
  data.hasMore = false;
}
```

### Data Export Enhancement

Add data export capabilities:

```javascript
// At the end of get_hubspot_companies.js
const exportData = {
  companies: data.hubspotCompanies.map(company => ({
    id: company.id,
    name: company.properties.name,
    website: company.properties.website,
    contacts: company.contacts || []
  })),
  exportDate: new Date().toISOString(),
  totalCompanies: data.hubspotCompanies.length
};

// Save to blob or send to external system
data.exportResult = exportData;
```

## Troubleshooting

### Common Issues

1. **API rate limiting**: HubSpot has API rate limits - implement delays if needed
2. **Missing permissions**: Ensure your app has all required CRM scopes
3. **Empty results**: Check if your HubSpot account has companies and contacts
4. **Authentication failures**: Verify API token is valid and not expired

### Debug Commands

```bash
# Check connector status
aloma connector status <hubspot-connector-id>

# View workflow logs
aloma task log <task-id> --verbose

# Test HubSpot connectivity
aloma connector test <hubspot-connector-id>
```

### HubSpot API Validation

Test your HubSpot API access manually:

```bash
# Test companies endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/companies?limit=1"

# Test contacts endpoint  
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/contacts?limit=1"

# Test associations endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/companies/COMPANY_ID/associations/contacts"
```

### Rate Limiting Management

Handle HubSpot rate limits gracefully:

```javascript
// Add retry logic with exponential backoff
const makeHubSpotRequest = async (url, options, retryCount = 0) => {
  try {
    const response = await connectors.hubspotCom.request({ url, options });
    return response;
  } catch (error) {
    if (error.status === 429 && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      await connectors.utils.sleep({
          milliseconds: delay
        });
      return makeHubSpotRequest(url, options, retryCount + 1);
    }
    throw error;
  }
};
```

## Integration Examples

### Export to Google Sheets

Add Google Sheets export functionality:

```javascript
// After processing all companies and contacts
const sheetsData = data.hubspotCompanies.map(company => [
  company.properties.name,
  company.properties.website,
  company.properties.industry,
  company.contacts?.length || 0,
  company.contacts?.map(c => c.properties.email).join(', ') || ''
]);

await connectors.googleSheets.appendRows({
  spreadsheetId: task.config('EXPORT_SHEET_ID'),
  range: 'Companies!A:E',
  values: sheetsData
});
```

### Send to External API

Push data to external systems:

```javascript
// Send processed data to external CRM or database
await connectors.fetch({
  url: task.config('EXTERNAL_API_ENDPOINT'),
  options: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companies: data.hubspotCompanies,
      exportTimestamp: new Date().toISOString()
    })
  }
});
```

## Support

If you encounter issues, check the Aloma documentation or contact support.

## License

This workflow is provided as an example for the Aloma automation platform.
