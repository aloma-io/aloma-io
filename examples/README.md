# Aloma Examples

Real-world automation examples that demonstrate Aloma's capabilities for business process automation.

## Available Examples

### [HubSpot Integration](hubspot/)
**Company and Contact Management Automation**

Complete example showing how to:
- Connect to HubSpot API for company and contact management
- Process incoming webhook data
- Automate contact creation and company updates
- Handle data transformation and validation

**Key features:**
- Webhook integration for real-time data
- HubSpot API integration
- Data transformation and mapping
- Error handling and validation

### [Waitlist Automation](waitlist_automation/)
**Complete Lead Processing Workflow**

Full-featured automation demonstrating:
- Multi-step lead processing pipeline
- Integration with multiple services (HubSpot, Google Sheets, Slack)
- AI-powered research and enrichment
- Automated notifications and follow-ups

**Key features:**
- Lead capture and validation
- AI-powered CTO research using Perplexity
- Multi-platform data distribution
- Automated email notifications
- Slack integration for team alerts

## Getting Started with Examples

### Prerequisites
- Aloma account ([sign up here](https://home.aloma.io/))
- Required service accounts (HubSpot, Airtable, etc.)
- Basic understanding of Aloma concepts

### How to Use Examples

1. **Choose an example** - Select the example that matches your use case
2. **Review configuration** - Examine the connector and step configurations
3. **Set up dependencies** - Create required accounts and API keys
4. **Deploy** - Use the provided `deploy.yaml` files
5. **Customize** - Modify steps and logic for your specific needs

### Example Structure

Each example includes:

example-name/
├── connector/          # API connector configurations
├── step/              # Individual automation steps
├── task/              # Sample task data
├── deploy.yaml        # Deployment configuration
└── README.md          # Detailed setup instructions

## Customization Guide

### Modifying Examples

1. **Clone the structure** - Use existing examples as templates
2. **Update connectors** - Modify API configurations for your services
3. **Adjust steps** - Customize logic and data transformations
4. **Test thoroughly** - Validate with sample data before production

### Best Practices

- Start with simple examples and gradually add complexity
- Use descriptive names for steps and connectors
- Implement proper error handling
- Document your customizations
- Test with realistic data volumes

## Contributing Examples

We welcome new examples! To contribute:

1. **Create a new directory** - Use a descriptive name
2. **Include all components** - Connectors, steps, tasks, and deployment config
3. **Add documentation** - Clear README with setup instructions
4. **Test thoroughly** - Ensure examples work as documented
5. **Submit pull request** - Share your automation with the community

## Support

- **Example Issues** - Open an issue in this repository
- **Product Support** - Contact support at support@aloma.io
- **Community** - Join discussions and share your automations - coming soon

---

**Ready to start?** Pick an example and start building your first workflow.
