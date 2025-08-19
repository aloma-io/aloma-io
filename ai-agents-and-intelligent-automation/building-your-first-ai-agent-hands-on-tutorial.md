# Building Your First AI Agent (Hands-on Tutorial):

## Building Your First AI Agent

### Building Your First AI Agent (Hands-on Tutorial)

**Build a complete customer service AI agent that learns, adapts, and makes intelligent decisions. This step-by-step tutorial demonstrates ALOMA's conditional execution model enabling true agent intelligence through practical implementation.**

#### What You'll Build

In this tutorial, you'll create an intelligent customer service agent that:

* **Maintains conversation memory** across multiple interactions
* **Adapts its strategy** based on customer behavior and sentiment
* **Makes autonomous decisions** about escalation and resolution
* **Handles errors gracefully** with fallback mechanisms
* **Learns from each interaction** to improve future responses

This agent demonstrates how ALOMA's conditional execution transforms simple AI calls into sophisticated, stateful intelligence.

#### Prerequisites

Before starting, ensure you have:

```bash
# ALOMA CLI installed and authenticated
aloma --version
aloma auth

# Create a new workspace for this tutorial
aloma workspace add "Customer Service Agent Tutorial" --tags "tutorial,ai-agent"
aloma workspace switch "Customer Service Agent Tutorial"

# Add required connectors
aloma connector add "openai.com" --config apiKey="your-openai-api-key"
aloma connector add "E-Mail (SMTP - OAuth)" --name "Support Email"
```

#### Tutorial Overview

We'll build the agent through five conditional steps that create emergent intelligence:

1. **Agent Initialization**: Set up memory and context
2. **Inquiry Analysis**: AI-powered reasoning about customer needs
3. **Strategy Decision**: Adaptive approach selection
4. **Response Generation**: Context-aware communication
5. **Learning & Escalation**: Continuous improvement and fallbacks

***

### Step 1: Agent Initialization and Memory Setup

The foundation of any ALOMA AI agent is **persistent memory**. Unlike simple AI calls, agents maintain state across interactions.

#### Create the Memory Initialization Step

```bash
# Create the first step
aloma step add "initialize_agent_memory" \
  -c '{"customer":{"inquiry":"String","supportTicketId":"String"},"agent":{"memoryInitialized":{"$exists":false}}}'
```

#### Implement Memory Logic

```javascript
// Step: Initialize Agent Memory
export const condition = {
  customer: {
    inquiry: String,
    supportTicketId: String
  },
  agent: {
    memoryInitialized: { $exists: false }
  }
};

export const content = async () => {
  console.log(`Initializing AI agent for ticket: ${data.customer.supportTicketId}`);
  
  // Create persistent agent memory structure
  data.agent = {
    // Conversation context
    conversationHistory: [
      {
        role: 'customer',
        content: data.customer.inquiry,
        timestamp: new Date().toISOString(),
        ticketId: data.customer.supportTicketId
      }
    ],
    
    // Customer profile (learned over time)
    customerProfile: {
      sentiment: null,
      communicationStyle: null,
      issueComplexity: null,
      escalationRisk: 0,
      satisfactionPrediction: null
    },
    
    // Agent goals and state
    goals: [
      'understand_customer_issue',
      'provide_helpful_solution', 
      'ensure_customer_satisfaction',
      'avoid_unnecessary_escalation'
    ],
    currentGoal: 'understand_customer_issue',
    
    // Learning metrics
    interactionCount: 1,
    successfulResolutions: 0,
    escalationCount: 0,
    
    // State management
    memoryInitialized: true,
    lastUpdated: new Date().toISOString()
  };
  
  // Initialize conversation context
  data.conversation = {
    ticketId: data.customer.supportTicketId,
    status: 'active',
    startedAt: new Date().toISOString(),
    phase: 'initial_analysis'
  };
  
  console.log('Agent memory initialized with conversation context');
};
```

**Key Concepts Demonstrated:**

* **Persistent Memory**: The `data.agent` object maintains state across all steps
* **Structured Learning**: Agent tracks metrics to improve over time
* **Goal-Oriented Design**: Clear objectives guide agent behavior
* **Conversation Context**: Maintains dialogue state and history

***

### Step 2: Intelligent Inquiry Analysis

Now the agent analyzes the customer inquiry using AI reasoning while maintaining full context.

#### Create the Analysis Step

```bash
aloma step add "analyze_customer_inquiry" \
  -c '{"agent":{"memoryInitialized":true,"analysis":{"$exists":false}},"customer":{"inquiry":"String"}}'
```

#### Implement AI-Powered Analysis

```javascript
// Step: AI-Powered Customer Inquiry Analysis
export const condition = {
  agent: {
    memoryInitialized: true,
    analysis: { $exists: false }
  },
  customer: {
    inquiry: String
  }
};

export const content = async () => {
  console.log('Agent analyzing customer inquiry with AI reasoning...');
  
  try {
    // AI agent performs sophisticated analysis
    const analysisResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an intelligent customer service agent analyzing a support inquiry. Provide structured analysis including:

1. Customer sentiment (frustrated/neutral/positive/satisfied)
2. Issue complexity (simple/moderate/complex/expert-required)
3. Urgency level (low/medium/high/critical)
4. Issue category (technical/billing/product/account)
5. Escalation risk (0-100 scale)
6. Communication style (formal/casual/technical/emotional)
7. Resolution likelihood (low/medium/high)
8. Recommended approach strategy

Respond with valid JSON only.`
        },
        {
          role: 'user',
          content: `Analyze this customer inquiry:

Support Ticket: ${data.customer.supportTicketId}
Customer Message: "${data.customer.inquiry}"

Provide comprehensive analysis in JSON format.`
        }
      ]
    });
    
    // Parse and store AI analysis
    const analysis = JSON.parse(analysisResult.choices[0].message.content);
    
    // Update agent memory with analysis
    data.agent.analysis = {
      ...analysis,
      analyzedAt: new Date().toISOString(),
      confidence: 'high'
    };
    
    // Update customer profile based on analysis
    data.agent.customerProfile = {
      sentiment: analysis.customerSentiment,
      communicationStyle: analysis.communicationStyle,
      issueComplexity: analysis.issueComplexity,
      escalationRisk: analysis.escalationRisk,
      urgencyLevel: analysis.urgencyLevel
    };
    
    // Determine if this requires immediate escalation
    if (analysis.escalationRisk > 80 || analysis.urgencyLevel === 'critical') {
      data.agent.requiresImmediateEscalation = true;
      data.agent.escalationReason = 'high_risk_or_critical_urgency';
    }
    
    // Update conversation phase
    data.conversation.phase = 'strategy_selection';
    
    console.log(`Analysis complete: ${analysis.issueCategory} issue with ${analysis.escalationRisk}% escalation risk`);
    
  } catch (error) {
    console.error('Analysis failed:', error.message);
    
    // Fallback analysis for error handling
    data.agent.analysis = {
      customerSentiment: 'unknown',
      issueComplexity: 'moderate',
      escalationRisk: 50,
      analysisError: true,
      error: error.message,
      fallbackApplied: true
    };
    
    data.agent.requiresHumanReview = true;
  }
};
```

**Key Concepts Demonstrated:**

* **AI-Powered Reasoning**: Complex analysis beyond simple keyword matching
* **Error Handling**: Graceful fallbacks when AI analysis fails
* **Context Learning**: Agent updates its understanding of the customer
* **Risk Assessment**: Intelligent escalation decision-making

***

### Step 3: Adaptive Strategy Decision

The agent now selects an approach strategy based on its analysis, demonstrating autonomous decision-making.

#### Create Strategy Selection Step

```bash
aloma step add "select_strategy" \
  -c '{"agent":{"analysis":"Object","strategy":{"$exists":false}},"conversation":{"phase":"strategy_selection"}}'
```

#### Implement Strategy Logic

```javascript
// Step: Adaptive Strategy Selection
export const condition = {
  agent: {
    analysis: Object,
    strategy: { $exists: false }
  },
  conversation: {
    phase: "strategy_selection"
  }
};

export const content = async () => {
  const analysis = data.agent.analysis;
  console.log(`Selecting strategy for ${analysis.issueCategory} issue with ${analysis.escalationRisk}% escalation risk`);
  
  // Check for immediate escalation conditions
  if (data.agent.requiresImmediateEscalation) {
    data.agent.strategy = {
      approach: 'immediate_escalation',
      reasoning: data.agent.escalationReason,
      confidence: 'high',
      escalationRequired: true
    };
    
    data.conversation.phase = 'escalation';
    console.log('Strategy: Immediate escalation required');
    return;
  }
  
  try {
    // AI agent selects optimal strategy based on analysis
    const strategyResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI agent selecting the optimal customer service strategy. Based on the analysis provided, choose the best approach:

Available Strategies:
- "empathetic_resolution": High empathy, focus on emotional support first
- "technical_guidance": Direct technical solution with detailed steps  
- "escalation_preparation": Gather more info before human handoff
- "simple_resolution": Quick, straightforward solution
- "educational_approach": Teach customer to prevent future issues

Consider the customer's emotional state, issue complexity, and escalation risk.

Respond with JSON containing:
- strategy: chosen approach
- reasoning: why this strategy is optimal
- tactics: specific communication tactics to use
- successMetrics: how to measure if strategy is working
- fallbackStrategy: what to do if this approach fails`
        },
        {
          role: 'user',
          content: `Customer Analysis:
${JSON.stringify(analysis, null, 2)}

Customer Profile:
${JSON.stringify(data.agent.customerProfile, null, 2)}

Select optimal strategy in JSON format.`
        }
      ]
    });
    
    const strategy = JSON.parse(strategyResult.choices[0].message.content);
    
    data.agent.strategy = {
      ...strategy,
      selectedAt: new Date().toISOString(),
      confidence: 'high'
    };
    
    // Update agent goals based on strategy
    data.agent.currentGoal = strategy.strategy === 'escalation_preparation' 
      ? 'prepare_for_escalation' 
      : 'provide_resolution';
    
    data.conversation.phase = 'response_generation';
    
    console.log(`Strategy selected: ${strategy.strategy} - ${strategy.reasoning}`);
    
  } catch (error) {
    console.error('Strategy selection failed:', error.message);
    
    // Fallback strategy selection
    const fallbackStrategy = analysis.escalationRisk > 60 
      ? 'escalation_preparation' 
      : 'empathetic_resolution';
    
    data.agent.strategy = {
      approach: fallbackStrategy,
      reasoning: 'Fallback strategy due to AI selection failure',
      confidence: 'low',
      fallbackApplied: true,
      error: error.message
    };
    
    data.conversation.phase = 'response_generation';
    console.log(`Fallback strategy applied: ${fallbackStrategy}`);
  }
};
```

**Key Concepts Demonstrated:**

* **Autonomous Decision-Making**: Agent chooses strategy without human input
* **Context-Aware Logic**: Decisions based on full analysis and customer profile
* **Multiple Strategy Options**: Flexible approach selection
* **Robust Fallbacks**: Handles AI reasoning failures gracefully

***

### Step 4: Context-Aware Response Generation

The agent generates a personalized response using its selected strategy and full conversation context.

#### Create Response Generation Step

```bash
aloma step add "generate_response" \
  -c '{"agent":{"strategy":"Object"},"conversation":{"phase":"response_generation"},"response":{"$exists":false}}'
```

#### Implement Response Logic

```javascript
// Step: Context-Aware Response Generation
export const condition = {
  agent: {
    strategy: Object
  },
  conversation: {
    phase: "response_generation"
  },
  response: { $exists: false }
};

export const content = async () => {
  const strategy = data.agent.strategy;
  const customerProfile = data.agent.customerProfile;
  
  console.log(`Generating response using ${strategy.approach} strategy`);
  
  try {
    // AI generates contextual response based on strategy and full agent memory
    const responseResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a customer service AI agent generating a response. Use the selected strategy and adapt your communication style to the customer's profile.

Strategy: ${strategy.approach}
Reasoning: ${strategy.reasoning}
Tactics: ${JSON.stringify(strategy.tactics)}

Customer Profile:
- Sentiment: ${customerProfile.sentiment}
- Communication Style: ${customerProfile.communicationStyle}
- Issue Complexity: ${customerProfile.issueComplexity}

Generate a helpful, professional response that:
1. Acknowledges the customer's inquiry appropriately
2. Follows the chosen strategy approach
3. Matches the customer's communication style
4. Addresses their specific issue
5. Sets clear expectations for next steps

If escalation is needed, explain the process clearly and professionally.

Provide response in JSON format:
{
  "message": "your response to the customer", 
  "tone": "tone used (empathetic/professional/technical/friendly)",
  "nextActions": ["list", "of", "next", "steps"],
  "escalationNeeded": boolean,
  "estimatedResolutionTime": "time estimate if applicable"
}`
        },
        {
          role: 'user',
          content: `Original Customer Inquiry: "${data.customer.inquiry}"

Full Context:
- Ticket ID: ${data.customer.supportTicketId}
- Analysis: ${JSON.stringify(data.agent.analysis, null, 2)}
- Strategy: ${JSON.stringify(strategy, null, 2)}
- Customer Profile: ${JSON.stringify(customerProfile, null, 2)}

Generate appropriate response.`
        }
      ]
    });
    
    const responseData = JSON.parse(responseResult.choices[0].message.content);
    
    data.response = {
      ...responseData,
      generatedAt: new Date().toISOString(),
      strategy: strategy.approach,
      ticketId: data.customer.supportTicketId
    };
    
    // Update conversation history with agent response
    data.agent.conversationHistory.push({
      role: 'agent',
      content: responseData.message,
      timestamp: new Date().toISOString(),
      strategy: strategy.approach,
      tone: responseData.tone
    });
    
    // Update agent metrics
    data.agent.interactionCount += 1;
    data.agent.lastUpdated = new Date().toISOString();
    
    // Determine next phase
    if (responseData.escalationNeeded) {
      data.conversation.phase = 'escalation';
      data.agent.escalationCount += 1;
    } else {
      data.conversation.phase = 'monitoring';
      data.agent.successfulResolutions += 1;
    }
    
    console.log(`Response generated: ${responseData.tone} tone, escalation ${responseData.escalationNeeded ? 'required' : 'avoided'}`);
    
  } catch (error) {
    console.error('Response generation failed:', error.message);
    
    // Fallback response
    data.response = {
      message: "Thank you for contacting support. I'm experiencing a technical issue processing your request. Let me escalate this to a human agent who can assist you immediately.",
      escalationNeeded: true,
      fallbackApplied: true,
      error: error.message,
      generatedAt: new Date().toISOString()
    };
    
    data.conversation.phase = 'escalation';
    data.agent.escalationCount += 1;
  }
};
```

**Key Concepts Demonstrated:**

* **Context-Aware Communication**: Response considers full conversation history
* **Strategy Implementation**: AI follows the selected approach consistently
* **Style Adaptation**: Matches customer's communication preferences
* **Metrics Tracking**: Agent monitors its own performance
* **Graceful Degradation**: Fallback ensures customer never gets stuck

***

### Step 5: Learning and Escalation Management

The final step handles escalation decisions and agent learning for continuous improvement.

#### Create Learning & Escalation Step

```bash
aloma step add "handle_escalation_and_learning" \
  -c '{"response":"Object","conversation":{"phase":{"$in":["escalation","monitoring"]}},"learning":{"$exists":false}}'
```

#### Implement Learning Logic

```javascript
// Step: Agent Learning and Escalation Management
export const condition = {
  response: Object,
  conversation: {
    phase: { $in: ["escalation", "monitoring"] }
  },
  learning: { $exists: false }
};

export const content = async () => {
  const response = data.response;
  const phase = data.conversation.phase;
  
  console.log(`Processing ${phase} phase with learning integration`);
  
  // Handle escalation if required
  if (phase === 'escalation' || response.escalationNeeded) {
    console.log('Processing escalation workflow...');
    
    try {
      // Send escalation email to human agents
      await connectors.supportEmail.send({
        to: 'support-escalation@company.com',
        subject: `ESCALATION: Ticket ${data.customer.supportTicketId}`,
        body: `AI Agent Escalation Report
        
Ticket ID: ${data.customer.supportTicketId}
Customer Inquiry: "${data.customer.inquiry}"

AI Analysis:
${JSON.stringify(data.agent.analysis, null, 2)}

Strategy Used: ${data.agent.strategy.approach}
Escalation Reason: ${data.agent.strategy.reasoning || 'Strategic escalation'}

Customer Profile:
- Sentiment: ${data.agent.customerProfile.sentiment}
- Issue Complexity: ${data.agent.customerProfile.issueComplexity}
- Escalation Risk: ${data.agent.customerProfile.escalationRisk}%

Conversation History:
${JSON.stringify(data.agent.conversationHistory, null, 2)}

Recommended Human Action: Review and take over conversation immediately.`
      });
      
      data.escalation = {
        escalated: true,
        escalatedAt: new Date().toISOString(),
        reason: data.agent.strategy.reasoning || 'Strategic escalation',
        humanNotified: true
      };
      
      console.log('Escalation email sent to human agents');
      
    } catch (error) {
      console.error('Escalation notification failed:', error.message);
      
      data.escalation = {
        escalated: true,
        escalatedAt: new Date().toISOString(),
        notificationFailed: true,
        error: error.message
      };
    }
  }
  
  // Agent learning and performance analysis
  try {
    const learningAnalysis = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are analyzing an AI agent's performance to extract learning insights. Evaluate:

1. Strategy effectiveness (was the chosen approach optimal?)
2. Communication quality (did tone and style match customer needs?)
3. Decision accuracy (were escalation decisions appropriate?)
4. Areas for improvement
5. Successful patterns to reinforce

Provide analysis in JSON format with specific, actionable insights.`
        },
        {
          role: 'user',
          content: `Agent Performance Data:

Customer Inquiry: "${data.customer.inquiry}"
Analysis: ${JSON.stringify(data.agent.analysis, null, 2)}
Strategy: ${JSON.stringify(data.agent.strategy, null, 2)}
Response: ${JSON.stringify(response, null, 2)}
Escalated: ${phase === 'escalation'}

Agent Metrics:
- Total Interactions: ${data.agent.interactionCount}
- Successful Resolutions: ${data.agent.successfulResolutions}
- Escalation Count: ${data.agent.escalationCount}
- Success Rate: ${(data.agent.successfulResolutions / data.agent.interactionCount * 100).toFixed(1)}%

Analyze performance and provide learning insights.`
        }
      ]
    });
    
    const learning = JSON.parse(learningAnalysis.choices[0].message.content);
    
    data.learning = {
      ...learning,
      performanceMetrics: {
        interactionCount: data.agent.interactionCount,
        successfulResolutions: data.agent.successfulResolutions,
        escalationCount: data.agent.escalationCount,
        successRate: (data.agent.successfulResolutions / data.agent.interactionCount * 100).toFixed(1)
      },
      analyzedAt: new Date().toISOString()
    };
    
    // Update agent knowledge based on learning
    data.agent.learningInsights = data.agent.learningInsights || [];
    data.agent.learningInsights.push({
      ticketId: data.customer.supportTicketId,
      insights: learning.keyInsights,
      improvements: learning.areasForImprovement,
      learnedAt: new Date().toISOString()
    });
    
    console.log(`Learning analysis complete: ${learning.strategyEffectiveness} strategy effectiveness`);
    
  } catch (error) {
    console.error('Learning analysis failed:', error.message);
    
    data.learning = {
      analysisError: true,
      error: error.message,
      fallbackLearning: 'Basic metrics tracking only'
    };
  }
  
  // Complete the conversation
  data.conversation.completedAt = new Date().toISOString();
  data.conversation.status = phase === 'escalation' ? 'escalated' : 'resolved';
  
  console.log(`Customer service agent completed processing ticket ${data.customer.supportTicketId}`);
  
  // Mark task as complete
  task.complete();
};
```

**Key Concepts Demonstrated:**

* **Automated Escalation**: Seamless handoff to human agents when needed
* **Performance Learning**: Agent analyzes its own effectiveness
* **Knowledge Accumulation**: Insights persist for future interactions
* **Complete Workflow**: Proper task completion and status tracking

***

### Testing Your AI Agent

#### Test with Sample Data

Create test cases to validate your agent's behavior:

```bash
# Test Case 1: Simple inquiry (should resolve without escalation)
aloma task new "Simple Support Request" \
  -d '{
    "customer": {
      "inquiry": "Hi, I forgot my password and cant log into my account. Can you help me reset it?",
      "supportTicketId": "TICK-001"
    }
  }'

# Test Case 2: Complex issue (may require escalation)  
aloma task new "Complex Billing Issue" \
  -d '{
    "customer": {
      "inquiry": "Im extremely frustrated! Ive been charged three times for the same subscription and your automatic billing system seems completely broken. This is the third time Ive contacted support about this and Im considering legal action. I need this fixed immediately!",
      "supportTicketId": "TICK-002"
    }
  }'

# Test Case 3: Technical inquiry
aloma task new "Technical Question" \
  -d '{
    "customer": {
      "inquiry": "I am integrating your API and getting 429 rate limit errors when making batch requests. My implementation follows the documentation but Im hitting limits with only 50 requests per minute. Can you explain the actual rate limiting algorithm?",
      "supportTicketId": "TICK-003"
    }
  }'
```

#### Monitor Agent Performance

```bash
# Check task execution
aloma task list --state done

# View agent decisions and learning
aloma task show <task-id>

# Monitor escalation patterns
aloma task list --filter '{"escalation.escalated": true}'
```

#### Expected Behaviors

**Test Case 1 (Simple)**:

* Agent should choose "simple\_resolution" strategy
* Generate helpful password reset instructions
* No escalation required
* High confidence resolution

**Test Case 2 (Complex/Emotional)**:

* Agent detects high frustration sentiment
* Selects "empathetic\_resolution" or "escalation\_preparation"
* Escalation likely due to emotional intensity and billing complexity
* Professional, empathetic tone in response

**Test Case 3 (Technical)**:

* Recognizes technical complexity
* Chooses "technical\_guidance" strategy
* May escalate to technical team depending on API expertise available
* Detailed, technical communication style

***

### Understanding Agent Intelligence

#### What Makes This an "Agent"

Unlike simple AI API calls, this implementation demonstrates true agent capabilities:

1. **Persistent Memory**: Each step builds upon previous context
2. **Autonomous Decision-Making**: Agent selects strategies without human input
3. **Adaptive Behavior**: Responses change based on customer profile and history
4. **Goal-Oriented Actions**: Agent pursues resolution while avoiding unnecessary escalation
5. **Continuous Learning**: Performance analysis improves future interactions
6. **Error Recovery**: Graceful fallbacks ensure reliability

#### Conditional Execution Enables Intelligence

The magic happens through ALOMA's conditional execution model:

* **Step 1** creates memory → **Step 2** can access and build upon it
* **Step 2** analyzes → **Step 3** makes decisions based on analysis
* **Step 3** strategizes → **Step 4** implements strategy consistently
* **Step 4** responds → **Step 5** learns from the complete interaction

Each step's condition ensures it only runs when appropriate data is available, creating a natural flow that emerges from data state rather than rigid sequencing.

#### Scaling Your Agent

This foundational pattern scales to handle:

* **Multiple conversation turns** (add steps for ongoing dialogue)
* **Team collaboration** (agent coordinates with other agents)
* **Knowledge integration** (connect to documentation and FAQs)
* **Performance optimization** (A/B testing of strategies)
* **Custom business logic** (industry-specific reasoning)

***

### Next Steps

#### Enhance Your Agent

1. **Add conversation continuity** for multi-turn customer interactions
2. **Integrate knowledge bases** for more accurate technical responses
3. **Implement A/B testing** for strategy optimization
4. **Add sentiment tracking** across conversation history
5. **Build agent specializations** for different support categories

#### Explore Advanced Patterns

* [**Agent Architecture Patterns**](https://claude.ai/chat/agent-architecture-patterns-technical-foundation.md) - Learn reactive, goal-oriented, and conversational agent designs
* [**Multi-Step AI Workflows**](https://claude.ai/chat/multi-step-ai-workflows.md) - Coordinate multiple agents working together
* [**Agent Memory & Context Management**](https://claude.ai/chat/agent-memory-context-management.md) - Advanced state management techniques

#### Real-World Implementation

This tutorial provides the foundation for production AI agents. Consider adding:

* **Rate limiting** for AI API calls
* **Cost monitoring** for OpenAI usage
* **Performance dashboards** for agent metrics
* **Human feedback loops** for continuous improvement
* **Security controls** for sensitive customer data

**Congratulations!** You've built a complete AI agent that demonstrates ALOMA's unique approach to intelligent automation. This agent showcases how conditional execution enables true AI reasoning, memory, and autonomous decision-making—capabilities impossible with traditional workflow tools.
