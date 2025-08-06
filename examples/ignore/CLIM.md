# Demo Scenario 3: Email-triggered Contact Enrichment

## Workflow Overview
Processes incoming emails by extracting sender information, finding contacts in HubSpot, retrieving associated company data, creating follow-up tasks, and triggering advanced data enrichment through FullEnrich API integration.

## Process Flow

```mermaid
flowchart TD
    A[Email Received] --> B[Extract Email Address]
    B --> C[Search Contact in HubSpot]
    C --> D{Contact Found?}
    D -->|Yes| E[Get Associated Company]
    D -->|No| F[End - Contact Not Found]
    
    E --> G{Company Data Available?}
    G -->|Yes| H[Create Contact Task]
    G -->|No| I[Create Task Without Company]
    
    H --> J[Add Custom Subject & Text]
    I --> J
    J --> K[Associate Task with Contact]
    K --> L[Initiate FullEnrich Request]
    
    L --> M[Send Enrichment API Call]
    M --> N[Set Webhook for Response]
    N --> O[Complete Email Processing]

    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef enrichment fill:#e8eaf6,stroke:#3f51b5,stroke-width:2px,color:#000
    classDef task fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef endpoint fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000

    class A startEnd
    class B,C,E process
    class D,G decision
    class L,M,N enrichment
    class H,I,J,K task
    class F,O endpoint
```

## Steps Involved

1. **Email Processing** - Extracts sender email address from incoming messages
2. **Contact Search** - Looks up contact in HubSpot using email address
3. **Company Association** - Retrieves associated company data if available
4. **Task Creation** - Creates personalized tasks with custom subject and content
5. **Data Enrichment** - Initiates FullEnrich API request for additional contact data

## Key Features

- **Email Trigger Integration**: Automatic processing of incoming emails
- **HubSpot Integration**: Seamless contact and company lookup
- **Dynamic Task Creation**: Custom tasks based on available data
- **Advanced Enrichment**: FullEnrich API integration for comprehensive data
- **Webhook Response**: Configured for asynchronous enrichment results

## Prerequisites

- Email service integration
- HubSpot CRM access
- FullEnrich API account and webhook endpoint
- Custom task fields in HubSpot
- Email parsing capabilities
