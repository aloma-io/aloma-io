# Aloma Examples

This directory contains real-world automation examples that demonstrate Aloma's capabilities for business process automation.

## 🎯 Available Examples

### [HubSpot Integration](hubspot/)
**Company and Contact Management Automation**

A comprehensive example showing how to:
- Connect to HubSpot API for company and contact management
- Process incoming webhook data
- Automate contact creation and company updates
- Handle data transformation and validation

**Key Features:**
- Webhook integration for real-time data
- HubSpot API integration
- Data transformation and mapping
- Error handling and validation

### [Waitlist Automation](waitlist_automation/)
**Complete Lead Processing Workflow**

A full-featured automation that demonstrates:
- Multi-step lead processing pipeline
- Integration with multiple services (HubSpot, Google Sheets, Slack)
- AI-powered research and enrichment
- Automated notifications and follow-ups

**Key Features:**
- Lead capture and validation
- AI-powered CTO research using Perplexity
- Multi-platform data distribution
- Automated email notifications
- Slack integration for team alerts

## 🚀 Getting Started with Examples

### Prerequisites
- Aloma account ([sign up here](https://home.aloma.io/))
- Required service accounts (HubSpot, Airtable, etc.)
- Basic understanding of Aloma concepts (see [documentation](../docs/))

### How to Use Examples

1. **Choose an Example** - Select the example that matches your use case
2. **Review Configuration** - Examine the connector and step configurations
3. **Set Up Dependencies** - Create required accounts and API keys
4. **Deploy** - Use the provided `deploy.yaml` files
5. **Customize** - Modify steps and logic for your specific needs

### Example Structure

Each example includes:
```
example-name/
├── connector/          # API connector configurations
├── step/              # Individual automation steps
├── task/              # Sample task data
├── deploy.yaml        # Deployment configuration
└── README.md          # Detailed setup instructions
```

## 🔧 Customization Guide

### Modifying Examples
1. **Clone the Structure** - Use existing examples as templates
2. **Update Connectors** - Modify API configurations for your services
3. **Adjust Steps** - Customize logic and data transformations
4. **Test Thoroughly** - Validate with sample data before production

### Best Practices
- Start with simple examples and gradually add complexity
- Use descriptive names for steps and connectors
- Implement proper error handling
- Document your customizations
- Test with realistic data volumes

## 📚 Related Documentation

- **[Getting Started](../docs/getting-started.md)** - Learn Aloma basics
- **[Steps Guide](../docs/basics/steps.md)** - Understanding automation logic
- **[Integrations](../docs/basics/integration.md)** - Connecting external services
- **[Workspaces](../docs/basics/workspaces.md)** - Organizing your automations

## 🤝 Contributing Examples

We welcome new examples! To contribute:

1. **Create a New Directory** - Use a descriptive name
2. **Include All Components** - Connectors, steps, tasks, and deployment config
3. **Add Documentation** - Clear README with setup instructions
4. **Test Thoroughly** - Ensure examples work as documented
5. **Submit Pull Request** - Share your automation with the community

## 📞 Support

- **Example Issues**: Open an issue in this repository
- **Product Support**: Contact support at [aloma.io](https://aloma.io/)
- **Community**: Join discussions and share your automations

---

**Ready to automate?** Pick an example and start building your first workflow!
