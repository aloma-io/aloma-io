# GitHub Release Management CI/CD Automation Flowchart

This flowchart illustrates the complete automated release management process from commit to deployment with intelligent version management and team notifications.

```mermaid
flowchart TD
    A[Git Commit to Main Branch] --> B{Commit Classification}
    B -->|Valid Release Commit| C[Get Latest Tag]
    B -->|Non-Release Commit| Z[End]
    
    C --> D{Latest Tag Exists?}
    D -->|No| E[Initialize Version 0.0.1]
    D -->|Yes| F[Calculate Next Version]
    
    E --> G[Create Git Tag]
    F --> G[Create Git Tag]
    
    G --> H[Create GitHub Release]
    H --> I[Send Success Notification to Slack]
    
    I --> J{Release Type Check}
    J -->|Standard Release| K[End - Standard Flow]
    J -->|Connector Release| L[Find All Connector Repositories]
    
    L --> M[Filter Repositories with 'connector-' Prefix]
    M --> N[Fetch Repository Tags]
    N --> O[Tag All Connectors with New Release]
    
    O --> P[Update Connector Images]
    P --> Q{Image Update Successful?}
    Q -->|Yes| R[Confirm Deployment Success]
    Q -->|No| S[Handle Deployment Error]
    
    R --> T[Send Connector Success Notification]
    S --> U[Send Error Notification]
    
    T --> V[End - Connector Flow Complete]
    U --> V
    
    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef success fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000
    
    class A,K,V,Z startEnd
    class C,E,F,G,H,L,M,N,O,P process
    class B,D,J,Q decision
    class I,R,T success
    class S,U error
```

## Workflow Description

### Main Release Flow
1. **Git Commit**: Developer commits to main branch
2. **Commit Classification**: System determines if commit should trigger a release
3. **Version Management**: Retrieves current version and calculates next semantic version
4. **Tag Creation**: Creates Git tag for the new version
5. **Release Publishing**: Publishes GitHub release with auto-generated notes
6. **Notifications**: Sends success notification to Slack channel

### Connector Release Flow
For repositories identified as connectors:
1. **Repository Discovery**: Finds all repositories with "connector-" prefix
2. **Bulk Processing**: Tags all connector repositories with new version
3. **Image Deployment**: Updates connector images in infrastructure
4. **Deployment Verification**: Confirms successful deployment
5. **Final Notifications**: Sends completion status to team

## Key Features

- **Automated Versioning**: Semantic version calculation with patch increment
- **Smart Tagging**: Git tag creation with custom prefixes for specific repos
- **Bulk Releases**: Simultaneous release of multiple connector repositories  
- **Deployment Automation**: Connector image updates with confirmation
- **Team Notifications**: Slack integration for success/failure alerts
- **Smart Filtering**: Excludes specific repositories from automatic releases

## Prerequisites

- ALOMA CLI installed
- GitHub repository admin rights
- Slack workspace access
- Proper webhook configuration

## Usage

This flowchart can be embedded in your GitHub README or documentation. The Mermaid syntax will render automatically on GitHub, providing an interactive visual guide to your CI/CD process.

To customize the workflow, modify the trigger conditions and repository filters as described in the full documentation.
