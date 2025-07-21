# GitHub CI/CD Release Management Workflow

**Automates the complete release management process from commit to deployment with intelligent version management and team notifications.**

## What This Workflow Does

Transforms Git commits into automated releases with semantic versioning, connector deployments, and infrastructure monitoring. Perfect for development teams wanting to streamline their CI/CD pipeline using ALOMA's code-first automation platform.

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| `classify_commit_in_main` | `ref = "refs/heads/main" AND repository.name = String` | Classifies commits for release processing |
| `get_latest_tag` | `release.latest = null` | Fetches current version from GitHub |
| `calc_next_release_version` | `release.latest = Object AND release.next = null` | Calculates next semantic version |
| `create_tag` | `release.next = String AND release.tagged = null` | Creates Git tag for new version |
| `create_release` | `release.tagged.ref = String` | Publishes GitHub release |
| `check_release_done` | `release.released.url = String` | Sends success notification to Slack |
| `find_all_connector_repositories` | `release = "connectors"` | Discovers connector repositories |
| `filter_connector_repositories` | `repos.request = Array` | Filters repositories with "connector-" prefix |
| `fetch_repository_tag` | `repos = Array` | Retrieves tags for connector repos |
| `tag_with_new_release` | `repos = null AND tags = Object` | Bulk releases all connectors |
| `update_connector_image` | `build.type = "connector"` | Handles connector image deployments |
| `connector_image_update_successful` | `connector.update.status = 200` | Confirms deployment success |

## Prerequisites

- Aloma [CLI installed](../../CLI/)
- Access to GitHub (with repository admin rights)
- Slack workspace and channel for notifications
- Kubernetes cluster (for pod monitoring features)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/github-release-management
```

### 2. Update Connector Keys/Tokens and Secrets in Deploy File

Edit `deploy.yaml` and update the following secrets with your actual values:

```yaml
connectors:
  - connectorName: "github.com"
    config:
      apiToken: "********"

secrets:
  - name: "SLACK_CHANNEL"
    value: "your-slack-channel-id"
    description: "Slack channel ID for release notifications"
    encrypted: false
```

To find these values:
- **GitHub API token**: Go to GitHub Settings → Developer settings → Personal access tokens
- **SLACK_CHANNEL**: Right-click on your Slack channel → Copy channel ID

### 3. Configure Repository Settings

Update the workflow configuration in the step files:

```javascript
// In classify_commit_in_main.js, replace placeholders:
if ((parts[2] === 'main' || parts[2] === 'master') && 
    !(data.repository.name === 'excluded-repo-1' || data.repository.name === 'excluded-repo-2'))

// In find_all_connector_repositories.js and other files, replace:
{ org: 'your-github-org-name' }
```

### 4. Deploy the Workflow

Run the following command from the `github-release-management` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Complete OAuth Configuration

After deployment, configure OAuth for connectors requiring it:

```bash
# List deployed connectors
aloma connector list

# Configure OAuth for Slack connector
aloma connector oauth <slack-connector-id>

# Follow the OAuth flow to authorize access
```

### 6. Set Up GitHub Webhooks

Configure GitHub webhooks to trigger the workflow:

1. Go to your repository Settings → Webhooks
2. Click "Add webhook"
3. Set Payload URL to your Aloma webhook endpoint
4. Select "Let me select individual events"
5. Choose: "Pushes", "Releases", "Pull requests"
6. Set Content type to "application/json"
7. Add your webhook secret if required

### 7. Test the Workflow

Create a test commit to verify everything is working:

1. Make a commit to your main branch
2. Monitor the workflow execution:

```bash
# View recent tasks
aloma task list

# View detailed execution logs
aloma task log <task-id> --logs --changes
```

**CLI Documentation:** [Complete CLI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

3. Verify that:
   - Commit is classified correctly
   - New version is calculated
   - Git tag is created
   - GitHub release is published
   - Slack notification is sent
   - Connector releases are handled (if applicable)

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
   - **GitHub** - Add connector, configure with API token
   - **Slack** - Add connector, complete OAuth authorization

**Step 2: Configure Environment Variables**
1. Go to **Settings → Environment Variables/Secrets**
2. Click **Add** for each required variable:

| Variable Name | Value | Notes |
|---------------|--------|--------|
| `SLACK_CHANNEL` | Slack Channel ID | Right-click channel → Copy channel ID |

**Step 3: Create Steps**
Use **Add New Step** to create each step with the condition and content from the step files:

1. `classify_commit_in_main.js`
2. `get_latest_tag.js`
3. `calc_next_release_version.js`
4. `create_tag.js`
5. `create_release.js`
6. `check_release_done.js`
7. Additional connector and pod monitoring steps as needed

**Step 4: Test the Workflow**
1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test github release"
4. Paste a GitHub webhook payload (use `example.json` as reference)
5. Click **Create**
6. Monitor execution in the task timeline
7. Use the **Console** and **Development** tabs to debug

**Web UI Documentation:** [Complete Web UI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/web-UI)

## Workflow Features

### Release Management
1. **Classify commits**: Automatically detects commits that should trigger releases
2. **Version calculation**: Uses semantic versioning with automatic patch increment
3. **Tag creation**: Creates Git tags for new versions
4. **Release publishing**: Publishes GitHub releases with auto-generated notes
5. **Team notifications**: Sends Slack notifications for successful releases

### Connector Management
6. **Connector discovery**: Finds all repositories with "connector-" prefix
7. **Bulk releases**: Automatically releases all connectors with version bumps
8. **Image deployment**: Handles connector image updates in infrastructure
9. **Deployment confirmation**: Confirms successful deployments

### Infrastructure Monitoring
10. **Pod lifecycle tracking**: Monitors Kubernetes pod creation, updates, and deletion
11. **Event classification**: Categorizes infrastructure events for audit trails
12. **Real-time monitoring**: Provides immediate visibility into cluster changes

## Advanced Configuration

### Custom Version Prefixes

For specific repositories (like `aloma-io/site`), the workflow automatically adds a 't' prefix to versions:

```javascript
if (data.release.full === 'aloma-io/site' && data.release.next) {
  data.release.next = 't' + data.release.next?.replaceAll("t", "")
}
```

### Connector Deployment

The workflow includes placeholder code for connector deployments. Customize the `update_connector_image.js` step:

```javascript
connectors.fetch({
    url: 'YOUR_DEPLOYMENT_API_URL', 
    options: {
        body: JSON.stringify({
             variables: { marketId: data.build.connectorId, image: data.build.image }
        }),
        headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer YOUR_TOKEN'},
        method: 'POST'
    }
})
```

### Release Types

Configure different release types by setting the `releasePart` variable:
- `'patch'` - Increments patch version (default)
- `'minor'` - Increments minor version
- `'major'` - Increments major version

## Troubleshooting

### Common Issues

1. **Workflow not triggering**: Verify GitHub webhooks are configured correctly
2. **Permission errors**: Ensure GitHub token has sufficient repository permissions
3. **Slack notifications failing**: Check Slack channel ID and OAuth configuration
4. **Version calculation errors**: Verify repository has existing tags

### Debug Commands

```bash
# Check connector status
aloma connector status <connector-id>

# View workflow logs
aloma task log <task-id> --verbose

# Test connector connectivity
aloma connector test <connector-id>
```

## Support

If you encounter issues, check the Aloma documentation or contact support.

## License

This workflow is provided as an example for the Aloma automation platform.
