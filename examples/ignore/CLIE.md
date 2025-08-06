# Demo Scenario 2: Stripe Payment Failure Management

## Workflow Overview
Handles Stripe payment failures by automatically looking up customers in HubSpot, logging the failure, notifying appropriate parties (owner or customer), creating follow-up tasks, and processing automatic refunds for VIP customers.

## Process Flow

```mermaid
flowchart TD
    A[Stripe Payment Failure] --> B[Retrieve Customer Data]
    B --> C[Search Contact in HubSpot]
    C --> D{Contact Found?}
    D -->|Yes| E[Log Event in HubSpot]
    D -->|No| F[End - Contact Not Found]
    
    E --> G[Create Payment Failure Note]
    G --> H[Retrieve Payment Intent Details]
    H --> I{Contact Has Owner?}
    
    I -->|Yes| J[Send Slack Alert to Owner]
    I -->|No| K[Send Email to Customer]
    
    J --> L[Create HubSpot Task]
    K --> L
    L --> M{Contact is VIP?}
    
    M -->|Yes| N[Process Automatic Refund]
    M -->|No| O[No Refund Action]
    
    N --> P[Complete Payment Flow]
    O --> P

    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef success fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef notification fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#000
    classDef vip fill:#fff8e1,stroke:#f57f17,stroke-width:2px,color:#000
    classDef endpoint fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000

    class A startEnd
    class B,C,E,G,H,L process
    class D,I,M decision
    class N success
    class J,K notification
    class N,O vip
    class F,P endpoint
```

## Steps Involved

1. **Stripe Payment Failure** - Webhook triggers on payment failure events
2. **Customer Lookup** - Retrieves customer data from Stripe and searches HubSpot
3. **Event Logging** - Creates detailed notes in HubSpot with failure information
4. **Smart Notifications** - Routes alerts to contact owner (Slack) or customer (Email)
5. **Task Management** - Creates high-priority follow-up tasks for support team
6. **VIP Processing** - Automatically processes refunds for VIP customers

## Key Features

- **Intelligent Routing**: Owner-based vs customer notification logic
- **VIP Customer Handling**: Automatic refund processing for premium customers
- **Comprehensive Logging**: Detailed payment failure documentation in HubSpot
- **Multi-Channel Alerts**: Slack for internal team, Email for customers
- **Task Automation**: Automatic support task creation with priority levels

## Prerequisites

- Stripe webhook integration
- HubSpot CRM with VIP status field
- Slack workspace for team notifications
- Email service (SMTP OAuth)
- Custom HubSpot properties configured
