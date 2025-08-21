# What is ALOMA

## What is ALOMA

**No infra. No no-code. Just code and let ALOMA handle the rest.**

ALOMA is a code-first workflow automation platform designed for experienced developers who want the power and flexibility of code without the overhead of building and maintaining infrastructure.&#x20;

Unlike visual workflow builders that limit your logic to what is available in preconfigured forms and require you to string together visual workflows, ALOMA lets trigger tasks with JSON, write JavaScript that runs in response to matching data conditions and dynamically builds workflows for you.

### Why Choose ALOMA Over Visual Tools?

#### The Problem with Visual Workflow Builders

**n8n, Zapier, Make, UiPath and similar tools have built-in weaknesses:**

* Limited pre-configured logic capabilities that can't handle complex or custom requirements
* Often requires adding and hosting code externally on custom infra
* Exponentially complex as workflows grow beyond simple automations
* No or limited tooling to debug automations

**Traditional automation requires full infrastructure:**

* Setting up servers, databases, and monitoring systems
* Managing deployments, scaling, and updates
* Handling errors, retries, and edge cases
* Building authentication and connector management from scratch
* Maintaining security, compliance, and reliability

#### ALOMA's Approach: Data-Triggered Automation

Instead of building rigid workflow diagrams, you define **conditional steps** that respond to data patterns:

```javascript
// Traditional approach: "Always do X, then Y, then Z"
function processOrder(order) {
  validatePayment(order);
  updateInventory(order);
  sendConfirmation(order);
}

// ALOMA approach: "When data matches condition, execute logic"
// Step 1: Payment validation
export const condition = { 
  order: { 
    status: "pending", 
    payment: { method: String } 
  } 
};

export const content = async () => {
  // Validate payment logic
  data.order.paymentValidated = true;
};

// Step 2: Inventory update (only runs after payment validated)
export const condition = { 
  order: { 
    paymentValidated: true, 
    items: Array 
  } 
};

export const content = async () => {
  // Update inventory logic
  data.order.inventoryUpdated = true;
};
```

### Core Value Propositions

#### 🚀 **Minutes to Automation**

Add your code and deploy instantly. No infrastructure setup, no deployment pipelines to configure, no servers to manage.

#### 🔧 **Use Your Own Tools**

Develop with your preferred IDE with CLI, use proper version control, write actual JavaScript. Option to use ALOMA custom Web based IDE at your discretion.

#### 📈 **Scales with Complexity**

Adding the 100th step is as easy as adding the 1st. No exponential visual routing and display complexity that quickly becomes difficult and annoying to maintain.

#### 🔗 **Built-in Integrations**

Integration made simple with Webhooks, FETCH, CRON, pre-built connectors and an SDK to build your own private connectors.&#x20;

#### 💰 **Task Based Pricing**

ALOMA's fair and transparent pricing is based on tasks executed. Contrast this with other who charge per step in a workflow, per line of data output or a flat monthly fee per bot.

#### 💰 **Parallel Processing**

Architected for parallel processing - every task is processed separately so if one fails or has an error it does not have any impact on other tasks. Forget about sequential task automating in bots and concurrent execution limitations.

### Real-World Use Cases

#### AI Agents & Research Automation

```javascript
// Automatically research companies and generate reports
export const condition = { 
  companies: Array, 
  research: { type: "competitor_analysis" } 
};

export const content = async () => {
  for (const company of data.companies) {
    const research = await connectors.openai.chat({
      prompt: `Research ${company.name} for competitive analysis...`,
      model: "gpt-4"
    });
    company.analysis = research.choices[0].message.content;
  }
};
```

#### CRM Data Processing

```javascript
// Process inbound leads and route to appropriate teams
export const condition = { 
  lead: { 
    source: String, 
    score: Number 
  } 
};

export const content = async () => {
  if (data.lead.score > 80) {
    await connectors.hubspotCom.request({
      url: '/crm/v3/objects/contacts',
      options: {
        method: 'POST',
        body: JSON.stringify({
          properties: {
            email: data.lead.email,
            lead_score: data.lead.score
          }
        })
      }
    });
    
    await connectors.slackCom.send({
      channel: "#sales-hot-leads",
      text: `High-value lead from ${data.lead.source}`
    });
  }
};
```

#### Invoice & Document Processing

```javascript
// Extract data from invoices and update multiple systems
export const condition = { 
  document: { 
    type: "invoice", 
    content: String 
  } 
};

export const content = async () => {
  const extracted = await connectors.documentAI.extract({
    content: data.document.content
  });
  
  await connectors.quickbooks.createInvoice(extracted);
  
  await connectors.postgresql.query({
    sql: 'INSERT INTO invoices (data) VALUES ($1)',
    params: [JSON.stringify(extracted)]
  });
  
  data.processed = true;
};
```

### How ALOMA Differs: Conditional Execution Model

Traditional programming is **imperative**: you specify exactly what to do and when. ALOMA is **conditional**: you specify what to do IF certain data conditions are met.

This paradigm shift provides:

* **Automatic workflow orchestration** based on data state
* **Parallel processing** of independent tasks
* **Self-organising logic** that adapts as data changes
* **Incremental complexity** where adding features doesn't break existing logic

#### From Sequential to Conditional

**Traditional Tools:**

```
Start → Validate → Process → Notify → End
```

_Rigid sequence that breaks if any step fails_

**ALOMA:**

```javascript
// When data has customer email → Validate customer
export const condition = { customer: { email: String } };

// When validation passes → Process order  
export const condition = { customer: { validated: true } };

// When processing completes → Send notification
export const condition = { order: { processed: true } };

// When high-value order → Notify sales team
export const condition = { order: { highValueOrder: true } } };// eg for total > 1000
```

_Flexible conditions that adapt to different scenarios_

### Target Developers

ALOMA is built for experienced developers who:

✅ **Want automation power** without infrastructure headaches\
✅ **Prefer code** over visual drag-and-drop interfaces\
✅ **Need complex logic** that visual tools can't handle\
✅ **Value maintainability** and want to avoid technical debt\
✅ **Work in teams** and need proper development workflows\
✅ **Delegate implementation** to junior developers after design

### Getting Started

Ready to move from visual tools to code-first automation?

1. [**5-Minute Quickstart**](https://claude.ai/chat/5-minute-quickstart.md) - Build your first automation
2. [**Understanding Conditional Steps**](https://claude.ai/chat/understanding-conditional-steps.md) - Learn the paradigm
3. [**Examples & Tutorials**](https://claude.ai/chat/examples-tutorials.md) - See real implementations

**Move Fast and Automate Quickly with ALOMA's Rapid Iteration Approach**
