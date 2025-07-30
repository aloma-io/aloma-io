# Kubernetes Pod Monitoring Automation

**Automates real-time monitoring and classification of Kubernetes pod lifecycle events with intelligent alerting and audit trails.**

## What This Workflow Does

Transforms Kubernetes cluster events into organized monitoring data with automatic classification and tracking. Perfect for DevOps teams wanting comprehensive pod lifecycle visibility using ALOMA's code-first automation platform.

## Workflow Steps

| Step Name | Trigger Condition | Action |
|-----------|-------------------|---------|
| `pod_add` | `type = "add" AND item.kind = "Pod"` | Classifies and logs new pod creation events |
| `classify_pod_update` | `type = "update" AND item.kind = "Pod"` | Tracks pod configuration and status changes |
| `pod_delete` | `type = "delete" AND item.kind = "Pod"` | Monitors pod termination and cleanup events |

## Prerequisites

- Aloma [CLI installed](https://github.com/aloma-io/aloma-io/tree/main/docs/CLI)
- Access to Kubernetes cluster with appropriate RBAC permissions
- Kubernetes connector configuration

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workflow-examples/kubernetes-pod-monitoring
```

### 2. Configure Kubernetes Access in Deploy File

Edit `deploy.yaml` and configure the Kubernetes connector:

```yaml
workspaces:
  - name: "azure"
    
    connectors:
      - connectorName: "kubernetes"
        config:
          kubeconfig: "path/to/your/kubeconfig"
          # OR use in-cluster authentication
          # inCluster: true

    webhooks:
      - name: "aloma ui feedback"
```

For Kubernetes authentication, you can use:
- **Kubeconfig file**: Path to your local kubeconfig file
- **In-cluster authentication**: When running ALOMA inside the Kubernetes cluster
- **Service account tokens**: For automated deployment scenarios

### 3. Set Up Kubernetes RBAC (if needed)

Create the necessary RBAC permissions for pod monitoring:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aloma-pod-monitor
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: aloma-pod-monitor-binding
subjects:
- kind: ServiceAccount
  name: aloma-service-account
  namespace: default
roleRef:
  kind: ClusterRole
  name: aloma-pod-monitor
  apiGroup: rbac.authorization.k8s.io
```

### 4. Deploy the Workflow

Run the following command from the `kubernetes-pod-monitoring` folder:

```bash
aloma deploy deploy.yaml
```

### 5. Configure Kubernetes Event Streaming

Set up Kubernetes to send pod events to ALOMA:

```bash
# Verify kubernetes connector is active
aloma connector list

# Configure event streaming for your cluster
aloma connector configure <kubernetes-connector-id>
```

### 6. Test the Workflow

Create a test pod to verify everything is working:

1. **Create a test pod:**
```bash
kubectl run test-pod --image=nginx --restart=Never
```

2. **Monitor the workflow execution:**
```bash
# View recent tasks
aloma task list

# View detailed execution logs
aloma task log <task-id> --logs --changes
```

**CLI Documentation:** [Complete CLI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/CLI)

3. **Verify pod lifecycle tracking:**
```bash
# Update the pod
kubectl label pod test-pod environment=test

# Delete the pod
kubectl delete pod test-pod
```

4. **Check that the workflow captures:**
   - Pod creation event with proper classification
   - Pod update event when labels change
   - Pod deletion event with cleanup tracking

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
4. Add the **Kubernetes** connector:
   - Configure with your cluster credentials
   - Set up event streaming endpoints
   - Test connectivity to your cluster

**Step 2: Configure Webhooks**
1. Go to **Settings → Webhooks**
2. Add webhook for "aloma ui feedback"
3. Configure endpoint for receiving Kubernetes events

**Step 3: Create Steps**
Use **Add New Step** to create each step with the condition and content from the step files:

1. `pod_add.js` - Handles pod creation events
2. `classify_pod_update.js` - Processes pod update events  
3. `pod_delete.js` - Manages pod deletion events

**Step 4: Test the Workflow**
1. Go to the **Tasks** tab
2. Click **New Task**
3. Name it "test pod monitoring"
4. Paste the JSON from `example.json`:
```json
{
  "resourceId": "test-resource-id",
  "type": "add",
  "item": {
    "kind": "Pod",
    "apiVersion": "v1",
    "metadata": {
      "name": "test-pod",
      "namespace": "default"
    }
  }
}
```
5. Click **Create**
6. Monitor execution in the task timeline
7. Test different event types (add, update, delete)

**Web UI Documentation:** [Complete Web UI Guide](https://github.com/aloma-io/aloma-io/blob/main/docs/web-UI)

## Workflow Features

### Real-Time Event Processing
1. **Pod Creation Monitoring**: Automatically detects and logs new pod deployments
2. **Configuration Change Tracking**: Monitors updates to pod specifications and metadata
3. **Deletion Event Capture**: Tracks pod termination and cleanup processes

### Intelligent Classification
4. **Event Categorization**: Automatically tags events by type (add, update, delete)
5. **Metadata Extraction**: Captures pod names, namespaces, and other key information
6. **Timeline Management**: Sets appropriate timeouts for event processing

### Audit and Compliance
7. **Complete Audit Trail**: Maintains comprehensive logs of all pod lifecycle events
8. **Change Classification**: Marks events as processed to prevent duplication
9. **Task Naming**: Dynamic task names reflect actual pod names for easy tracking

### Integration Ready
10. **Webhook Support**: Built-in webhook configuration for external integrations
11. **Extensible Design**: Easy to add additional monitoring for other Kubernetes resources
12. **Alert Integration**: Ready for connection to Slack, email, or other notification systems

## Advanced Configuration

### Event Filtering

Customize which pods to monitor by modifying the conditions:

```javascript
// Monitor only specific namespaces
export const condition = {
  type: 'add', 
  item: {
    kind: 'Pod',
    metadata: {
      namespace: 'production'
    }
  }
};

// Monitor pods with specific labels
export const condition = {
  type: 'add',
  item: {
    kind: 'Pod',
    metadata: {
      labels: {
        app: 'my-application'
      }
    }
  }
};
```

### Timeout Configuration

Adjust processing timeouts based on your needs:

```javascript
// Standard timeout (2 seconds)
task.timeout(2000)

// Extended timeout for complex processing
task.timeout(10000)

// No timeout for persistent monitoring
// task.timeout() - remove this line
```

### Enhanced Metadata Extraction

Add more detailed information capture:

```javascript
export const content = async () => {
  const podName = data.item.metadata.name;
  const namespace = data.item.metadata.namespace;
  const phase = data.item.status?.phase;
  const nodeName = data.item.spec?.nodeName;
  
  task.name(`Pod ${data.type}: ${podName} (${namespace}) - ${phase}`);
  task.tags(['pod', data.type, namespace, phase]);
  
  // Store additional metadata
  data.podDetails = {
    name: podName,
    namespace: namespace,
    phase: phase,
    node: nodeName,
    timestamp: new Date().toISOString()
  };
  
  task.completeOnExpire();
};
```

### Multi-Resource Monitoring

Extend to monitor other Kubernetes resources:

```javascript
// Monitor deployments
export const condition = {type: 'update', item: {kind: 'Deployment'}};

// Monitor services
export const condition = {type: 'add', item: {kind: 'Service'}};

// Monitor configmaps
export const condition = {type: 'delete', item: {kind: 'ConfigMap'}};
```

## Troubleshooting

### Common Issues

1. **Events not appearing**: Check Kubernetes connector configuration and RBAC permissions
2. **Connection failures**: Verify kubeconfig path or in-cluster authentication setup
3. **Missing pod events**: Ensure event streaming is properly configured
4. **Permission denied**: Check service account permissions for pod monitoring

### Debug Commands

```bash
# Check connector status
aloma connector status <kubernetes-connector-id>

# View workflow logs
aloma task log <task-id> --verbose

# Test Kubernetes connectivity
kubectl auth can-i get pods --as=system:serviceaccount:default:aloma-service-account
```

### Kubernetes Event Verification

Verify events are flowing correctly:

```bash
# Watch pod events in real-time
kubectl get events --watch --field-selector involvedObject.kind=Pod

# Check specific pod events
kubectl describe pod <pod-name>

# Verify RBAC permissions
kubectl auth can-i watch pods
```

### Event Payload Structure

Example of expected Kubernetes event payload:

```yaml
resourceId: "unique-resource-identifier"
type: "add"  # or "update" or "delete"
item:
  kind: "Pod"
  apiVersion: "v1"
  metadata:
    name: "my-pod"
    namespace: "default"
    uid: "pod-unique-id"
    labels:
      app: "my-application"
  status:
    phase: "Running"
```

## Integration Examples

### Slack Notifications

Add Slack notifications for critical pod events:

```javascript
// In pod_delete.js, add notification for production pods
if (data.item.metadata.namespace === 'production') {
  await connectors.slack.send({
    text: `🚨 Production pod deleted: ${data.item.metadata.name}`,
    channel: '#ops-alerts'
  });
}
```

### Metrics Collection

Store pod metrics for analysis:

```javascript
// Add metrics tracking
data.metrics = {
  podCount: await getPodCount(),
  timestamp: Date.now(),
  event: data.type
};
```

## Support

If you encounter issues, check the Aloma documentation or contact support.

## License

This workflow is provided as an example for the Aloma automation platform.
