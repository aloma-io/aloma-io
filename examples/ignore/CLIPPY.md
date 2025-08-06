flowchart TD
    A[PagerDuty Alert] --> B[Parse Incident Details]
    B --> C[Get Latest GitHub Commit]
    C --> D[Extract Commit Information]
    D --> E[Format Rich Slack Message]
    
    E --> F[Post Initial Slack Alert]
    F --> G[Create Slack Thread]
    G --> H[Add Incident Details to Thread]
    H --> I[Add Commit Context to Thread]
    
    I --> J[Create Jira Bug Ticket]
    J --> K[Link Jira to PagerDuty]
    K --> L[Determine On-Call Engineer]
    
    L --> M{Critical Severity?}
    M -->|Yes| N[Send SMS to On-Call]
    M -->|No| O[Skip SMS Notification]
    
    N --> P[Include Incident & Jira Links]
    O --> Q[Complete Incident Response]
    P --> Q

    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef github fill:#f6f8fa,stroke:#24292e,stroke-width:2px,color:#000
    classDef slack fill:#4a154b,stroke:#4a154b,stroke-width:2px,color:#fff
    classDef jira fill:#0052cc,stroke:#0052cc,stroke-width:2px,color:#fff
    classDef sms fill:#e91e63,stroke:#ad1457,stroke-width:2px,color:#fff
    classDef endpoint fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000

    class A startEnd
    class B,D,K,L process
    class M decision
    class C github
    class E,F,G,H,I slack
    class J jira
    class N,P sms
    class O,Q endpoint
