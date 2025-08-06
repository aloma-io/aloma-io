# Demo Scenario 1: Zero-friction GitHub Triage

## Workflow Overview
Automatically monitors GitHub repository changes, uses AI to create non-technical summaries of commits affecting the .github folder, and notifies the scrum team via Slack with actionable Jira ticket suggestions.

## Process Flow

```mermaid
flowchart TD
    A[GitHub Webhook] --> B[Process GitHub Changes]
    B --> C{.github Folder Modified?}
    C -->|Yes| D[Extract Diff Data]
    C -->|No| E[End - No Relevant Changes]
    
    D --> F[AI Summary Generation]
    F --> G[Create Non-Technical Summary]
    G --> H[Generate Jira Ticket Title]
    H --> I[Format Slack Message]
    
    I --> J[Send Slack Notification]
    J --> K[Notify Scrum Team]
    K --> L[Complete GitHub Triage]

    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef ai fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px,color:#000
    classDef notification fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#000
    classDef endpoint fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000

    class A startEnd
    class B,D,I,K process
    class C decision
    class F,G,H ai
    class J notification
    class E,L endpoint
```

## Steps Involved

1. **GitHub Webhook** - Receives repository change notifications
2. **Process GitHub Changes** - Analyzes commit data for relevant modifications
3. **AI Summary Generation** - Uses Perplexity AI to create non-technical summaries
4. **Slack Notification** - Alerts scrum team with Jira ticket recommendations

## Key Features

- **Smart Filtering**: Only processes changes to .github folder
- **AI-Powered Analysis**: Converts technical diffs into business-friendly summaries
- **Automated Triage**: Suggests Jira ticket titles and descriptions
- **Team Integration**: Direct Slack notifications to development team

## Prerequisites

- GitHub webhook configured
- Perplexity AI connector
- Slack workspace access
- Designated scrum team channel
