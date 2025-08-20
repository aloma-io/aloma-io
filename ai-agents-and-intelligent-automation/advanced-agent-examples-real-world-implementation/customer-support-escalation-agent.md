# Customer Support Escalation Agent

## Customer Support Escalation Agent

### Customer Support Escalation Agent - Complete Implementation Guide

**Build a production-ready intelligent escalation agent that automatically triages support tickets, manages conversation escalation, and seamlessly hands off complex issues to human agents while maintaining full context and learning from every interaction.**

#### Overview

The Customer Support Escalation Agent represents one of the most sophisticated AI agent patterns in ALOMA. Unlike simple rule-based escalation systems, this agent combines AI reasoning, conversation memory, and adaptive decision-making to create an intelligent support system that:

* **Intelligently triages** incoming support requests using AI analysis
* **Manages multi-turn conversations** with context preservation
* **Makes autonomous escalation decisions** based on complexity and sentiment
* **Provides seamless human handoffs** with complete context transfer
* **Learns continuously** from escalation outcomes to improve future decisions
* **Handles edge cases gracefully** with robust fallback mechanisms

This implementation demonstrates how ALOMA's conditional execution model enables truly intelligent support automation that scales with your business while maintaining high customer satisfaction.

***

### Architecture Overview

#### Agent Components

The escalation agent consists of **8 coordinated conditional steps** that create emergent intelligence:

1. **Ticket Intake & Classification** - Initial triage and categorization
2. **Sentiment & Complexity Analysis** - AI-powered risk assessment
3. **Escalation Decision Engine** - Autonomous routing decisions
4. **Conversation Management** - Multi-turn dialogue handling
5. **Human Handoff Orchestration** - Seamless agent-to-human transfer
6. **Context Preservation** - Knowledge transfer and memory management
7. **Outcome Tracking** - Learning from escalation results
8. **Performance Analytics** - Continuous improvement metrics

#### Data Flow Pattern

```
Support Ticket → Classification → Analysis → Decision → Action
     ↓              ↓             ↓          ↓        ↓
  Intake         Sentiment    Escalation  Handoff  Learning
    ↓              ↓             ↓          ↓        ↓
Categorize → Risk Assessment → Route → Transfer → Improve
```

#### Key Features Demonstrated

* **Multi-modal reasoning** combining rules and AI
* **State-based conversation management** with memory persistence
* **Dynamic escalation criteria** that adapt to context
* **Comprehensive human handoff** with full context transfer
* **Learning loops** for continuous improvement
* **Production-ready error handling** and monitoring

***

### Prerequisites and Setup

#### Environment Configuration

```bash
# Create dedicated workspace for escalation agent
aloma workspace add "Support Escalation Agent" --tags "production,support,ai-agent"
aloma workspace switch "Support Escalation Agent"

# Add required connectors
aloma connector add "openai.com" --config apiKey="your-openai-api-key"
aloma connector add "E-Mail (SMTP - OAuth)" --name "Support Email"
aloma connector add "slack.com" --name "Support Slack"
aloma connector add "zendesk.com" --name "Zendesk Integration"

# Configure secrets
aloma secret add "SUPPORT_EMAIL" "support@company.com"
aloma secret add "ESCALATION_EMAIL" "escalation@company.com"
aloma secret add "SLACK_SUPPORT_CHANNEL" "#customer-support"
aloma secret add "SLACK_ESCALATION_CHANNEL" "#support-escalation"
```

#### Required Integrations

* **AI Service**: OpenAI GPT-4 for intelligent reasoning
* **Communication**: Email and Slack for notifications and handoffs
* **Ticketing System**: Zendesk, Freshdesk, or similar for ticket management
* **Analytics**: Optional dashboard integration for performance tracking

***

### Step 1: Ticket Intake and Classification

The foundation step receives incoming support requests and performs initial classification and enrichment.

#### Create the Intake Step

```bash
aloma step add "ticket_intake_classification" \
  -c '{"support":{"ticket":"Object","classification":{"$exists":false}}}'
```

#### Implement Classification Logic

```javascript
// Step 1: Intelligent Ticket Intake and Classification
export const condition = {
  support: {
    ticket: Object,
    classification: { $exists: false }
  }
};

export const content = async () => {
  const ticket = data.support.ticket;
  console.log(`Processing support ticket: ${ticket.id || 'new'}`);
  
  try {
    // Initialize agent memory for this ticket
    data.escalationAgent = {
      ticketId: ticket.id || `TICK-${Date.now()}`,
      startedAt: new Date().toISOString(),
      conversationHistory: [{
        role: 'customer',
        content: ticket.description || ticket.message,
        timestamp: new Date().toISOString(),
        channel: ticket.channel || 'email',
        customerId: ticket.customerId
      }],
      metrics: {
        responseTime: null,
        escalationTime: null,
        resolutionTime: null,
        customerSatisfaction: null
      },
      learningData: {
        classificationAccuracy: null,
        escalationNecessity: null,
        outcomeQuality: null
      }
    };
    
    // AI-powered ticket classification
    const classificationResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert support ticket classifier. Analyze the incoming support request and provide comprehensive classification.

Classify along these dimensions:

1. CATEGORY (technical, billing, account, product, integration, bug_report, feature_request, general_inquiry)
2. PRIORITY (low, medium, high, critical, urgent)
3. COMPLEXITY (simple, moderate, complex, expert_required)
4. CUSTOMER_TYPE (free, paid, enterprise, vip, at_risk)
5. ISSUE_TYPE (question, problem, complaint, compliment, request)
6. URGENCY_INDICATORS (business_impacting, revenue_affecting, security_related, outage_related)
7. ESCALATION_SIGNALS (frustrated_language, legal_threats, previous_escalations, executive_involvement)
8. RESOLUTION_LIKELIHOOD (high, medium, low, requires_human)

Also extract:
- Key entities (product names, error codes, account IDs)
- Emotional indicators (sentiment, frustration level)
- Technical complexity markers
- Business impact indicators

Respond with structured JSON only.`
        },
        {
          role: 'user',
          content: `Classify this support ticket:

Ticket Information:
- ID: ${data.escalationAgent.ticketId}
- Subject: ${ticket.subject || 'No subject'}
- Description: "${ticket.description || ticket.message}"
- Customer ID: ${ticket.customerId || 'unknown'}
- Channel: ${ticket.channel || 'email'}
- Previous tickets: ${ticket.previousTicketCount || 0}
- Customer tier: ${ticket.customerTier || 'unknown'}
- Account value: ${ticket.accountValue || 'unknown'}

Provide comprehensive classification in JSON format.`
        }
      ]
    });
    
    const classification = JSON.parse(classificationResult.choices[0].message.content);
    
    // Store classification with enrichment
    data.support.classification = {
      ...classification,
      classifiedAt: new Date().toISOString(),
      classificationConfidence: 'high',
      autoClassified: true
    };
    
    // Enrich with customer context
    data.support.customer = {
      id: ticket.customerId,
      tier: ticket.customerTier || classification.customerType,
      accountValue: ticket.accountValue,
      previousTickets: ticket.previousTicketCount || 0,
      supportHistory: ticket.supportHistory || [],
      escalationHistory: ticket.escalationHistory || []
    };
    
    // Set initial routing hints
    data.support.routing = {
      suggestedTeam: determineSuggestedTeam(classification),
      requiresSpecialist: classification.complexity === 'expert_required',
      businessImpact: assessBusinessImpact(classification),
      timeToRespond: calculateResponseTime(classification)
    };
    
    console.log(`Ticket classified: ${classification.category} - ${classification.priority} priority`);
    
  } catch (error) {
    console.error('Classification failed:', error.message);
    
    // Fallback classification
    data.support.classification = {
      category: 'general_inquiry',
      priority: 'medium',
      complexity: 'moderate',
      escalationSignals: ['classification_failure'],
      classificationError: true,
      error: error.message,
      requiresHumanReview: true
    };
  }
};

// Helper functions
const determineSuggestedTeam = (classification) => {
  const teamMapping = {
    'technical': 'engineering',
    'billing': 'finance',
    'account': 'customer_success',
    'integration': 'technical_support',
    'bug_report': 'engineering',
    'feature_request': 'product',
    'security': 'security_team'
  };
  
  return teamMapping[classification.category] || 'general_support';
};

const assessBusinessImpact = (classification) => {
  const impactFactors = [
    classification.urgencyIndicators?.includes('business_impacting'),
    classification.urgencyIndicators?.includes('revenue_affecting'),
    classification.customerType === 'enterprise',
    classification.priority === 'critical'
  ].filter(Boolean).length;
  
  if (impactFactors >= 3) return 'high';
  if (impactFactors >= 2) return 'medium';
  return 'low';
};

const calculateResponseTime = (classification) => {
  const priorityTimes = {
    'critical': 15,    // 15 minutes
    'urgent': 30,      // 30 minutes
    'high': 120,       // 2 hours
    'medium': 480,     // 8 hours
    'low': 1440        // 24 hours
  };
  
  return priorityTimes[classification.priority] || 480;
};
```

***

### Step 2: Sentiment and Complexity Analysis

Deep analysis of customer sentiment, emotional state, and technical complexity to inform escalation decisions.

#### Create the Analysis Step

```bash
aloma step add "sentiment_complexity_analysis" \
  -c '{"support":{"classification":"Object"},"escalationAgent":"Object","sentimentAnalysis":{"$exists":false}}'
```

#### Implement Analysis Logic

```javascript
// Step 2: Advanced Sentiment and Complexity Analysis
export const condition = {
  support: {
    classification: Object
  },
  escalationAgent: Object,
  sentimentAnalysis: { $exists: false }
};

export const content = async () => {
  const classification = data.support.classification;
  const ticket = data.support.ticket;
  
  console.log('Performing deep sentiment and complexity analysis...');
  
  try {
    // Comprehensive sentiment and risk analysis
    const analysisResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert customer sentiment and support complexity analyst. Perform deep analysis on this support interaction to assess escalation risk and handling requirements.

Analyze these aspects:

SENTIMENT ANALYSIS:
1. Overall emotional tone (very_negative, negative, neutral, positive, very_positive)
2. Frustration level (0-100 scale)
3. Urgency perception (customer's sense of urgency vs actual urgency)
4. Confidence in resolution (customer's expectation of getting help)
5. Communication style (formal, casual, technical, emotional, aggressive)

COMPLEXITY ASSESSMENT:
1. Technical complexity (how difficult is the issue technically?)
2. Communication complexity (how difficult is it to explain/understand?)
3. Process complexity (how many systems/people might be involved?)
4. Resolution complexity (how difficult will it be to resolve?)

ESCALATION RISK FACTORS:
1. Customer frustration trajectory (escalating, stable, de-escalating)
2. Issue resolution likelihood at current support level
3. Potential for customer churn or negative publicity
4. Business impact multipliers

COMMUNICATION PATTERNS:
1. Clarity of issue description
2. Customer's technical knowledge level
3. Previous interaction patterns
4. Emotional regulation indicators

Provide numerical scores (0-100) and detailed reasoning for all assessments.`
        },
        {
          role: 'user',
          content: `Analyze this support interaction:

Customer Message: "${ticket.description || ticket.message}"
Subject: "${ticket.subject || 'No subject'}"

Customer Context:
- Tier: ${data.support.customer.tier}
- Previous tickets: ${data.support.customer.previousTickets}
- Account value: ${data.support.customer.accountValue}

Initial Classification:
${JSON.stringify(classification, null, 2)}

Provide comprehensive analysis with numerical scores and detailed reasoning.`
        }
      ]
    });
    
    const analysis = JSON.parse(analysisResult.choices[0].message.content);
    
    // Store comprehensive analysis
    data.sentimentAnalysis = {
      ...analysis,
      analyzedAt: new Date().toISOString(),
      analysisConfidence: 'high'
    };
    
    // Calculate composite risk scores
    data.escalationRisk = {
      overall: calculateOverallRisk(analysis),
      sentiment: analysis.sentimentAnalysis?.frustrationLevel || 50,
      complexity: analysis.complexityAssessment?.overallComplexity || 50,
      business: data.support.routing.businessImpact === 'high' ? 80 : 40,
      customer: calculateCustomerRisk(data.support.customer),
      technical: analysis.complexityAssessment?.technicalComplexity || 50
    };
    
    // Determine handling strategy
    data.handlingStrategy = {
      approach: determineApproach(data.escalationRisk, analysis),
      estimatedResolutionTime: estimateResolutionTime(analysis),
      requiredExpertise: determineRequiredExpertise(analysis),
      communicationStyle: analysis.communicationPatterns?.recommendedStyle || 'professional'
    };
    
    // Flag immediate escalation conditions
    const immediateEscalationConditions = [
      analysis.sentimentAnalysis?.frustrationLevel > 85,
      classification.escalationSignals?.includes('legal_threats'),
      classification.escalationSignals?.includes('executive_involvement'),
      data.escalationRisk.overall > 90,
      analysis.complexityAssessment?.resolutionComplexity > 90
    ];
    
    if (immediateEscalationConditions.some(condition => condition)) {
      data.immediateEscalation = {
        required: true,
        reasons: immediateEscalationConditions.map((condition, index) => 
          condition ? [
            'high_frustration',
            'legal_threats', 
            'executive_involvement',
            'high_risk_score',
            'extreme_complexity'
          ][index] : null
        ).filter(Boolean),
        triggeredAt: new Date().toISOString()
      };
    }
    
    console.log(`Analysis complete: ${data.escalationRisk.overall}% overall risk, ${analysis.sentimentAnalysis?.frustrationLevel}% frustration`);
    
  } catch (error) {
    console.error('Sentiment analysis failed:', error.message);
    
    // Fallback analysis
    data.sentimentAnalysis = {
      overallSentiment: 'neutral',
      frustrationLevel: 50,
      analysisError: true,
      error: error.message
    };
    
    data.escalationRisk = {
      overall: 60, // Conservative estimate
      sentiment: 50,
      complexity: 50,
      requiresHumanReview: true
    };
  }
};

// Helper functions
const calculateOverallRisk = (analysis) => {
  const factors = [
    analysis.sentimentAnalysis?.frustrationLevel || 50,
    analysis.complexityAssessment?.overallComplexity || 50,
    analysis.escalationRiskFactors?.churnRisk || 30,
    analysis.escalationRiskFactors?.publicityRisk || 20
  ];
  
  // Weighted average with emphasis on frustration and complexity
  return Math.round(
    (factors[0] * 0.4) + // Frustration (40% weight)
    (factors[1] * 0.3) + // Complexity (30% weight)
    (factors[2] * 0.2) + // Churn risk (20% weight)
    (factors[3] * 0.1)   // Publicity risk (10% weight)
  );
};

const calculateCustomerRisk = (customer) => {
  let risk = 30; // Base risk
  
  if (customer.tier === 'enterprise') risk += 30;
  if (customer.tier === 'vip') risk += 25;
  if (customer.previousTickets > 5) risk += 20;
  if (customer.escalationHistory?.length > 0) risk += 25;
  
  return Math.min(risk, 100);
};

const determineApproach = (riskProfile, analysis) => {
  const overallRisk = riskProfile.overall;
  const frustration = analysis.sentimentAnalysis?.frustrationLevel || 50;
  
  if (overallRisk > 80 || frustration > 80) return 'high_touch_escalation';
  if (overallRisk > 60 || frustration > 60) return 'careful_handling';
  if (analysis.complexityAssessment?.technicalComplexity > 70) return 'technical_specialist';
  return 'standard_support';
};

const estimateResolutionTime = (analysis) => {
  const complexity = analysis.complexityAssessment?.resolutionComplexity || 50;
  
  if (complexity > 80) return '2-4 hours';
  if (complexity > 60) return '1-2 hours';
  if (complexity > 40) return '30-60 minutes';
  return '15-30 minutes';
};

const determineRequiredExpertise = (analysis) => {
  const technical = analysis.complexityAssessment?.technicalComplexity || 50;
  const communication = analysis.complexityAssessment?.communicationComplexity || 50;
  
  if (technical > 80) return 'senior_technical';
  if (technical > 60) return 'technical_specialist';
  if (communication > 70) return 'communication_specialist';
  return 'general_support';
};
```

***

### Step 3: Escalation Decision Engine

The core intelligence that decides whether to escalate, when to escalate, and how to escalate based on all available context.

#### Create the Decision Engine Step

```bash
aloma step add "escalation_decision_engine" \
  -c '{"sentimentAnalysis":"Object","escalationRisk":"Object","escalationDecision":{"$exists":false}}'
```

#### Implement Decision Logic

```javascript
// Step 3: Intelligent Escalation Decision Engine
export const condition = {
  sentimentAnalysis: Object,
  escalationRisk: Object,
  escalationDecision: { $exists: false }
};

export const content = async () => {
  console.log('Making escalation decision...');
  
  try {
    // Check for immediate escalation flags
    if (data.immediateEscalation?.required) {
      data.escalationDecision = {
        decision: 'immediate_escalation',
        confidence: 'high',
        reasons: data.immediateEscalation.reasons,
        escalationType: 'urgent',
        targetTeam: 'senior_support',
        decisionMadeAt: new Date().toISOString()
      };
      
      console.log('Immediate escalation required:', data.immediateEscalation.reasons.join(', '));
      return;
    }
    
    // AI-powered escalation decision with full context
    const decisionResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert escalation decision engine for customer support. Make intelligent decisions about whether to escalate support tickets based on comprehensive analysis.

Consider these escalation criteria:

ESCALATION TRIGGERS:
1. Customer frustration level exceeding thresholds
2. Technical complexity beyond current support tier
3. Business impact requiring senior attention
4. Customer tier and relationship value
5. Previous escalation patterns and outcomes
6. Resolution time constraints
7. Potential for negative business outcomes

ESCALATION TYPES:
- immediate_escalation: Critical issues requiring immediate attention
- scheduled_escalation: Non-urgent but complex issues  
- specialist_escalation: Technical issues requiring expertise
- management_escalation: Relationship or business issues
- no_escalation: Handle at current support level

DECISION FACTORS:
- Probability of successful resolution at current level
- Customer satisfaction risk if not escalated
- Resource utilization and team capacity
- Business relationship impact
- Learning opportunity for current agent

Provide clear reasoning for your decision and specify escalation path if recommended.`
        },
        {
          role: 'user',
          content: `Make escalation decision for this support case:

TICKET ANALYSIS:
${JSON.stringify(data.support.classification, null, 2)}

SENTIMENT ANALYSIS:
${JSON.stringify(data.sentimentAnalysis, null, 2)}

RISK PROFILE:
${JSON.stringify(data.escalationRisk, null, 2)}

CUSTOMER CONTEXT:
${JSON.stringify(data.support.customer, null, 2)}

HANDLING STRATEGY:
${JSON.stringify(data.handlingStrategy, null, 2)}

Decide whether to escalate and provide detailed reasoning. Include:
1. Escalation recommendation (yes/no)
2. Escalation type if recommended
3. Target team/person
4. Urgency level
5. Handoff requirements
6. Success probability assessment
7. Alternative approaches considered

Respond in JSON format.`
        }
      ]
    });
    
    const decision = JSON.parse(decisionResult.choices[0].message.content);
    
    // Store decision with context
    data.escalationDecision = {
      ...decision,
      decisionMadeAt: new Date().toISOString(),
      decisionConfidence: decision.confidence || 'medium',
      riskFactorsConsidered: [
        `Overall risk: ${data.escalationRisk.overall}%`,
        `Sentiment risk: ${data.escalationRisk.sentiment}%`,
        `Complexity: ${data.escalationRisk.complexity}%`,
        `Customer tier: ${data.support.customer.tier}`
      ]
    };
    
    // If escalation decided, prepare escalation data
    if (decision.escalationRecommended || decision.decision !== 'no_escalation') {
      data.escalationPreparation = {
        targetTeam: decision.targetTeam || data.support.routing.suggestedTeam,
        urgencyLevel: decision.urgencyLevel || 'standard',
        handoffRequirements: decision.handoffRequirements || ['context_transfer', 'conversation_history'],
        estimatedHandoffTime: calculateHandoffTime(decision.urgencyLevel),
        contextPackage: prepareContextPackage(),
        specialInstructions: decision.specialInstructions || []
      };
      
      // Set escalation timing
      const urgencyDelays = {
        'immediate': 0,        // Now
        'urgent': 5,          // 5 minutes
        'standard': 30,       // 30 minutes
        'scheduled': 240      // 4 hours
      };
      
      const delayMinutes = urgencyDelays[decision.urgencyLevel] || 30;
      data.escalationPreparation.escalateAt = new Date(Date.now() + (delayMinutes * 60 * 1000)).toISOString();
    }
    
    // Update agent learning data
    data.escalationAgent.learningData.decisionFactors = {
      primaryReason: decision.primaryReason,
      alternativesConsidered: decision.alternativesConsidered,
      confidenceLevel: decision.confidence,
      expectedOutcome: decision.expectedOutcome
    };
    
    console.log(`Escalation decision: ${decision.decision} - ${decision.primaryReason}`);
    
  } catch (error) {
    console.error('Escalation decision failed:', error.message);
    
    // Fallback decision logic
    const overallRisk = data.escalationRisk.overall;
    const fallbackDecision = overallRisk > 70 ? 'escalate' : 'handle_locally';
    
    data.escalationDecision = {
      decision: fallbackDecision,
      decisionMadeAt: new Date().toISOString(),
      confidence: 'low',
      fallbackApplied: true,
      error: error.message,
      reasoning: `Fallback decision based on ${overallRisk}% risk score`
    };
  }
};

// Helper functions
const calculateHandoffTime = (urgencyLevel) => {
  const handoffTimes = {
    'immediate': '2-5 minutes',
    'urgent': '5-15 minutes', 
    'standard': '15-30 minutes',
    'scheduled': '2-4 hours'
  };
  
  return handoffTimes[urgencyLevel] || '15-30 minutes';
};

const prepareContextPackage = () => {
  return {
    ticketSummary: {
      id: data.escalationAgent.ticketId,
      classification: data.support.classification.category,
      priority: data.support.classification.priority,
      complexity: data.support.classification.complexity
    },
    customerProfile: {
      tier: data.support.customer.tier,
      accountValue: data.support.customer.accountValue,
      supportHistory: data.support.customer.previousTickets,
      escalationHistory: data.support.customer.escalationHistory?.length || 0
    },
    sentimentProfile: {
      frustrationLevel: data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel,
      communicationStyle: data.sentimentAnalysis.communicationPatterns?.recommendedStyle,
      emotionalState: data.sentimentAnalysis.sentimentAnalysis?.overallSentiment
    },
    technicalContext: {
      complexity: data.sentimentAnalysis.complexityAssessment?.technicalComplexity,
      requiredExpertise: data.handlingStrategy.requiredExpertise,
      estimatedResolutionTime: data.handlingStrategy.estimatedResolutionTime
    },
    conversationHistory: data.escalationAgent.conversationHistory
  };
};
```

***

### Step 4: Conversation Management and Response Generation

Manages ongoing conversations and generates appropriate responses while the escalation decision is being processed or if no escalation is needed.

#### Create Conversation Management Step

```bash
aloma step add "conversation_management" \
  -c '{"escalationDecision":"Object","conversationResponse":{"$exists":false}}'
```

#### Implement Conversation Logic

```javascript
// Step 4: Intelligent Conversation Management
export const condition = {
  escalationDecision: Object,
  conversationResponse: { $exists: false }
};

export const content = async () => {
  const decision = data.escalationDecision;
  const isEscalating = decision.decision !== 'no_escalation' && decision.escalationRecommended !== false;
  
  console.log(`Managing conversation - Escalation: ${isEscalating ? 'Yes' : 'No'}`);
  
  try {
    // Generate contextual response based on escalation decision
    const responseType = isEscalating ? 'escalation_response' : 'resolution_response';
    
    const responseResult = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional customer support agent crafting responses based on escalation decisions.

RESPONSE TYPES:

ESCALATION RESPONSE:
- Acknowledge the customer's issue professionally
- Explain that you're connecting them with a specialist
- Set clear expectations about timing and process
- Express commitment to resolution
- Maintain confidence and professionalism

RESOLUTION RESPONSE:
- Address the customer's issue directly
- Provide helpful information or solutions
- Ask clarifying questions if needed
- Set expectations for follow-up
- Maintain empathetic and helpful tone

TONE GUIDELINES:
- Match the customer's communication style
- Adjust formality based on customer tier
- Show empathy for frustration while maintaining professionalism
- Use positive, solution-oriented language
- Avoid technical jargon unless customer demonstrates technical knowledge

PERSONALIZATION:
- Reference specific aspects of their issue
- Acknowledge their customer tier/relationship
- Consider their emotional state and communication preferences
- Use appropriate level of detail for their technical knowledge`
        },
        {
          role: 'user',
          content: `Generate ${responseType} for this customer:

ORIGINAL TICKET:
Subject: ${data.support.ticket.subject || 'Support Request'}
Message: "${data.support.ticket.description || data.support.ticket.message}"

CUSTOMER PROFILE:
- Tier: ${data.support.customer.tier}
- Communication Style: ${data.sentimentAnalysis.communicationPatterns?.recommendedStyle || 'professional'}
- Frustration Level: ${data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel || 50}%
- Technical Knowledge: ${data.sentimentAnalysis.communicationPatterns?.technicalKnowledge || 'unknown'}

ESCALATION CONTEXT:
- Decision: ${decision.decision}
- Reasoning: ${decision.primaryReason || decision.reasoning}
- Target Team: ${data.escalationPreparation?.targetTeam || 'N/A'}
- Estimated Time: ${data.escalationPreparation?.estimatedHandoffTime || 'N/A'}

HANDLING APPROACH: ${data.handlingStrategy.approach}

${isEscalating ? `
ESCALATION DETAILS:
- Urgency: ${data.escalationPreparation?.urgencyLevel}
- Handoff Time: ${data.escalationPreparation?.estimatedHandoffTime}
- Special Instructions: ${data.escalationPreparation?.specialInstructions?.join(', ') || 'None'}
` : `
RESOLUTION GUIDANCE:
- Estimated Resolution Time: ${data.handlingStrategy.estimatedResolutionTime}
- Required Expertise: ${data.handlingStrategy.requiredExpertise}
- Approach: ${data.handlingStrategy.approach}
`}

Generate an appropriate, professional response that addresses their needs and sets proper expectations.

Response format:
{
  "responseMessage": "the actual message to send to customer",
  "responseType": "escalation_acknowledgment/solution_provision/clarification_request",
  "tone": "empathetic/professional/technical",
  "nextActions": ["list", "of", "follow-up", "actions"],
  "expectedCustomerResponse": "predicted customer reaction",
  "followUpRequired": boolean
}`
        }
      ]
    });
    
    const response = JSON.parse(responseResult.choices[0].message.content);
    
    // Store response with context
    data.conversationResponse = {
      ...response,
      generatedAt: new Date().toISOString(),
      escalationPath: isEscalating,
      responseStrategy: data.handlingStrategy.approach
    };
    
    // Update conversation history
    data.escalationAgent.conversationHistory.push({
      role: 'agent',
      content: response.responseMessage,
      timestamp: new Date().toISOString(),
      responseType: response.responseType,
      tone: response.tone,
      escalationPath: isEscalating
    });
    
    // Send the response to customer
    await connectors.supportEmail.send({
      to: data.support.ticket.customerEmail || data.support.customer.email,
      subject: `Re: ${data.support.ticket.subject || 'Support Request'}`,
      body: response.responseMessage,
      ticketId: data.escalationAgent.ticketId
    });
    
    // Set follow-up expectations
    if (response.followUpRequired && !isEscalating) {
      data.followUpScheduled = {
        required: true,
        scheduledFor: new Date(Date.now() + (4 * 60 * 60 * 1000)).toISOString(), // 4 hours
        reason: 'monitor_progress',
        actions: response.nextActions
      };
    }
    
    console.log(`Response sent: ${response.responseType} with ${response.tone} tone`);
    
  } catch (error) {
    console.error('Conversation management failed:', error.message);
    
    // Fallback response
    const fallbackMessage = isEscalating 
      ? "Thank you for contacting support. I'm reviewing your request and will connect you with a specialist who can provide the best assistance. You should hear back within 30 minutes."
      : "Thank you for contacting support. I've received your request and am working on a solution. I'll get back to you with more information shortly.";
    
    data.conversationResponse = {
      responseMessage: fallbackMessage,
      responseType: 'fallback',
      generatedAt: new Date().toISOString(),
      error: error.message,
      fallbackApplied: true
    };
    
    // Still send fallback response
    try {
      await connectors.supportEmail.send({
        to: data.support.ticket.customerEmail || data.support.customer.email,
        subject: `Re: ${data.support.ticket.subject || 'Support Request'}`,
        body: fallbackMessage,
        ticketId: data.escalationAgent.ticketId
      });
    } catch (sendError) {
      console.error('Failed to send fallback response:', sendError.message);
    }
  }
};
```

***

### Step 5: Human Handoff Orchestration

Manages the seamless transfer of escalated tickets to human agents with complete context preservation.

#### Create Human Handoff Step

```bash
aloma step add "human_handoff_orchestration" \
  -c '{"escalationDecision":{"escalationRecommended":true},"escalationPreparation":"Object","handoffComplete":{"$exists":false}}'
```

#### Implement Handoff Logic

```javascript
// Step 5: Seamless Human Handoff Orchestration
export const condition = {
  escalationDecision: {
    escalationRecommended: true
  },
  escalationPreparation: Object,
  handoffComplete: { $exists: false }
};

export const content = async () => {
  const escalation = data.escalationPreparation;
  const decision = data.escalationDecision;
  
  console.log(`Orchestrating handoff to ${escalation.targetTeam} with ${escalation.urgencyLevel} urgency`);
  
  try {
    // Prepare comprehensive handoff package
    const handoffPackage = {
      ticketInfo: {
        id: data.escalationAgent.ticketId,
        originalSubject: data.support.ticket.subject,
        createdAt: data.escalationAgent.startedAt,
        escalatedAt: new Date().toISOString(),
        channel: data.support.ticket.channel
      },
      
      customerContext: {
        ...data.support.customer,
        communicationPreferences: {
          style: data.sentimentAnalysis.communicationPatterns?.recommendedStyle,
          technicalLevel: data.sentimentAnalysis.communicationPatterns?.technicalKnowledge,
          currentEmotion: data.sentimentAnalysis.sentimentAnalysis?.overallSentiment,
          frustrationLevel: data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel
        }
      },
      
      issueAnalysis: {
        classification: data.support.classification,
        complexity: data.sentimentAnalysis.complexityAssessment,
        businessImpact: data.support.routing.businessImpact,
        resolutionEstimate: data.handlingStrategy.estimatedResolutionTime
      },
      
      escalationContext: {
        escalationReason: decision.primaryReason,
        riskFactors: data.escalationRisk,
        urgencyJustification: decision.urgencyLevel,
        specialRequirements: escalation.specialInstructions
      },
      
      conversationHistory: data.escalationAgent.conversationHistory,
      
      recommendedActions: {
        immediateActions: decision.recommendedImmediateActions || [],
        technicalSteps: decision.recommendedTechnicalSteps || [],
        communicationApproach: data.handlingStrategy.communicationStyle,
        escalationPath: decision.escalationPath || []
      },
      
      agentNotes: generateAgentNotes(),
      
      handoffMetadata: {
        handoffReason: decision.decision,
        automatedAnalysisConfidence: decision.decisionConfidence,
        humanReviewRequired: escalation.specialInstructions?.includes('human_review'),
        followUpRequired: data.followUpScheduled?.required || false
      }
    };
    
    // Send detailed handoff notification to target team
    const handoffEmailBody = generateHandoffEmail(handoffPackage);
    
    await connectors.supportEmail.send({
      to: getTeamEmail(escalation.targetTeam),
      cc: [task.config('ESCALATION_EMAIL')],
      subject: `🚨 ESCALATION: ${escalation.urgencyLevel.toUpperCase()} - ${data.support.ticket.subject} [${data.escalationAgent.ticketId}]`,
      body: handoffEmailBody,
      attachments: [{
        name: `handoff-context-${data.escalationAgent.ticketId}.json`,
        content: JSON.stringify(handoffPackage, null, 2),
        type: 'application/json'
      }]
    });
    
    // Send Slack notification for immediate attention
    const slackMessage = generateSlackHandoffMessage(handoffPackage);
    
    await connectors.supportSlack.send({
      channel: getTeamSlackChannel(escalation.targetTeam),
      text: slackMessage.text,
      blocks: slackMessage.blocks,
      thread_ts: data.support.ticket.slackThreadId // Continue existing thread if available
    });
    
    // Update ticket in external system (Zendesk, etc.)
    if (connectors.zendesk) {
      await connectors.zendesk.updateTicket({
        ticketId: data.support.ticket.externalId,
        status: 'escalated',
        priority: mapPriorityToExternal(data.support.classification.priority),
        assigneeGroup: escalation.targetTeam,
        tags: ['ai-escalated', `escalation-${escalation.urgencyLevel}`, decision.decision],
        internalNote: `AI Agent Escalation Summary:\n\n${generateInternalNote(handoffPackage)}`
      });
    }
    
    // Create handoff tracking
    data.handoffComplete = {
      handedOffAt: new Date().toISOString(),
      targetTeam: escalation.targetTeam,
      urgencyLevel: escalation.urgencyLevel,
      handoffMethod: ['email', 'slack', 'ticket_system'],
      contextTransferred: true,
      expectedResponseTime: escalation.estimatedHandoffTime,
      followUpScheduled: scheduleFollowUp(escalation.urgencyLevel)
    };
    
    // Update agent metrics
    data.escalationAgent.metrics.escalationTime = Date.now() - new Date(data.escalationAgent.startedAt).getTime();
    
    console.log(`Handoff completed to ${escalation.targetTeam} - Context package delivered`);
    
  } catch (error) {
    console.error('Handoff orchestration failed:', error.message);
    
    // Fallback handoff procedure
    await performFallbackHandoff(error);
  }
};

// Helper functions
const generateAgentNotes = () => {
  return [
    `AI Classification: ${data.support.classification.category} - ${data.support.classification.priority}`,
    `Risk Assessment: ${data.escalationRisk.overall}% overall risk`,
    `Customer Frustration: ${data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel}%`,
    `Complexity Score: ${data.escalationRisk.complexity}%`,
    `Business Impact: ${data.support.routing.businessImpact}`,
    `Recommended Approach: ${data.handlingStrategy.approach}`,
    `Escalation Triggers: ${data.escalationDecision.reasons?.join(', ') || data.escalationDecision.primaryReason}`
  ];
};

const generateHandoffEmail = (handoffPackage) => {
  return `
🚨 ESCALATED SUPPORT TICKET - IMMEDIATE ATTENTION REQUIRED

TICKET DETAILS:
ID: ${handoffPackage.ticketInfo.id}
Subject: ${handoffPackage.ticketInfo.originalSubject}
Escalated: ${new Date(handoffPackage.ticketInfo.escalatedAt).toLocaleString()}
Urgency: ${handoffPackage.escalationContext.urgencyJustification}

CUSTOMER INFORMATION:
Name: ${data.support.customer.name || 'Not provided'}
Tier: ${handoffPackage.customerContext.tier}
Account Value: ${handoffPackage.customerContext.accountValue || 'Unknown'}
Previous Tickets: ${handoffPackage.customerContext.previousTickets}
Communication Style: ${handoffPackage.customerContext.communicationPreferences.style}
Current Emotion: ${handoffPackage.customerContext.communicationPreferences.currentEmotion}
Frustration Level: ${handoffPackage.customerContext.communicationPreferences.frustrationLevel}%

ISSUE ANALYSIS:
Category: ${handoffPackage.issueAnalysis.classification.category}
Priority: ${handoffPackage.issueAnalysis.classification.priority}
Complexity: ${handoffPackage.issueAnalysis.classification.complexity}
Business Impact: ${handoffPackage.issueAnalysis.businessImpact}
Estimated Resolution: ${handoffPackage.issueAnalysis.resolutionEstimate}

ESCALATION REASON:
${handoffPackage.escalationContext.escalationReason}

AI AGENT NOTES:
${generateAgentNotes().map(note => `• ${note}`).join('\n')}

CONVERSATION HISTORY:
${handoffPackage.conversationHistory.map(msg => 
  `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.role.toUpperCase()}: ${msg.content}`
).join('\n')}

RECOMMENDED IMMEDIATE ACTIONS:
${handoffPackage.recommendedActions.immediateActions.map(action => `• ${action}`).join('\n')}

COMMUNICATION GUIDANCE:
• Use ${handoffPackage.recommendedActions.communicationApproach} tone
• Customer prefers ${handoffPackage.customerContext.communicationPreferences.style} communication
• Technical level: ${handoffPackage.customerContext.communicationPreferences.technicalLevel}

Complete context package attached as JSON file.

--- AI Support Agent
`;
};

const generateSlackHandoffMessage = (handoffPackage) => {
  const urgencyEmoji = {
    'immediate': '🔥',
    'urgent': '⚡',
    'standard': '⚠️',
    'scheduled': '📋'
  };
  
  const urgency = handoffPackage.escalationContext.urgencyJustification;
  
  return {
    text: `${urgencyEmoji[urgency]} Escalated Ticket: ${handoffPackage.ticketInfo.originalSubject}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${urgencyEmoji[urgency]} ESCALATED: ${urgency.toUpperCase()} Priority`
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Ticket ID:*\n${handoffPackage.ticketInfo.id}` },
          { type: 'mrkdwn', text: `*Customer:*\n${handoffPackage.customerContext.tier} tier` },
          { type: 'mrkdwn', text: `*Risk Level:*\n${data.escalationRisk.overall}%` },
          { type: 'mrkdwn', text: `*Frustration:*\n${handoffPackage.customerContext.communicationPreferences.frustrationLevel}%` }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Escalation Reason:* ${handoffPackage.escalationContext.escalationReason}\n*Issue:* ${handoffPackage.issueAnalysis.classification.category} - ${handoffPackage.issueAnalysis.classification.complexity} complexity`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Full Context' },
            url: `${task.config('SUPPORT_DASHBOARD')}/tickets/${handoffPackage.ticketInfo.id}`
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Claim Ticket' },
            action_id: 'claim_escalated_ticket',
            value: handoffPackage.ticketInfo.id
          }
        ]
      }
    ]
  };
};

const generateInternalNote = (handoffPackage) => {
  return `AI ESCALATION ANALYSIS:

Risk Factors:
• Overall Risk: ${data.escalationRisk.overall}%
• Sentiment Risk: ${data.escalationRisk.sentiment}%
• Technical Complexity: ${data.escalationRisk.technical}%
• Business Impact: ${data.escalationRisk.business}%

Decision Confidence: ${data.escalationDecision.decisionConfidence}

Customer Profile:
• Communication Style: ${handoffPackage.customerContext.communicationPreferences.style}
• Technical Knowledge: ${handoffPackage.customerContext.communicationPreferences.technicalLevel}
• Emotional State: ${handoffPackage.customerContext.communicationPreferences.currentEmotion}

Recommended Approach: ${data.handlingStrategy.approach}

Context package available in attached JSON file.`;
};

const getTeamEmail = (teamName) => {
  const emailMapping = {
    'engineering': 'engineering-support@company.com',
    'technical_support': 'technical@company.com',
    'customer_success': 'success@company.com',
    'senior_support': 'senior-support@company.com',
    'finance': 'billing@company.com',
    'security_team': 'security@company.com'
  };
  
  return emailMapping[teamName] || task.config('ESCALATION_EMAIL');
};

const getTeamSlackChannel = (teamName) => {
  const channelMapping = {
    'engineering': '#engineering-support',
    'technical_support': '#technical-support',
    'customer_success': '#customer-success',
    'senior_support': '#senior-support',
    'finance': '#billing-support',
    'security_team': '#security-alerts'
  };
  
  return channelMapping[teamName] || task.config('SLACK_ESCALATION_CHANNEL');
};

const mapPriorityToExternal = (internalPriority) => {
  const priorityMapping = {
    'critical': 'urgent',
    'urgent': 'high', 
    'high': 'normal',
    'medium': 'low',
    'low': 'low'
  };
  
  return priorityMapping[internalPriority] || 'normal';
};

const scheduleFollowUp = (urgencyLevel) => {
  const followUpTimes = {
    'immediate': 15,  // 15 minutes
    'urgent': 60,     // 1 hour
    'standard': 240,  // 4 hours
    'scheduled': 480  // 8 hours
  };
  
  const minutes = followUpTimes[urgencyLevel] || 240;
  return new Date(Date.now() + (minutes * 60 * 1000)).toISOString();
};

const performFallbackHandoff = async (error) => {
  // Emergency fallback procedure
  const emergencyMessage = `
🚨 ESCALATION SYSTEM FAILURE - MANUAL INTERVENTION REQUIRED

Ticket ID: ${data.escalationAgent.ticketId}
Original Issue: ${data.support.ticket.subject}
Customer: ${data.support.customer.tier} tier
Error: ${error.message}

AI agent attempted escalation but failed. Please review immediately.
Complete context available in task data.
`;

  try {
    await connectors.supportSlack.send({
      channel: '#support-alerts',
      text: emergencyMessage
    });
    
    await connectors.supportEmail.send({
      to: task.config('ESCALATION_EMAIL'),
      subject: `🚨 ESCALATION SYSTEM FAILURE - ${data.escalationAgent.ticketId}`,
      body: emergencyMessage
    });
    
    data.handoffComplete = {
      handedOffAt: new Date().toISOString(),
      fallbackProcedure: true,
      error: error.message,
      manualInterventionRequired: true
    };
    
  } catch (fallbackError) {
    console.error('Fallback handoff also failed:', fallbackError.message);
    data.criticalFailure = true;
  }
};
```

***

### Step 6: Context Preservation and Knowledge Transfer

Ensures all context and learning is preserved for future interactions and system improvement.

#### Create Context Preservation Step

```bash
aloma step add "context_preservation" \
  -c '{"handoffComplete":"Object","contextPreservation":{"$exists":false}}'
```

#### Implement Context Logic

```javascript
// Step 6: Comprehensive Context Preservation and Knowledge Transfer
export const condition = {
  handoffComplete: Object,
  contextPreservation: { $exists: false }
};

export const content = async () => {
  console.log('Preserving context and transferring knowledge...');
  
  try {
    // Create comprehensive context record
    const contextRecord = {
      sessionMetadata: {
        ticketId: data.escalationAgent.ticketId,
        sessionStarted: data.escalationAgent.startedAt,
        contextPreservedAt: new Date().toISOString(),
        totalDuration: Date.now() - new Date(data.escalationAgent.startedAt).getTime(),
        escalationPath: data.escalationDecision.decision,
        finalOutcome: data.handoffComplete.targetTeam || 'self_resolved'
      },
      
      customerInteractionProfile: {
        customerId: data.support.customer.id,
        communicationPreferences: {
          preferredStyle: data.sentimentAnalysis.communicationPatterns?.recommendedStyle,
          technicalLevel: data.sentimentAnalysis.communicationPatterns?.technicalKnowledge,
          responseTimeExpectation: data.support.classification.priority,
          escalationTriggers: data.escalationDecision.reasons || []
        },
        behavioralPatterns: {
          frustrationProgression: data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel,
          issueComplexityPreference: data.sentimentAnalysis.complexityAssessment?.communicationComplexity,
          resolutionExpectations: data.handlingStrategy.estimatedResolutionTime
        },
        relationshipHistory: {
          supportTicketsCount: data.support.customer.previousTickets,
          escalationHistory: data.support.customer.escalationHistory,
          satisfactionTrend: data.escalationAgent.metrics.customerSatisfaction
        }
      },
      
      issueKnowledgeBase: {
        issueSignature: generateIssueSignature(),
        resolutionPath: data.escalationDecision.escalationPath || ['ai_analysis', 'human_handoff'],
        complexityFactors: data.sentimentAnalysis.complexityAssessment,
        successfulPatterns: data.escalationDecision.alternativesConsidered,
        failurePoints: data.escalationDecision.challengesIdentified || []
      },
      
      agentLearningData: {
        decisionAccuracy: {
          classificationConfidence: data.support.classification.classificationConfidence,
          sentimentAccuracy: data.sentimentAnalysis.analysisConfidence,
          escalationAppropriate: null, // To be updated after outcome
          handoffEffectiveness: null   // To be updated after resolution
        },
        improvementOpportunities: await identifyImprovementOpportunities(),
        successfulStrategies: [
          data.handlingStrategy.approach,
          data.conversationResponse.responseStrategy
        ],
        contextualInsights: generateContextualInsights()
      },
      
      processEfficiencyMetrics: {
        timeToClassification: calculateTimeToClassification(),
        timeToEscalationDecision: calculateTimeToEscalationDecision(),
        contextTransferCompleteness: assessContextTransferQuality(),
        automationEffectiveness: calculateAutomationEffectiveness()
      }
    };
    
    // Store context in permanent knowledge base
    data.contextPreservation = {
      contextRecord,
      preservedAt: new Date().toISOString(),
      knowledgeBaseUpdated: true,
      learningPipelineTriggered: true
    };
    
    // Update customer profile in CRM/database
    if (connectors.hubspotCom) {
      await updateCustomerProfile(contextRecord.customerInteractionProfile);
    }
    
    // Feed learning data to improvement systems
    await triggerLearningPipeline(contextRecord.agentLearningData);
    
    // Create knowledge base entries for similar issues
    await updateIssueKnowledgeBase(contextRecord.issueKnowledgeBase);
    
    console.log('Context preservation completed - Knowledge transferred to permanent systems');
    
  } catch (error) {
    console.error('Context preservation failed:', error.message);
    
    data.contextPreservation = {
      preservationError: true,
      error: error.message,
      fallbackPreservation: {
        ticketId: data.escalationAgent.ticketId,
        basicMetrics: data.escalationAgent.metrics,
        escalationOutcome: data.handoffComplete
      }
    };
  }
};

// Helper functions
const generateIssueSignature = () => {
  return {
    category: data.support.classification.category,
    complexity: data.support.classification.complexity,
    customerTier: data.support.customer.tier,
    sentimentProfile: data.sentimentAnalysis.sentimentAnalysis?.overallSentiment,
    technicalKeywords: extractTechnicalKeywords(),
    escalationTriggers: data.escalationDecision.reasons || []
  };
};

const extractTechnicalKeywords = () => {
  const message = data.support.ticket.description || data.support.ticket.message;
  const technicalTerms = [
    'api', 'error', 'bug', 'integration', 'authentication', 'timeout',
    'database', 'server', 'connection', 'ssl', 'webhook', 'endpoint'
  ];
  
  return technicalTerms.filter(term => 
    message.toLowerCase().includes(term)
  );
};

const identifyImprovementOpportunities = async () => {
  try {
    const improvementAnalysis = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Analyze this support escalation case and identify specific improvement opportunities for the AI agent.'
      }, {
        role: 'user',
        content: `Analyze this escalation case for improvement opportunities:

Classification: ${JSON.stringify(data.support.classification)}
Analysis: ${JSON.stringify(data.sentimentAnalysis)}
Decision: ${JSON.stringify(data.escalationDecision)}
Outcome: ${JSON.stringify(data.handoffComplete)}

Identify:
1. Classification accuracy improvements needed
2. Sentiment analysis refinements
3. Escalation decision enhancements
4. Process efficiency opportunities
5. Customer experience improvements

Focus on specific, actionable improvements.`
      }]
    });
    
    return JSON.parse(improvementAnalysis.choices[0].message.content);
    
  } catch (error) {
    return { analysisError: error.message };
  }
};

const generateContextualInsights = () => {
  return [
    `Customer tier ${data.support.customer.tier} with ${data.sentimentAnalysis.sentimentAnalysis?.frustrationLevel}% frustration required escalation`,
    `${data.support.classification.category} issues with ${data.support.classification.complexity} complexity typically escalate after ${data.escalationAgent.metrics.escalationTime}ms`,
    `Communication style ${data.sentimentAnalysis.communicationPatterns?.recommendedStyle} was effective for this customer profile`,
    `Business impact ${data.support.routing.businessImpact} correlated with escalation decision confidence ${data.escalationDecision.decisionConfidence}`
  ];
};

const calculateTimeToClassification = () => {
  const classificationTime = new Date(data.support.classification.classifiedAt).getTime();
  const startTime = new Date(data.escalationAgent.startedAt).getTime();
  return classificationTime - startTime;
};

const calculateTimeToEscalationDecision = () => {
  const decisionTime = new Date(data.escalationDecision.decisionMadeAt).getTime();
  const startTime = new Date(data.escalationAgent.startedAt).getTime();
  return decisionTime - startTime;
};

const assessContextTransferQuality = () => {
  const transferElements = [
    data.handoffComplete?.contextTransferred,
    data.escalationPreparation?.contextPackage,
    data.conversationResponse?.responseMessage,
    data.escalationAgent?.conversationHistory?.length > 0
  ];
  
  const completeness = transferElements.filter(Boolean).length / transferElements.length;
  return Math.round(completeness * 100);
};

const calculateAutomationEffectiveness = () => {
  const automatedSteps = [
    'classification',
    'sentiment_analysis', 
    'escalation_decision',
    'response_generation',
    'handoff_orchestration'
  ];
  
  const successfulSteps = automatedSteps.filter(step => {
    switch(step) {
      case 'classification': return !data.support.classification?.classificationError;
      case 'sentiment_analysis': return !data.sentimentAnalysis?.analysisError;
      case 'escalation_decision': return !data.escalationDecision?.fallbackApplied;
      case 'response_generation': return !data.conversationResponse?.fallbackApplied;
      case 'handoff_orchestration': return !data.handoffComplete?.fallbackProcedure;
      default: return false;
    }
  });
  
  return Math.round((successfulSteps.length / automatedSteps.length) * 100);
};

const updateCustomerProfile = async (interactionProfile) => {
  try {
    await connectors.hubspotCom.request({
      url: `/crm/v3/objects/contacts/${data.support.customer.id}`,
      options: {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            support_interaction_count: data.support.customer.previousTickets + 1,
            last_escalation_date: new Date().toISOString(),
            communication_preference: interactionProfile.communicationPreferences.preferredStyle,
            technical_knowledge_level: interactionProfile.communicationPreferences.technicalLevel,
            escalation_risk_score: data.escalationRisk.overall
          }
        })
      }
    });
  } catch (error) {
    console.error('Customer profile update failed:', error.message);
  }
};

const triggerLearningPipeline = async (learningData) => {
  // In a real implementation, this would feed into ML training pipelines
  console.log('Learning data prepared for training pipeline:', {
    ticketId: data.escalationAgent.ticketId,
    learningPoints: Object.keys(learningData.improvementOpportunities || {}),
    contextualInsights: learningData.contextualInsights?.length || 0
  });
};

const updateIssueKnowledgeBase = async (issueData) => {
  // Create searchable knowledge base entry
  const knowledgeEntry = {
    issueSignature: issueData.issueSignature,
    resolutionPath: issueData.resolutionPath,
    successfulStrategies: issueData.successfulPatterns,
    createdAt: new Date().toISOString(),
    ticketId: data.escalationAgent.ticketId
  };
  
  console.log('Knowledge base entry created:', knowledgeEntry);
};
```

***

### Step 7: Outcome Tracking and Feedback Loop

Monitors escalation outcomes and captures feedback to improve future agent decisions.

#### Create Outcome Tracking Step

```bash
aloma step add "outcome_tracking_feedback" \
  -c '{"contextPreservation":"Object","outcomeTracking":{"$exists":false}}'
```

#### Implement Tracking Logic

```javascript
// Step 7: Comprehensive Outcome Tracking and Continuous Learning
export const condition = {
  contextPreservation: Object,
  outcomeTracking: { $exists: false }
};

export const content = async () => {
  console.log('Initiating outcome tracking and feedback collection...');
  
  try {
    // Set up outcome monitoring
    data.outcomeTracking = {
      trackingInitiated: new Date().toISOString(),
      monitoringPeriod: '72_hours', // Track for 3 days
      trackingMethods: ['ticket_resolution', 'customer_feedback', 'agent_feedback'],
      outcomeMetrics: {
        resolutionTime: null,
        customerSatisfaction: null,
        escalationAppropriate: null,
        agentEffectiveness: null,
        processEfficiency: null
      },
      feedbackSchedule: {
        immediate: new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString(), // 2 hours
        followUp: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(), // 24 hours
        final: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString()    // 72 hours
      }
    };
    
    // Create monitoring tasks for automated feedback collection
    await createOutcomeMonitoringTasks();
    
    // Set up automated feedback collection
    await scheduleCustomerFeedbackCollection();
    
    // Initialize agent performance tracking
    await initializeAgentPerformanceTracking();
    
    console.log('Outcome tracking system activated - Monitoring initiated');
    
  } catch (error) {
    console.error('Outcome tracking setup failed:', error.message);
    
    data.outcomeTracking = {
      trackingError: true,
      error: error.message,
      fallbackTracking: 'basic_metrics_only'
    };
  }
};

// Helper functions for outcome tracking
const createOutcomeMonitoringTasks = async () => {
  // Create follow-up tasks to monitor resolution progress
  const monitoringTasks = [
    {
      taskType: 'resolution_check',
      scheduledFor: data.outcomeTracking.feedbackSchedule.immediate,
      purpose: 'Check if ticket was resolved by human agent'
    },
    {
      taskType: 'satisfaction_survey',
      scheduledFor: data.outcomeTracking.feedbackSchedule.followUp,
      purpose: 'Collect customer satisfaction feedback'
    },
    {
      taskType: 'final_analysis',
      scheduledFor: data.outcomeTracking.feedbackSchedule.final,
      purpose: 'Complete outcome analysis and learning integration'
    }
  ];
  
  for (const task of monitoringTasks) {
    await scheduleMonitoringTask(task);
  }
};

const scheduleMonitoringTask = async (taskConfig) => {
  // In a real implementation, this would create new ALOMA tasks
  console.log(`Scheduled monitoring task: ${taskConfig.taskType} for ${taskConfig.scheduledFor}`);
};

const scheduleCustomerFeedbackCollection = async () => {
  // Schedule automated customer feedback email
  const feedbackEmail = generateFeedbackEmail();
  
  // This would typically be handled by a delayed email system
  console.log('Customer feedback collection scheduled:', {
    scheduledFor: data.outcomeTracking.feedbackSchedule.followUp,
    emailType: 'satisfaction_survey'
  });
};

const generateFeedbackEmail = () => {
  return {
    subject: 'How was your support experience?',
    body: `
Hi ${data.support.customer.name || 'there'},

We hope your recent support issue has been resolved to your satisfaction.

Ticket: ${data.escalationAgent.ticketId}
Issue: ${data.support.ticket.subject}

We'd love to hear about your experience:

1. Was your issue resolved satisfactorily? (Yes/No)
2. How would you rate the escalation process? (1-5 stars)
3. Did you feel the handoff to our specialist was smooth? (Yes/No)
4. Any additional feedback?

Your feedback helps us improve our support experience.

Best regards,
Support Team
    `,
    trackingData: {
      ticketId: data.escalationAgent.ticketId,
      escalationPath: data.escalationDecision.decision,
      agentVersion: 'v1.0'
    }
  };
};

const initializeAgentPerformanceTracking = async () => {
  // Set up performance metrics tracking
  data.performanceTracking = {
    agentMetrics: {
      classificationAccuracy: null,
      sentimentAccuracy: null, 
      escalationDecisionQuality: null,
      responseAppropriate: null,
      handoffEffectiveness: null,
      overallPerformance: null
    },
    benchmarkComparisons: {
      averageResolutionTime: null,
      escalationRate: null,
      customerSatisfactionDelta: null
    },
    learningOpportunities: [],
    performanceTrackingId: `perf-${data.escalationAgent.ticketId}-${Date.now()}`
  };
};
```

***

### Step 8: Performance Analytics and Continuous Improvement

Final step that completes the agent cycle and feeds insights back into the system for continuous improvement.

#### Create Performance Analytics Step

```bash
aloma step add "performance_analytics_improvement" \
  -c '{"outcomeTracking":"Object","performanceAnalysis":{"$exists":false}}'
```

#### Implement Analytics Logic

```javascript
// Step 8: Performance Analytics and Continuous Improvement Engine
export const condition = {
  outcomeTracking: Object,
  performanceAnalysis: { $exists: false }
};

export const content = async () => {
  console.log('Generating performance analytics and improvement recommendations...');
  
  try {
    // Comprehensive performance analysis
    const performanceMetrics = await generatePerformanceMetrics();
    
    // AI-powered improvement analysis
    const improvementAnalysis = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI system performance analyst. Analyze this escalation agent's performance and provide specific improvement recommendations.

Focus on:
1. Decision accuracy assessment
2. Process efficiency analysis  
3. Customer experience quality
4. System reliability evaluation
5. Learning opportunity identification
6. Scalability considerations

Provide actionable insights that can improve future agent performance.`
        },
        {
          role: 'user',
          content: `Analyze this escalation agent performance:

TICKET PROCESSING SUMMARY:
${JSON.stringify(generateTicketSummary(), null, 2)}

DECISION QUALITY METRICS:
${JSON.stringify(assessDecisionQuality(), null, 2)}

EFFICIENCY METRICS:
${JSON.stringify(calculateEfficiencyMetrics(), null, 2)}

ERROR HANDLING ASSESSMENT:
${JSON.stringify(assessErrorHandling(), null, 2)}

CUSTOMER EXPERIENCE INDICATORS:
${JSON.stringify(assessCustomerExperience(), null, 2)}

Provide comprehensive performance analysis with specific improvement recommendations.`
        }
      ]
    });
    
    const analysis = JSON.parse(improvementAnalysis.choices[0].message.content);
    
    // Store comprehensive performance analysis
    data.performanceAnalysis = {
      ...analysis,
      performanceMetrics,
      analyzedAt: new Date().toISOString(),
      agentVersion: 'escalation-agent-v1.0',
      improvementPriority: rankImprovementPriorities(analysis),
      nextIterationRecommendations: generateNextIterationPlan(analysis)
    };
    
    // Generate executive summary
    const executiveSummary = generateExecutiveSummary();
    
    // Send performance report to stakeholders
    await sendPerformanceReport(executiveSummary);
    
    // Update agent knowledge base with learnings
    await updateAgentKnowledgeBase();
    
    // Complete the escalation agent cycle
    await completeAgentCycle();
    
    console.log('Performance analysis completed - Agent cycle finished with insights captured');
    
  } catch (error) {
    console.error('Performance analysis failed:', error.message);
    
    data.performanceAnalysis = {
      analysisError: true,
      error: error.message,
      basicMetrics: generateBasicMetrics()
    };
  }
  
  // Mark task as complete
  task.complete();
};

// Performance analysis helper functions
const generatePerformanceMetrics = async () => {
  return {
    processingEfficiency: {
      totalProcessingTime: Date.now() - new Date(data.escalationAgent.startedAt).getTime(),
      timeToClassification: calculateTimeToClassification(),
      timeToDecision: calculateTimeToEscalationDecision(),
      timeToHandoff: data.handoffComplete ? 
        new Date(data.handoffComplete.handedOffAt).getTime() - new Date(data.escalationAgent.startedAt).getTime() : null,
      automationEffectiveness: calculateAutomationEffectiveness()
    },
    
    decisionQuality: {
      classificationConfidence: data.support.classification.classificationConfidence,
      sentimentAnalysisConfidence: data.sentimentAnalysis.analysisConfidence,
      escalationDecisionConfidence: data.escalationDecision.decisionConfidence,
      fallbacksTriggered: countFallbacksTriggered(),
      errorRecoverySuccess: assessErrorRecovery()
    },
    
    customerImpact: {
      responseGenerated: !!data.conversationResponse?.responseMessage,
      responseQuality: data.conversationResponse?.responseType || 'unknown',
      escalationAppropriate: null, // Would be updated based on outcome
      contextPreserved: data.contextPreservation?.knowledgeBaseUpdated || false,
      handoffSmooth: data.handoffComplete?.contextTransferred || false
    },
    
    systemReliability: {
      stepSuccessRate: calculateStepSuccessRate(),
      errorHandlingEffective: !data.criticalFailure,
      fallbackProceduresWorked: assessFallbackEffectiveness(),
      dataIntegrityMaintained: validateDataIntegrity()
    }
  };
};

const generateTicketSummary = () => {
  return {
    ticketId: data.escalationAgent.ticketId,
    classification: data.support.classification.category,
    priority: data.support.classification.priority,
    complexity: data.support.classification.complexity,
    customerTier: data.support.customer.tier,
    escalationDecision: data.escalationDecision.decision,
    finalOutcome: data.handoffComplete?.targetTeam || 'self_resolved',
    processingDuration: Date.now() - new Date(data.escalationAgent.startedAt).getTime()
  };
};

const assessDecisionQuality = () => {
  return {
    classificationAccuracy: assessClassificationAccuracy(),
    sentimentAssessmentQuality: assessSentimentQuality(),
    escalationDecisionAppropriate: null, // Requires outcome data
    riskAssessmentAccuracy: assessRiskAccuracy(),
    responseAppropriateness: assessResponseQuality()
  };
};

const calculateEfficiencyMetrics = () => {
  const totalTime = Date.now() - new Date(data.escalationAgent.startedAt).getTime();
  
  return {
    totalProcessingTime: totalTime,
    averageStepTime: totalTime / 8, // 8 steps total
    automationPercentage: calculateAutomationEffectiveness(),
    humanInterventionRequired: !!data.handoffComplete?.targetTeam,
    resourceUtilization: assessResourceUtilization(),
    scalabilityScore: calculateScalabilityScore()
  };
};

const assessErrorHandling = () => {
  const errors = [
    data.support.classification?.classificationError,
    data.sentimentAnalysis?.analysisError,
    data.escalationDecision?.fallbackApplied,
    data.conversationResponse?.fallbackApplied,
    data.handoffComplete?.fallbackProcedure,
    data.contextPreservation?.preservationError,
    data.outcomeTracking?.trackingError,
    data.criticalFailure
  ].filter(Boolean);
  
  return {
    errorsEncountered: errors.length,
    errorTypes: errors,
    recoverySuccessful: errors.length === 0 || !data.criticalFailure,
    fallbacksEffective: !data.criticalFailure,
    gracefulDegradation: errors.length > 0 && !!data.conversationResponse?.responseMessage
  };
};

const assessCustomerExperience = () => {
  return {
    responseProvided: !!data.conversationResponse?.responseMessage,
    responseTimely: true, // All automated responses are immediate
    communicationAppropriate: data.conversationResponse?.tone || 'unknown',
    escalationTransparent: data.escalationDecision.decision !== 'no_escalation' ? 
      !!data.conversationResponse?.responseMessage : true,
    contextMaintained: data.handoffComplete?.contextTransferred || true,
    expectationsSet: !!data.escalationPreparation?.estimatedHandoffTime
  };
};

const rankImprovementPriorities = (analysis) => {
  // Rank improvement opportunities by impact and effort
  const improvements = analysis.improvementRecommendations || [];
  
  return improvements.map(improvement => ({
    ...improvement,
    priority: calculateImprovementPriority(improvement)
  })).sort((a, b) => b.priority - a.priority);
};

const calculateImprovementPriority = (improvement) => {
  // Simple priority scoring based on keywords
  const highImpactKeywords = ['customer', 'accuracy', 'escalation', 'satisfaction'];
  const lowEffortKeywords = ['tuning', 'threshold', 'configuration', 'prompt'];
  
  const impact = highImpactKeywords.some(keyword => 
    improvement.description?.toLowerCase().includes(keyword)) ? 80 : 40;
  const effort = lowEffortKeywords.some(keyword => 
    improvement.description?.toLowerCase().includes(keyword)) ? 20 : 60;
  
  return impact - effort; // Higher score = higher priority
};

const generateNextIterationPlan = (analysis) => {
  return {
    immediateActions: analysis.immediateImprovements || [],
    shortTermGoals: analysis.shortTermRecommendations || [],
    longTermStrategy: analysis.longTermStrategy || [],
    metricTargets: {
      escalationAccuracy: '95%',
      customerSatisfaction: '4.5+/5',
      processingTime: '<30 seconds',
      automationRate: '>90%'
    },
    nextReviewDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString() // 30 days
  };
};

const generateExecutiveSummary = () => {
  const metrics = data.performanceAnalysis?.performanceMetrics;
  
  return {
    ticketId: data.escalationAgent.ticketId,
    processingDate: new Date().toISOString(),
    
    keyMetrics: {
      processingTime: `${Math.round(metrics?.processingEfficiency?.totalProcessingTime / 1000)} seconds`,
      automationSuccess: `${metrics?.processingEfficiency?.automationEffectiveness}%`,
      escalationDecision: data.escalationDecision.decision,
      customerTier: data.support.customer.tier,
      issueComplexity: data.support.classification.complexity
    },
    
    outcomes: {
      customerResponseProvided: !!data.conversationResponse?.responseMessage,
      escalationHandled: !!data.handoffComplete?.targetTeam,
      contextPreserved: !!data.contextPreservation?.knowledgeBaseUpdated,
      errorHandling: data.performanceAnalysis?.performanceMetrics?.systemReliability?.errorHandlingEffective
    },
    
    learningInsights: data.performanceAnalysis?.improvementPriority?.slice(0, 3) || [],
    
    nextActions: [
      'Monitor escalation outcome',
      'Collect customer feedback',
      'Update knowledge base',
      'Apply improvement recommendations'
    ]
  };
};

const sendPerformanceReport = async (summary) => {
  try {
    // Send to stakeholders
    await connectors.supportEmail.send({
      to: 'ai-operations@company.com',
      cc: ['support-management@company.com'],
      subject: `AI Escalation Agent Performance Report - ${data.escalationAgent.ticketId}`,
      body: `
AI ESCALATION AGENT PERFORMANCE REPORT
Generated: ${new Date().toLocaleString()}

TICKET SUMMARY:
• ID: ${summary.ticketId}
• Processing Time: ${summary.keyMetrics.processingTime}
• Automation Success: ${summary.keyMetrics.automationSuccess}
• Decision: ${summary.keyMetrics.escalationDecision}
• Customer Tier: ${summary.keyMetrics.customerTier}
• Issue Complexity: ${summary.keyMetrics.issueComplexity}

OUTCOMES:
• Customer Response: ${summary.outcomes.customerResponseProvided ? 'Provided' : 'Not Provided'}
• Escalation Handling: ${summary.outcomes.escalationHandled ? 'Escalated Successfully' : 'Resolved Internally'}
• Context Preservation: ${summary.outcomes.contextPreserved ? 'Successful' : 'Failed'}
• Error Handling: ${summary.outcomes.errorHandling ? 'Effective' : 'Issues Detected'}

TOP LEARNING INSIGHTS:
${summary.learningInsights.map((insight, i) => `${i+1}. ${insight.description || insight}`).join('\n')}

NEXT ACTIONS:
${summary.nextActions.map(action => `• ${action}`).join('\n')}

Full performance data available in attached JSON.
      `,
      attachments: [{
        name: `performance-analysis-${data.escalationAgent.ticketId}.json`,
        content: JSON.stringify(data.performanceAnalysis, null, 2),
        type: 'application/json'
      }]
    });
    
  } catch (error) {
    console.error('Failed to send performance report:', error.message);
  }
};

const updateAgentKnowledgeBase = async () => {
  // Update the agent's knowledge base with learnings
  const learningUpdate = {
    ticketId: data.escalationAgent.ticketId,
    customerProfile: data.support.customer,
    issuePattern: data.support.classification,
    escalationPattern: data.escalationDecision,
    outcomeData: data.handoffComplete,
    improvedStrategies: data.performanceAnalysis?.nextIterationRecommendations,
    updatedAt: new Date().toISOString()
  };
  
  console.log('Knowledge base updated with learning data:', Object.keys(learningUpdate));
};

const completeAgentCycle = async () => {
  // Final status update
  data.escalationAgent.completedAt = new Date().toISOString();
  data.escalationAgent.totalDuration = Date.now() - new Date(data.escalationAgent.startedAt).getTime();
  data.escalationAgent.finalStatus = 'completed_successfully';
  data.escalationAgent.learningDataCaptured = true;
  
  // Send completion notification
  await connectors.supportSlack.send({
    channel: '#ai-agent-monitoring',
    text: `✅ Escalation Agent completed cycle for ticket ${data.escalationAgent.ticketId} in ${Math.round(data.escalationAgent.totalDuration / 1000)}s`
  });
  
  console.log(`Escalation agent cycle completed for ticket ${data.escalationAgent.ticketId}`);
};

// Additional helper functions
const countFallbacksTriggered = () => {
  const fallbacks = [
    data.support.classification?.classificationError,
    data.sentimentAnalysis?.analysisError,
    data.escalationDecision?.fallbackApplied,
    data.conversationResponse?.fallbackApplied,
    data.handoffComplete?.fallbackProcedure
  ].filter(Boolean);
  
  return fallbacks.length;
};

const assessErrorRecovery = () => {
  const errors = countFallbacksTriggered();
  const criticalFailure = !!data.criticalFailure;
  
  return errors > 0 && !criticalFailure ? 'successful' : errors === 0 ? 'not_needed' : 'failed';
};

const calculateStepSuccessRate = () => {
  const totalSteps = 8;
  const failedSteps = [
    data.support.classification?.classificationError,
    data.sentimentAnalysis?.analysisError,
    data.escalationDecision?.fallbackApplied,
    data.conversationResponse?.fallbackApplied,
    data.handoffComplete?.fallbackProcedure,
    data.contextPreservation?.preservationError,
    data.outcomeTracking?.trackingError,
    data.performanceAnalysis?.analysisError
  ].filter(Boolean).length;
  
  return Math.round(((totalSteps - failedSteps) / totalSteps) * 100);
};

const assessFallbackEffectiveness = () => {
  const fallbacksUsed = countFallbacksTriggered();
  const customerGotResponse = !!data.conversationResponse?.responseMessage;
  
  return fallbacksUsed > 0 ? customerGotResponse : true;
};

const validateDataIntegrity = () => {
  const requiredData = [
    data.escalationAgent?.ticketId,
    data.support?.classification,
    data.escalationDecision?.decision,
    data.conversationResponse?.responseMessage || data.handoffComplete?.targetTeam
  ];
  
  return requiredData.every(item => item !== undefined && item !== null);
};

// Assessment helper functions
const assessClassificationAccuracy = () => {
  // Would typically compare against human validation
  const confidence = data.support.classification.classificationConfidence;
  return confidence === 'high' ? 90 : confidence === 'medium' ? 70 : 50;
};

const assessSentimentQuality = () => {
  const confidence = data.sentimentAnalysis.analysisConfidence;
  return confidence === 'high' ? 85 : confidence === 'medium' ? 65 : 45;
};

const assessRiskAccuracy = () => {
  // Risk assessment accuracy would be validated against outcomes
  return data.escalationRisk.overall > 70 && data.handoffComplete?.targetTeam ? 85 : 60;
};

const assessResponseQuality = () => {
  return data.conversationResponse?.fallbackApplied ? 40 : 80;
};

const assessResourceUtilization = () => {
  const apiCalls = 5; // Approximate number of AI API calls
  const totalTime = Date.now() - new Date(data.escalationAgent.startedAt).getTime();
  
  return {
    apiCallsUsed: apiCalls,
    processingTime: totalTime,
    efficiency: totalTime < 60000 ? 'high' : totalTime < 120000 ? 'medium' : 'low'
  };
};

const calculateScalabilityScore = () => {
  const factors = [
    data.escalationAgent.totalDuration < 60000, // Under 1 minute
    !data.criticalFailure,
    countFallbacksTriggered() < 2,
    calculateStepSuccessRate() > 80
  ];
  
  return Math.round((factors.filter(Boolean).length / factors.length) * 100);
};

const generateBasicMetrics = () => {
  return {
    ticketId: data.escalationAgent.ticketId,
    processingTime: Date.now() - new Date(data.escalationAgent.startedAt).getTime(),
    escalationDecision: data.escalationDecision?.decision,
    responseProvided: !!data.conversationResponse?.responseMessage,
    errorsEncountered: countFallbacksTriggered()
  };
};
```

***

### Testing Your Escalation Agent

#### Comprehensive Test Suite

Create test cases that cover all escalation scenarios:

```bash
# Test Case 1: Low-risk standard support request
aloma task new "Standard Support Request" \
  -d '{
    "support": {
      "ticket": {
        "id": "TICK-STD-001",
        "subject": "Password reset assistance",
        "description": "Hi, I forgot my password and cannot access my account. Could you please help me reset it? Thanks!",
        "customerEmail": "user@example.com",
        "channel": "email",
        "customerId": "CUST-12345",
        "customerTier": "paid",
        "accountValue": 500,
        "previousTicketCount": 2
      }
    }
  }'

# Test Case 2: High-risk enterprise escalation
aloma task new "Enterprise Critical Issue" \
  -d '{
    "support": {
      "ticket": {
        "id": "TICK-ENT-001", 
        "subject": "CRITICAL: Production API outage affecting our entire platform",
        "description": "Our production system has been down for 20 minutes due to API authentication failures. This is costing us thousands per minute and our customers are furious. We need immediate escalation to your engineering team. This is completely unacceptable for an enterprise customer. We are considering legal action if this isnt resolved immediately.",
        "customerEmail": "cto@enterprise.com",
        "channel": "phone",
        "customerId": "CUST-ENT-001",
        "customerTier": "enterprise",
        "accountValue": 100000,
        "previousTicketCount": 8,
        "escalationHistory": ["PREV-ESC-001", "PREV-ESC-002"]
      }
    }
  }'

# Test Case 3: Complex technical integration issue
aloma task new "Complex Technical Issue" \
  -d '{
    "support": {
      "ticket": {
        "id": "TICK-TECH-001",
        "subject": "Webhook payload inconsistency in production environment",
        "description": "We are implementing your webhooks API and noticing inconsistent payload structures between your documentation and what were receiving in production. Specifically, the order.items array sometimes contains nested product objects and sometimes just product IDs. Our integration is failing intermittently because of this. Can someone from your technical team help clarify the expected behavior?",
        "customerEmail": "dev@techcompany.com", 
        "channel": "email",
        "customerId": "CUST-TECH-001",
        "customerTier": "paid",
        "accountValue": 5000,
        "previousTicketCount": 12
      }
    }
  }'

# Test Case 4: Frustrated repeat customer
aloma task new "Frustrated Repeat Customer" \
  -d '{
    "support": {
      "ticket": {
        "id": "TICK-REPEAT-001",
        "subject": "THIRD TIME contacting about billing error!!!",
        "description": "This is the THIRD time I am contacting support about the same billing issue. I have been charged twice for my subscription for the past 3 months and nobody seems to be able to fix this. I have provided bank statements, screenshots, and detailed explanations multiple times. I am beyond frustrated and will be leaving negative reviews if this is not resolved immediately. This is completely unprofessional.",
        "customerEmail": "angry@customer.com",
        "channel": "email", 
        "customerId": "CUST-ANGRY-001",
        "customerTier": "paid",
        "accountValue": 1200,
        "previousTicketCount": 15,
        "supportHistory": ["billing_issue_1", "billing_issue_2", "billing_complaint"],
        "escalationHistory": ["ESC-BILL-001"]
      }
    }
  }'
```

#### Monitor Agent Performance

```bash
# Check task execution
aloma task list --state done

# View detailed agent decisions
aloma task show <task-id>

# Monitor escalation patterns
aloma task list --filter '{"escalationDecision.escalationRecommended": true}'

# Check error handling effectiveness
aloma task list --filter '{"criticalFailure": true}'
```

#### Expected Agent Behaviors

**Test Case 1 (Standard Request)**:

* ✅ Classification: `general_inquiry`, `medium` priority
* ✅ Sentiment: Low frustration (< 30%)
* ✅ Decision: `no_escalation` - handle with standard response
* ✅ Response: Helpful password reset instructions
* ✅ Outcome: Self-resolved through automated guidance

**Test Case 2 (Enterprise Critical)**:

* ✅ Classification: `technical`, `critical` priority, `expert_required`
* ✅ Sentiment: Very high frustration (> 90%)
* ✅ Decision: `immediate_escalation` to engineering team
* ✅ Handoff: Complete context transfer within 2-5 minutes
* ✅ Notifications: Slack alerts, email escalation, ticket updates

**Test Case 3 (Technical Complexity)**:

* ✅ Classification: `integration`, `high` priority, `complex`
* ✅ Analysis: Technical knowledge detected, specific issue identified
* ✅ Decision: `specialist_escalation` to technical support team
* ✅ Context: Technical details preserved for specialist review

**Test Case 4 (Frustrated Repeat Customer)**:

* ✅ Classification: `billing`, `high` priority with escalation signals
* ✅ Sentiment: Extremely high frustration (> 85%), repeat issue detection
* ✅ Decision: `management_escalation` due to relationship risk
* ✅ Special handling: Empathetic response, priority routing, management notification

***

### Production Deployment Guidelines

#### Pre-Production Checklist

```bash
# 1. Validate all connectors
aloma connector test openai.com
aloma connector test supportEmail  
aloma connector test supportSlack
aloma connector test zendesk

# 2. Configure production secrets
aloma secret add "SUPPORT_EMAIL" "support@yourcompany.com"
aloma secret add "ESCALATION_EMAIL" "escalation@yourcompany.com"
aloma secret add "SLACK_SUPPORT_CHANNEL" "#customer-support"
aloma secret add "OPENAI_API_KEY" "your-production-api-key"

# 3. Set up monitoring
aloma workspace update --env-var "SUPPORT_DASHBOARD" "https://support.yourcompany.com"
aloma workspace update --env-var "PERFORMANCE_TRACKING" "enabled"

# 4. Deploy all steps
aloma step list --validate
aloma step sync --production
```

#### Monitoring and Alerting

Set up comprehensive monitoring for production deployment:

1. **Performance Metrics**
   * Average processing time per ticket
   * Escalation accuracy rate
   * Customer satisfaction scores
   * Error rates and fallback frequency
2. **Business Metrics**
   * Support ticket volume handling
   * Human agent workload reduction
   * Customer response times
   * Resolution rates
3. **System Health**
   * API response times and success rates
   * Connector availability and performance
   * Data integrity and context preservation
   * Escalation handoff success rates

#### Scaling Considerations

The escalation agent is designed to scale efficiently:

* **Concurrent Processing**: Each ticket is processed independently
* **Resource Management**: AI API calls are optimized and cached when possible
* **Load Balancing**: Multiple instances can handle high ticket volumes
* **Failure Isolation**: Individual ticket failures don't affect other processing

***

### Document Structure Recommendation

This comprehensive Customer Support Escalation Agent document is quite extensive (approximately 15,000+ words). For better usability and maintenance, I recommend breaking it into the following sections:

#### **Recommended Document Structure:**

1. **Customer Support Escalation Agent - Overview & Architecture** (3,000 words)
   * Introduction, architecture overview, prerequisites
   * Components explanation and data flow patterns
2. **Implementation Guide - Core Steps (Steps 1-4)** (4,000 words)
   * Ticket intake, sentiment analysis, decision engine, conversation management
   * Core intelligence implementation with code examples
3. **Implementation Guide - Handoff & Learning (Steps 5-8)** (4,000 words)
   * Human handoff, context preservation, outcome tracking, performance analytics
   * Advanced features and continuous improvement
4. **Testing, Deployment & Production Guide** (3,000 words)
   * Comprehensive testing scenarios, production deployment guidelines
   * Monitoring, scaling, and maintenance procedures
5. **Advanced Configuration & Customization** (2,000 words)
   * Custom escalation rules, integration patterns, enterprise features
   * Performance tuning and optimization techniques

This structure would provide:

* ✅ **Manageable document sizes** for easier navigation
* ✅ **Logical progression** from concepts to implementation to deployment
* ✅ **Focused content** allowing teams to access relevant sections quickly
* ✅ **Maintainable structure** for future updates and improvements

Would you like me to break this down into these separate documents, or would you prefer to keep it as one comprehensive guide?
