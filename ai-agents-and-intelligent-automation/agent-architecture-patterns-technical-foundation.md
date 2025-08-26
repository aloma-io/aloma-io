# Agent Architecture Patterns - Technical Foundation

## Agent Architecture Patterns - Technical Foundation

**Essential architectural patterns for building intelligent AI agents with ALOMA's conditional execution model. Master these three foundational patterns to create agents that react intelligently, pursue complex goals, and maintain meaningful conversations.**

### Understanding Agent Architectures in ALOMA

AI agents in ALOMA are not monolithic programs—they're **emergent systems** that arise from carefully designed conditional steps working in concert. Each architecture pattern represents a different approach to organizing these steps for specific types of intelligent behavior.

The key insight is that **agent intelligence emerges from the interaction between conditional logic and AI reasoning**—where traditional workflow tools see sequential steps, ALOMA agents see opportunities for adaptive, context-aware decision making.

***

### Reactive Agents: Event-Driven Intelligence

**Reactive agents** respond to incoming data conditions with AI-powered reasoning and immediate action. They excel at real-time processing, anomaly detection, and adaptive responses to changing conditions.

#### Core Pattern Structure

```javascript
// Data Monitoring Step: Continuously watches for conditions
export const condition = {
  monitoringTarget: {
    metrics: Array,
    lastCheck: Number,
    recentAnalysis: null
  }
};

// Note: Time-based logic implemented in step content

export const content = async () => {
  const currentTime = Date.now();
  const timeSinceLastCheck = currentTime - data.monitoringTarget.lastCheck;
  
  // Only analyze if enough time has passed or significant change detected
  if (timeSinceLastCheck > 300000) { // 5 minutes
    data.monitoringTarget.requiresAnalysis = true;
    data.monitoringTarget.analysisReason = 'scheduled_check';
  } else {
    // Check for significant metric changes
    const significantChange = data.monitoringTarget.metrics.some(metric => 
      Math.abs(metric.currentValue - metric.previousValue) > metric.threshold
    );
    
    if (significantChange) {
      data.monitoringTarget.requiresAnalysis = true;
      data.monitoringTarget.analysisReason = 'metric_anomaly';
    }
  }
};

// AI Analysis Step: Reactive reasoning based on detected conditions
export const condition = {
  monitoringTarget: {
    requiresAnalysis: true,
    analysisReason: String,
    metrics: Array
  },
  reactiveAnalysis: null
};

export const content = async () => {
  console.log(`Reactive agent analyzing: ${data.monitoringTarget.analysisReason}`);
  
  // AI agent analyzes current conditions with context
  const analysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a reactive monitoring agent. Analyze the current metrics and determine:
        1. Severity level (normal/warning/critical)
        2. Root cause analysis
        3. Immediate actions required
        4. Escalation recommendations
        
        Consider historical patterns and provide structured response in JSON format.`
      },
      {
        role: 'user',
        content: `Analysis trigger: ${data.monitoringTarget.analysisReason}
        
        Current metrics: ${JSON.stringify(data.monitoringTarget.metrics)}
        
        Historical context: ${JSON.stringify(data.monitoringTarget.history || 'No history available')}
        
        Time since last check: ${Date.now() - data.monitoringTarget.lastCheck}ms`
      }
    ]
  });

  try {
    const result = JSON.parse(analysis.choices[0].message.content);
    
    data.reactiveAnalysis = {
      severity: result.severity,
      rootCause: result.rootCause,
      immediateActions: result.immediateActions,
      escalationNeeded: result.escalationRecommendations,
      analysisTimestamp: new Date().toISOString(),
      confidence: result.confidence || 'medium'
    };
    
    // Agent decides next actions based on severity
    if (result.severity === 'critical') {
      data.reactiveAnalysis.triggerImmediateResponse = true;
    } else if (result.severity === 'warning') {
      data.reactiveAnalysis.scheduleFollowUp = true;
    }
    
    console.log(`Reactive analysis complete: ${result.severity} severity detected`);
    
  } catch (error) {
    console.error('Reactive analysis failed:', error);
    data.reactiveAnalysis = {
      failed: true,
      error: error.message,
      fallbackAction: 'escalate_to_human'
    };
  }
};

// Immediate Response Step: Takes action based on analysis
export const condition = {
  reactiveAnalysis: {
    triggerImmediateResponse: true,
    immediateActions: Array
  }
};

export const content = async () => {
  console.log('Reactive agent executing immediate response');
  
  // Execute each immediate action identified by the AI
  for (const action of data.reactiveAnalysis.immediateActions) {
    switch (action.type) {
      case 'alert':
        await connectors.alerting.send({
          severity: 'high',
          message: action.message,
          channel: action.channel
        });
        break;
        
      case 'auto_fix':
        await connectors.systemManagement.execute({
          command: action.command,
          parameters: action.parameters
        });
        break;
        
      case 'data_collection':
        // Trigger additional data gathering
        data.diagnostics = {
          collectAdditionalData: true,
          dataTypes: action.dataTypes,
          priority: 'high'
        };
        break;
    }
  }
  
  data.reactiveResponse = {
    actionsExecuted: data.reactiveAnalysis.immediateActions.length,
    executedAt: new Date().toISOString(),
    status: 'completed'
  };
};
```

#### Reactive Agent Use Cases

**System Monitoring Agent:**

```javascript
// Detects infrastructure anomalies and responds automatically
export const condition = {
  infrastructure: {
    cpuUsage: Number,
    memoryUsage: Number,
    alertSent: null
  }
};

// Note: Threshold logic (cpuUsage > 80, memoryUsage > 85) implemented in step content

export const content = async () => {
  const diagnosis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `System alert: CPU ${data.infrastructure.cpuUsage}%, Memory ${data.infrastructure.memoryUsage}%. 
      
      Diagnose the issue and recommend immediate actions.`
    }]
  });
  
  const result = JSON.parse(diagnosis.choices[0].message.content);
  
  // Agent takes immediate action
  if (result.recommendation === 'scale_up') {
    await connectors.cloudProvider.scaleInstances({
      count: result.additionalInstances
    });
  }
  
  data.infrastructure.alertSent = true;
  data.infrastructure.actionTaken = result.recommendation;
};
```

***

### Goal-Oriented Agents: Strategic Intelligence

**Goal-oriented agents** pursue complex, multi-step objectives through planning, execution, and adaptation. They excel at research tasks, project management, and any scenario requiring strategic thinking over multiple phases.

#### Core Pattern Structure

```javascript
// Goal Initialization Step: Defines objectives and creates execution plan
export const condition = {
  objective: {
    goal: String,
    context: Object,
    plan: null
  }
};

export const content = async () => {
  console.log(`Goal-oriented agent initializing: ${data.objective.goal}`);
  
  // AI agent creates strategic plan to achieve the goal
  const planningResult = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a strategic planning agent. Create a detailed execution plan to achieve the given objective. 
        
        Break down the goal into phases, identify dependencies, estimate timelines, and define success criteria for each phase.
        
        Respond with a structured plan in JSON format.`
      },
      {
        role: 'user',
        content: `Goal: ${data.objective.goal}
        
        Context: ${JSON.stringify(data.objective.context)}
        
        Available resources: ${JSON.stringify(data.objective.resources || {})}
        
        Constraints: ${JSON.stringify(data.objective.constraints || {})}`
      }
    ]
  });

  try {
    const plan = JSON.parse(planningResult.choices[0].message.content);
    
    data.objective.plan = {
      phases: plan.phases,
      dependencies: plan.dependencies,
      timeline: plan.estimatedTimeline,
      successCriteria: plan.successCriteria,
      currentPhase: 0,
      planCreatedAt: new Date().toISOString()
    };
    
    // Initialize tracking for first phase
    data.objective.currentPhase = plan.phases[0];
    data.objective.phaseStatus = 'ready_to_start';
    
    console.log(`Strategic plan created with ${plan.phases.length} phases`);
    
  } catch (error) {
    console.error('Planning failed:', error);
    data.objective.planningFailed = true;
    data.objective.fallbackAction = 'request_human_planning';
  }
};

// Phase Execution Step: Executes current phase of the plan
export const condition = {
  objective: {
    plan: Object,
    currentPhase: Object,
    phaseStatus: "ready_to_start"
  }
};

export const content = async () => {
  const currentPhase = data.objective.currentPhase;
  console.log(`Executing phase: ${currentPhase.name}`);
  
  // AI agent executes phase-specific actions
  const executionGuidance = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are executing a phase of a strategic plan. Provide specific, actionable steps for this phase.
        
        Return a JSON object with:
        - specificActions: Array of concrete actions to take
        - dataRequirements: What data/information is needed
        - successMetrics: How to measure phase completion
        - nextSteps: What to do after completion`
      },
      {
        role: 'user',
        content: `Phase: ${currentPhase.name}
        
        Phase objective: ${currentPhase.objective}
        
        Phase details: ${JSON.stringify(currentPhase)}
        
        Current context: ${JSON.stringify(data.objective.context)}
        
        Previous phase results: ${JSON.stringify(data.objective.previousResults || {})}`
      }
    ]
  });

  try {
    const execution = JSON.parse(executionGuidance.choices[0].message.content);
    
    // Execute each specific action
    const actionResults = [];
    
    for (const action of execution.specificActions) {
      console.log(`Executing action: ${action.description}`);
      
      // Route action based on type
      switch (action.type) {
        case 'research':
          const researchResult = await performResearch(action.parameters);
          actionResults.push({ action: action.description, result: researchResult });
          break;
          
        case 'data_analysis':
          const analysisResult = await performAnalysis(action.parameters);
          actionResults.push({ action: action.description, result: analysisResult });
          break;
          
        case 'communication':
          const commResult = await sendCommunication(action.parameters);
          actionResults.push({ action: action.description, result: commResult });
          break;
          
        case 'subtask':
          // Create subtask for complex actions
          task.subtask(action.description, {
            ...action.parameters,
            parentObjective: data.objective.goal
          }, { into: `phaseResults.${action.id}`, waitFor: true });
          break;
      }
    }
    
    data.objective.phaseExecution = {
      phase: currentPhase.name,
      actionsCompleted: actionResults,
      executedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    data.objective.phaseStatus = 'completed';
    
  } catch (error) {
    console.error(`Phase execution failed:`, error);
    data.objective.phaseStatus = 'failed';
    data.objective.executionError = error.message;
  }
};

// Phase Transition Step: Evaluates progress and moves to next phase
export const condition = {
  objective: {
    phaseStatus: "completed",
    plan: Object,
    phaseExecution: Object
  }
};

export const content = async () => {
  // AI agent evaluates phase completion and decides next steps
  const evaluation = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are evaluating the completion of a strategic phase. Determine:
        1. Whether the phase objectives were met
        2. Quality of the results achieved
        3. Whether to proceed to next phase, retry current phase, or adapt the plan
        4. Any insights that should inform future phases
        
        Respond in JSON format with clear recommendations.`
      },
      {
        role: 'user',
        content: `Completed phase: ${data.objective.currentPhase.name}
        
        Phase objectives: ${JSON.stringify(data.objective.currentPhase)}
        
        Execution results: ${JSON.stringify(data.objective.phaseExecution)}
        
        Overall goal: ${data.objective.goal}
        
        Remaining phases: ${JSON.stringify(data.objective.plan.phases.slice(data.objective.plan.currentPhase + 1))}`
      }
    ]
  });

  try {
    const eval_result = JSON.parse(evaluation.choices[0].message.content);
    
    data.objective.phaseEvaluation = {
      objectivesMet: eval_result.objectivesMet,
      qualityScore: eval_result.qualityScore,
      recommendation: eval_result.recommendation,
      insights: eval_result.insights,
      evaluatedAt: new Date().toISOString()
    };
    
    // Agent decides on next action based on evaluation
    if (eval_result.recommendation === 'proceed') {
      const nextPhaseIndex = data.objective.plan.currentPhase + 1;
      
      if (nextPhaseIndex < data.objective.plan.phases.length) {
        // Move to next phase
        data.objective.plan.currentPhase = nextPhaseIndex;
        data.objective.currentPhase = data.objective.plan.phases[nextPhaseIndex];
        data.objective.phaseStatus = 'ready_to_start';
        
        console.log(`Proceeding to phase ${nextPhaseIndex + 1}: ${data.objective.currentPhase.name}`);
      } else {
        // Goal achieved
        data.objective.goalAchieved = true;
        data.objective.completedAt = new Date().toISOString();
        
        console.log(`Goal achieved: ${data.objective.goal}`);
      }
      
    } else if (eval_result.recommendation === 'retry') {
      // Retry current phase with adjustments
      data.objective.phaseStatus = 'ready_to_start';
      data.objective.retryAttempts = (data.objective.retryAttempts || 0) + 1;
      
    } else if (eval_result.recommendation === 'adapt_plan') {
      // Plan needs modification
      data.objective.requiresPlanAdaptation = true;
    }
    
  } catch (error) {
    console.error('Phase evaluation failed:', error);
    data.objective.evaluationFailed = true;
  }
};

// Helper functions for action execution
const performResearch = async (parameters) => {
  const research = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Research: ${parameters.topic}. Focus on: ${parameters.focus}. Provide structured findings.`
    }]
  });
  
  return JSON.parse(research.choices[0].message.content);
};

const performAnalysis = async (parameters) => {
  const analysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Analyze: ${JSON.stringify(parameters.data)}. Analysis type: ${parameters.analysisType}`
    }]
  });
  
  return JSON.parse(analysis.choices[0].message.content);
};

const sendCommunication = async (parameters) => {
  await connectors.communication.send({
    type: parameters.communicationType,
    recipient: parameters.recipient,
    message: parameters.message
  });
  
  return { sent: true, timestamp: new Date().toISOString() };
};
```

#### Goal-Oriented Agent Use Cases

**Research Agent Example:**

```javascript
// Multi-phase market research agent
export const condition = {
  research: {
    target: "emerging AI startups",
    scope: "competitive landscape",
    plan: null
  }
};

export const content = async () => {
  const plan = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'user',
      content: `Create a comprehensive research plan for: ${data.research.target}
      
      Scope: ${data.research.scope}
      
      Include phases for data gathering, analysis, and insight generation.`
    }]
  });
  
  data.research.plan = JSON.parse(plan.choices[0].message.content);
  data.research.currentPhase = data.research.plan.phases[0];
};
```

***

### Conversational Agents: Dialogue Intelligence

**Conversational agents** maintain stateful dialogues across multiple interactions, understanding context, tracking conversation goals, and adapting their communication style based on the conversation's evolution.

#### Core Pattern Structure

```javascript
// Conversation Initialization Step: Sets up dialogue context
export const condition = {
  conversation: {
    participantId: String,
    initialMessage: String,
    context: null
  }
};

export const content = async () => {
  console.log(`Initializing conversation with participant: ${data.conversation.participantId}`);
  
  // AI agent analyzes initial message and sets conversation context
  const contextAnalysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a conversational agent initializing a dialogue. Analyze the initial message and establish:
        1. Conversation intent and goals
        2. Participant's emotional state and communication style
        3. Appropriate agent persona and tone
        4. Key topics and context clues
        5. Conversation strategy
        
        Respond in JSON format with this analysis.`
      },
      {
        role: 'user',
        content: `Initial message: "${data.conversation.initialMessage}"
        
        Participant ID: ${data.conversation.participantId}
        
        Available participant history: ${JSON.stringify(data.conversation.participantHistory || {})}`
      }
    ]
  });

  try {
    const analysis = JSON.parse(contextAnalysis.choices[0].message.content);
    
    data.conversation.context = {
      intent: analysis.intent,
      goals: analysis.goals,
      participantEmotion: analysis.emotionalState,
      participantStyle: analysis.communicationStyle,
      agentPersona: analysis.recommendedPersona,
      agentTone: analysis.recommendedTone,
      topics: analysis.keyTopics,
      strategy: analysis.conversationStrategy,
      initializedAt: new Date().toISOString()
    };
    
    // Initialize conversation memory
    data.conversation.memory = {
      messageHistory: [
        {
          role: 'user',
          content: data.conversation.initialMessage,
          timestamp: new Date().toISOString(),
          analysis: {
            emotion: analysis.emotionalState,
            intent: analysis.intent
          }
        }
      ],
      topicStack: analysis.keyTopics,
      conversationState: 'initialized',
      turnCount: 1
    };
    
    console.log(`Conversation context established: ${analysis.intent} intent with ${analysis.recommendedTone} tone`);
    
  } catch (error) {
    console.error('Conversation initialization failed:', error);
    data.conversation.initializationFailed = true;
  }
};

// Response Generation Step: Creates contextual responses
export const condition = {
  conversation: {
    context: Object,
    memory: Object,
    pendingResponse: null
  }
};

export const content = async () => {
  const context = data.conversation.context;
  const memory = data.conversation.memory;
  
  console.log(`Generating response for conversation turn ${memory.turnCount}`);
  
  // AI agent crafts contextual response based on full conversation state
  const responseGeneration = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a ${context.agentPersona} having a conversation. 
        
        Your current tone: ${context.agentTone}
        Conversation intent: ${context.intent}
        Your goals: ${JSON.stringify(context.goals)}
        
        Respond naturally while advancing the conversation toward your goals. 
        Consider the full context and adapt your approach based on the participant's style.
        
        Return your response and an analysis of what you're trying to achieve.`
      },
      {
        role: 'user',
        content: `Conversation history: ${JSON.stringify(memory.messageHistory)}
        
        Current topics: ${JSON.stringify(memory.topicStack)}
        
        Participant communication style: ${context.participantStyle}
        Participant emotional state: ${context.participantEmotion}
        
        Generate an appropriate response that moves the conversation forward.
        
        Response format:
        {
          "response": "your actual response text",
          "intent": "what you're trying to achieve",
          "nextTopics": ["topics to potentially explore"],
          "emotionalApproach": "empathy/enthusiasm/professionalism/etc"
        }`
      }
    ]
  });

  try {
    const result = JSON.parse(responseGeneration.choices[0].message.content);
    
    data.conversation.pendingResponse = {
      message: result.response,
      intent: result.intent,
      nextTopics: result.nextTopics,
      emotionalApproach: result.emotionalApproach,
      generatedAt: new Date().toISOString()
    };
    
    // Update conversation memory with agent's response
    data.conversation.memory.messageHistory.push({
      role: 'assistant',
      content: result.response,
      timestamp: new Date().toISOString(),
      analysis: {
        intent: result.intent,
        approach: result.emotionalApproach
      }
    });
    
    console.log(`Response generated with intent: ${result.intent}`);
    
  } catch (error) {
    console.error('Response generation failed:', error);
    data.conversation.responseGenerationFailed = true;
  }
};

// Message Processing Step: Handles incoming participant messages
export const condition = {
  conversation: {
    newMessage: String,
    memory: Object,
    context: Object
  },
  messageProcessing: null
};

export const content = async () => {
  console.log(`Processing new message in conversation`);
  
  // AI agent analyzes new message in context of conversation history
  const messageAnalysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are analyzing a new message in an ongoing conversation. Determine:
        1. How the participant's emotional state has changed
        2. Whether the conversation intent/goals should be updated
        3. New topics introduced or topics that should be dropped
        4. How well the conversation is progressing toward goals
        5. What the agent should focus on in the next response
        
        Provide analysis in JSON format.`
      },
      {
        role: 'user',
        content: `New message: "${data.conversation.newMessage}"
        
        Conversation history: ${JSON.stringify(data.conversation.memory.messageHistory)}
        
        Current context: ${JSON.stringify(data.conversation.context)}
        
        Previous topics: ${JSON.stringify(data.conversation.memory.topicStack)}`
      }
    ]
  });

  try {
    const analysis = JSON.parse(messageAnalysis.choices[0].message.content);
    
    // Update conversation memory and context based on analysis
    data.conversation.memory.messageHistory.push({
      role: 'user',
      content: data.conversation.newMessage,
      timestamp: new Date().toISOString(),
      analysis: {
        emotion: analysis.emotionalState,
        topicsIntroduced: analysis.newTopics
      }
    });
    
    data.conversation.memory.turnCount += 1;
    data.conversation.memory.topicStack = analysis.updatedTopics;
    data.conversation.memory.conversationState = analysis.conversationProgress;
    
    // Update context if participant's state has changed significantly
    if (analysis.emotionalStateChanged) {
      data.conversation.context.participantEmotion = analysis.emotionalState;
    }
    
    if (analysis.intentShift) {
      data.conversation.context.intent = analysis.newIntent;
      data.conversation.context.goals = analysis.updatedGoals;
    }
    
    data.messageProcessing = {
      analyzed: true,
      emotionalChange: analysis.emotionalStateChanged,
      topicsUpdated: analysis.newTopics.length > 0,
      progressAssessment: analysis.conversationProgress,
      nextFocus: analysis.nextResponseFocus,
      processedAt: new Date().toISOString()
    };
    
    console.log(`Message processed. Progress: ${analysis.conversationProgress}`);
    
  } catch (error) {
    console.error('Message processing failed:', error);
    data.messageProcessing = {
      failed: true,
      error: error.message
    };
  }
};

// Conversation Strategy Adaptation Step: Adjusts approach based on progress
export const condition = {
  conversation: {
    memory: {
      turnCount: Number,
      conversationState: String
    },
    context: Object
  },
  strategyReview: null
};

// Note: Turn count logic (turnCount >= 3) implemented in step content

export const content = async () => {
  const memory = data.conversation.memory;
  const context = data.conversation.context;
  
  console.log(`Reviewing conversation strategy after ${memory.turnCount} turns`);
  
  // AI agent evaluates conversation effectiveness and adapts strategy
  const strategyReview = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are reviewing a conversation's effectiveness and adapting strategy. Evaluate:
        1. How well current approach is working
        2. Whether goals are being achieved
        3. If tone/persona adjustments are needed
        4. What topics to prioritize or avoid
        5. Whether conversation should be escalated or concluded
        
        Recommend strategy adjustments in JSON format.`
      },
      {
        role: 'user',
        content: `Conversation history: ${JSON.stringify(memory.messageHistory)}
        
        Current strategy: ${JSON.stringify(context.strategy)}
        Original goals: ${JSON.stringify(context.goals)}
        Current state: ${memory.conversationState}
        
        Evaluate effectiveness and recommend adjustments.`
      }
    ]
  });

  try {
    const review = JSON.parse(strategyReview.choices[0].message.content);
    
    data.strategyReview = {
      effectiveness: review.effectiveness,
      goalProgress: review.goalProgress,
      recommendedAdjustments: review.adjustments,
      shouldEscalate: review.escalationRecommended,
      shouldConclude: review.conclusionRecommended,
      reviewedAt: new Date().toISOString()
    };
    
    // Apply recommended strategy adjustments
    if (review.adjustments.toneChange) {
      data.conversation.context.agentTone = review.adjustments.newTone;
    }
    
    if (review.adjustments.personaShift) {
      data.conversation.context.agentPersona = review.adjustments.newPersona;
    }
    
    if (review.adjustments.goalRefinement) {
      data.conversation.context.goals = review.adjustments.refinedGoals;
    }
    
    console.log(`Strategy reviewed: ${review.effectiveness} effectiveness, adjustments applied`);
    
  } catch (error) {
    console.error('Strategy review failed:', error);
    data.strategyReview = {
      failed: true,
      error: error.message
    };
  }
};
```

#### Conversational Agent Use Cases

**Customer Support Agent:**

```javascript
// Maintains context across support interaction
export const condition = {
  support: {
    ticketId: String,
    customerMessage: String,
    conversationContext: null
  }
};

export const content = async () => {
  const contextSetup = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a customer support agent. Analyze this support request and establish conversation context.'
    }, {
      role: 'user',
      content: `Ticket: ${data.support.ticketId}
      Customer message: "${data.support.customerMessage}"
      
      Determine conversation strategy and initial response approach.`
    }]
  });
  
  const context = JSON.parse(contextSetup.choices[0].message.content);
  
  data.support.conversationContext = {
    issueType: context.issueType,
    urgency: context.urgency,
    customerEmotion: context.emotionalState,
    strategy: context.recommendedStrategy
  };
};
```

**Sales Conversation Agent:**

```javascript
// Manages sales dialogue with lead qualification
export const condition = {
  sales: {
    prospectId: String,
    conversationGoal: "qualify_lead",
    interactionHistory: Array
  }
};

export const content = async () => {
  const salesStrategy = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a sales conversation agent. Develop qualification strategy for this prospect.'
    }, {
      role: 'user',
      content: `Prospect: ${data.sales.prospectId}
      Goal: ${data.sales.conversationGoal}
      History: ${JSON.stringify(data.sales.interactionHistory)}
      
      Create conversation plan to qualify this lead effectively.`
    }]
  });
  
  const strategy = JSON.parse(salesStrategy.choices[0].message.content);
  
  data.sales.conversationPlan = {
    qualificationQuestions: strategy.questions,
    painPointExploration: strategy.painPoints,
    valueProposition: strategy.propositionTiming
  };
};
```

***

### Research Agents: Information Gathering and Synthesis

Research agents are among the most powerful AI agent patterns in ALOMA. They systematically gather information from multiple sources, synthesize findings, and build comprehensive knowledge bases—all through coordinated conditional steps.

#### Core Research Agent Architecture

Research agents follow a **pipeline pattern** where each phase builds upon previous findings:

```javascript
// Phase 1: Research Planning and Source Discovery
export const condition = {
  research: {
    target: String,
    researchPlan: null
  }
};

export const content = async () => {
  console.log('Research agent planning phase for:', data.research.target);
  
  // AI plans comprehensive research approach
  const planningPrompt = `You are a research agent planning comprehensive analysis of: ${data.research.target}

Create a research plan with:
1. Information categories to investigate
2. Priority order for data gathering
3. Sources to explore for each category
4. Synthesis approach for findings

Respond in JSON format with structured plan.`;

  const plan = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{ role: 'user', content: planningPrompt }]
  });

  const researchPlan = JSON.parse(plan.choices[0].message.content);
  
  data.research = {
    ...data.research,
    plan: researchPlan,
    phases: researchPlan.phases,
    currentPhase: 0,
    findings: {},
    sources: [],
    researchPlan: true,
    planCreatedAt: new Date().toISOString()
  };
  
  console.log('Research plan created:', researchPlan.phases.length + ' phases identified');
};

// Phase 2: Parallel Information Gathering
export const condition = {
  research: {
    researchPlan: true,
    currentPhase: Number,
    gatheringComplete: null
  }
};

export const content = async () => {
  const currentPhase = data.research.phases[data.research.currentPhase];
  console.log(`Executing research phase: ${currentPhase.name}`);
  
  // Create parallel subtasks for each information source
  const gatheringTasks = currentPhase.sources.map((source, index) => {
    const taskName = `Research: ${source.type} - ${source.topic}`;
    
    return task.subtask(taskName, {
      researchSource: source,
      targetEntity: data.research.target,
      sourceType: source.type,
      researchQuery: source.query,
      runResearchGathering: true
    }, { 
      into: `research.findings.phase_${data.research.currentPhase}.source_${index}`,
      waitFor: true 
    });
  });
  
  data.research.gatheringTasksCreated = gatheringTasks.length;
  data.research.gatheringComplete = true;
  
  console.log(`Created ${gatheringTasks.length} parallel research gathering tasks`);
};

// Phase 3: Information Synthesis and Analysis
export const condition = {
  research: {
    gatheringComplete: true,
    findings: Object,
    synthesis: null
  }
};

export const content = async () => {
  console.log('Starting information synthesis phase');
  
  // Gather all findings from current phase
  const phaseFindings = data.research.findings[`phase_${data.research.currentPhase}`];
  const consolidatedData = Object.values(phaseFindings).filter(finding => finding && finding.data);
  
  // AI synthesizes findings into coherent insights
  const synthesisPrompt = `You are a research analyst synthesizing information about: ${data.research.target}

Raw findings from multiple sources:
${JSON.stringify(consolidatedData, null, 2)}

Synthesize this information into:
1. Key insights and patterns
2. Factual summary
3. Areas requiring deeper investigation
4. Confidence levels for each finding
5. Contradictions or gaps identified

Provide structured JSON response.`;

  const synthesis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{ role: 'user', content: synthesisPrompt }]
  });

  const synthesizedInsights = JSON.parse(synthesis.choices[0].message.content);
  
  data.research.synthesis = {
    phase: data.research.currentPhase,
    insights: synthesizedInsights,
    rawDataSources: consolidatedData.length,
    synthesizedAt: new Date().toISOString(),
    confidence: synthesizedInsights.overallConfidence || 'medium'
  };
  
  // Determine if more research phases needed
  if (data.research.currentPhase < data.research.phases.length - 1) {
    data.research.currentPhase += 1;
    data.research.gatheringComplete = false; // Trigger next phase
  } else {
    data.research.allPhasesComplete = true;
  }
  
  console.log(`Phase ${data.research.currentPhase} synthesis complete. Confidence: ${synthesizedInsights.overallConfidence}`);
};

// Phase 4: Final Report Generation
export const condition = {
  research: {
    allPhasesComplete: true,
    finalReport: null
  }
};

export const content = async () => {
  console.log('Generating comprehensive research report');
  
  // Compile all synthesis results
  const allFindings = Object.keys(data.research.findings)
    .filter(key => key.startsWith('phase_'))
    .map(phaseKey => data.research.synthesis);
  
  // AI generates executive summary and actionable insights
  const reportPrompt = `Create a comprehensive research report for: ${data.research.target}

Research findings across ${allFindings.length} phases:
${JSON.stringify(allFindings, null, 2)}

Generate a structured report with:
1. Executive Summary
2. Key Findings (prioritized by importance)
3. Market/Competitive Position
4. Opportunities and Risks
5. Actionable Recommendations
6. Areas for Further Investigation

Format as professional business report in JSON structure.`;

  const report = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{ role: 'user', content: reportPrompt }]
  });

  const finalReport = JSON.parse(report.choices[0].message.content);
  
  data.research.finalReport = {
    ...finalReport,
    metadata: {
      researchTarget: data.research.target,
      phasesCompleted: data.research.phases.length,
      totalSources: data.research.gatheringTasksCreated,
      researchDuration: Date.now() - new Date(data.research.planCreatedAt).getTime(),
      generatedAt: new Date().toISOString()
    }
  };
  
  data.research.reportComplete = true;
  
  console.log('Research agent completed comprehensive analysis');
  task.name(`Research Report: ${data.research.target}`);
};
```

#### Research Agent Subtask Pattern

```javascript
// Research Gathering Subtask
export const condition = {
  runResearchGathering: true,
  researchSource: Object
};

export const content = async () => {
  const source = data.researchSource;
  console.log(`Gathering data from ${source.type}: ${source.topic}`);
  
  try {
    let gatheredData;
    
    switch (source.type) {
      case 'web_search':
        gatheredData = await connectors.webSearch.search({
          query: source.query,
          maxResults: 10
        });
        break;
        
      case 'news_analysis':
        gatheredData = await connectors.newsApi.search({
          query: data.targetEntity,
          timeframe: '30d',
          language: 'en'
        });
        break;
        
      case 'social_monitoring':
        gatheredData = await connectors.socialApi.monitor({
          entity: data.targetEntity,
          platforms: ['twitter', 'linkedin'],
          sentiment: true
        });
        break;
        
      case 'financial_data':
        gatheredData = await connectors.financialApi.getCompanyData({
          company: data.targetEntity,
          metrics: ['revenue', 'growth', 'funding']
        });
        break;
        
      default:
        // Fallback to AI-powered research
        const aiResearch = await connectors.openai.chat({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `Research ${source.topic} about ${data.targetEntity}. Focus on: ${source.query}. Provide detailed, factual information with sources where possible.`
          }]
        });
        
        gatheredData = {
          type: 'ai_research',
          content: aiResearch.choices[0].message.content,
          confidence: 'medium'
        };
    }
    
    // Structure and validate the gathered data
    data.gatheringResult = {
      source: source,
      data: gatheredData,
      status: 'success',
      gatheredAt: new Date().toISOString(),
      quality: assessDataQuality(gatheredData)
    };
    
  } catch (error) {
    console.error(`Research gathering failed for ${source.type}:`, error.message);
    
    data.gatheringResult = {
      source: source,
      error: error.message,
      status: 'failed',
      gatheredAt: new Date().toISOString()
    };
  }
  
  task.complete();
};

// Helper function for data quality assessment
const assessDataQuality = (data) => {
  if (!data) return 'poor';
  
  const dataPoints = Array.isArray(data) ? data.length : Object.keys(data).length;
  const hasTimestamp = data.timestamp || data.date || data.publishedAt;
  const hasSource = data.source || data.url || data.author;
  
  if (dataPoints > 5 && hasTimestamp && hasSource) return 'high';
  if (dataPoints > 2 && (hasTimestamp || hasSource)) return 'medium';
  return 'low';
};
```

### Decision Agents: Complex Business Logic with AI Augmentation

Decision agents combine traditional business rules with AI reasoning to make sophisticated decisions that would be impossible with either approach alone. They excel at handling edge cases, interpreting context, and making judgment calls.

#### Multi-Factor Decision Agent Architecture

```javascript
// Phase 1: Context Gathering and Situation Assessment
export const condition = {
  decision: {
    request: Object,
    contextAnalysis: null
  }
};

export const content = async () => {
  const request = data.decision.request;
  console.log('Decision agent analyzing context for:', request.type);
  
  // Gather relevant context data
  const contextData = {
    businessRules: await getBusinessRules(request.type),
    historicalDecisions: await getHistoricalDecisions(request.criteria),
    stakeholderImpact: await assessStakeholderImpact(request),
    riskFactors: await identifyRiskFactors(request),
    complianceRequirements: await getComplianceReqs(request.domain)
  };
  
  // AI analyzes complex situational context
  const contextAnalysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a decision analysis agent. Analyze this business situation comprehensively.'
    }, {
      role: 'user',
      content: `Decision Request: ${JSON.stringify(request, null, 2)}
      
      Context Data: ${JSON.stringify(contextData, null, 2)}
      
      Analyze:
      1. Situational complexity (low/medium/high)
      2. Stakeholder impact assessment
      3. Risk level evaluation
      4. Precedent relevance
      5. Compliance considerations
      6. Decision urgency level
      
      Provide structured JSON analysis.`
    }]
  });
  
  const analysis = JSON.parse(contextAnalysis.choices[0].message.content);
  
  data.decision.contextAnalysis = {
    ...analysis,
    contextData: contextData,
    analyzedAt: new Date().toISOString(),
    complexity: analysis.complexity
  };
  
  console.log(`Context analysis complete. Complexity: ${analysis.complexity}`);
};

// Phase 2: Multi-Criteria Decision Matrix
export const condition = {
  decision: {
    contextAnalysis: Object,
    decisionMatrix: null
  }
};

export const content = async () => {
  const context = data.decision.contextAnalysis;
  const request = data.decision.request;
  
  console.log('Building decision matrix with multiple criteria');
  
  // Define decision criteria based on context
  const decisionCriteria = {
    financial: {
      weight: context.complexity === 'high' ? 0.3 : 0.4,
      factors: ['cost', 'revenue_impact', 'roi', 'budget_fit']
    },
    risk: {
      weight: context.riskLevel === 'high' ? 0.4 : 0.2,
      factors: ['operational_risk', 'compliance_risk', 'reputation_risk']
    },
    strategic: {
      weight: 0.2,
      factors: ['alignment', 'long_term_value', 'competitive_advantage']
    },
    operational: {
      weight: 0.1,
      factors: ['feasibility', 'resource_availability', 'timeline']
    }
  };
  
  // AI evaluates each option against criteria
  const matrixAnalysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a decision matrix analyst. Evaluate each option systematically against the criteria.'
    }, {
      role: 'user',
      content: `Decision Options: ${JSON.stringify(request.options, null, 2)}
      
      Evaluation Criteria: ${JSON.stringify(decisionCriteria, null, 2)}
      
      Context: ${JSON.stringify(context, null, 2)}
      
      For each option, score against each criterion (1-10) and provide reasoning.
      Calculate weighted scores and rank options.
      
      Return structured JSON with detailed evaluation matrix.`
    }]
  });
  
  const matrix = JSON.parse(matrixAnalysis.choices[0].message.content);
  
  data.decision.decisionMatrix = {
    criteria: decisionCriteria,
    evaluations: matrix.evaluations,
    rankings: matrix.rankings,
    topRecommendation: matrix.rankings[0],
    matrixCreatedAt: new Date().toISOString()
  };
  
  console.log(`Decision matrix complete. Top recommendation: ${matrix.rankings[0].option}`);
};

// Phase 3: Edge Case and Exception Analysis
export const condition = {
  decision: {
    decisionMatrix: Object,
    edgeCaseAnalysis: null
  }
};

export const content = async () => {
  const matrix = data.decision.decisionMatrix;
  const context = data.decision.contextAnalysis;
  
  console.log('Analyzing edge cases and potential exceptions');
  
  // AI identifies potential complications and edge cases
  const edgeCaseAnalysis = await connectors.openai.chat({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are an expert at identifying business decision edge cases and potential complications.'
    }, {
      role: 'user',
      content: `Recommended Decision: ${JSON.stringify(matrix.topRecommendation, null, 2)}
      
      Context: ${JSON.stringify(context, null, 2)}
      
      Identify:
      1. Potential edge cases that could affect this decision
      2. Unintended consequences
      3. Stakeholder objections or concerns
      4. Implementation challenges
      5. Contingency plans needed
      6. Monitoring requirements
      
      For each issue, assess probability and impact.
      Provide mitigation strategies.
      
      Return structured JSON analysis.`
    }]
  });
  
  const edgeCase = JSON.parse(edgeCaseAnalysis.choices[0].message.content);
  
  data.decision.edgeCaseAnalysis = {
    ...edgeCase,
    analyzedAt: new Date().toISOString(),
    requiresContingencyPlanning: edgeCase.highRiskScenarios?.length > 0
  };
  
  // Adjust confidence based on edge case analysis
  const riskAdjustment = edgeCase.overallRiskLevel === 'high' ? -20 : 
                        edgeCase.overallRiskLevel === 'medium' ? -10 : 0;
  
  data.decision.adjustedConfidence = Math.max(0, matrix.topRecommendation.confidence + riskAdjustment);
  
  console.log(`Edge case analysis complete. Adjusted confidence: ${data.decision.adjustedConfidence}`);
};

// Phase 4: Final Decision and Implementation Plan
export const condition = {
  decision: {
    decisionMatrix: Object,
    edgeCaseAnalysis: Object,
    finalDecision: null
  }
};

export const content = async () => {
  const matrix = data.decision.decisionMatrix;
  const edgeCase = data.decision.edgeCaseAnalysis;
  const context = data.decision.contextAnalysis;
  
  console.log('Generating final decision and implementation plan');
  
  // Determine if decision should proceed based on confidence and risk
  const shouldProceed = data.decision.adjustedConfidence > 70 && 
                       edgeCase.overallRiskLevel !== 'unacceptable';
  
  if (shouldProceed) {
    // Generate implementation plan
    const implementationPlan = await connectors.openai.chat({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Create a detailed implementation plan for this business decision.'
      }, {
        role: 'user',
        content: `Approved Decision: ${JSON.stringify(matrix.topRecommendation, null, 2)}
        
        Edge Cases: ${JSON.stringify(edgeCase, null, 2)}
        
        Create implementation plan with:
        1. Step-by-step execution phases
        2. Resource requirements
        3. Timeline and milestones
        4. Risk mitigation steps
        5. Success metrics
        6. Contingency procedures
        
        Return structured JSON plan.`
      }]
    });
    
    const plan = JSON.parse(implementationPlan.choices[0].message.content);
    
    data.decision.finalDecision = {
      status: 'approved',
      selectedOption: matrix.topRecommendation,
      confidence: data.decision.adjustedConfidence,
      implementationPlan: plan,
      approvalReasoning: `Decision approved with ${data.decision.adjustedConfidence}% confidence based on systematic analysis`,
      decisionMadeAt: new Date().toISOString()
    };
    
  } else {
    // Decision rejected or requires escalation
    data.decision.finalDecision = {
      status: data.decision.adjustedConfidence < 50 ? 'rejected' : 'escalation_required',
      reasoning: `Insufficient confidence (${data.decision.adjustedConfidence}%) or high risk level (${edgeCase.overallRiskLevel})`,
      recommendedActions: [
        'Gather additional information',
        'Consult domain experts',
        'Consider alternative approaches',
        'Escalate to senior decision makers'
      ],
      decisionMadeAt: new Date().toISOString()
    };
  }
  
  console.log(`Final decision: ${data.decision.finalDecision.status}`);
  task.name(`Decision: ${data.decision.request.type} - ${data.decision.finalDecision.status}`);
};
```

#### Decision Agent Helper Functions

```javascript
// Business rules integration
const getBusinessRules = async (decisionType) => {
  // Retrieve applicable business rules from configuration or database
  const rules = await connectors.rulesEngine.getRules({
    type: decisionType,
    active: true
  });
  
  return rules.map(rule => ({
    id: rule.id,
    condition: rule.condition,
    action: rule.action,
    priority: rule.priority,
    lastUpdated: rule.updatedAt
  }));
};

// Historical decision patterns
const getHistoricalDecisions = async (criteria) => {
  const historicalData = await connectors.decisionDatabase.query({
    criteria: criteria,
    limit: 50,
    orderBy: 'relevance'
  });
  
  return historicalData.map(decision => ({
    outcome: decision.outcome,
    context: decision.context,
    successScore: decision.successScore,
    lessonsLearned: decision.lessonsLearned
  }));
};
```

### Conclusion

These agent architecture patterns demonstrate how ALOMA's conditional execution model creates sophisticated AI agents that go far beyond simple API calls. The key insights:

#### **Research Agents Excel at Knowledge Building**

* **Systematic Information Gathering**: Multi-phase approach ensures comprehensive coverage
* **Source Coordination**: Parallel subtasks enable rapid data collection from diverse sources
* **Intelligent Synthesis**: AI combines raw findings into actionable insights
* **Quality Assessment**: Built-in data quality validation ensures reliable outputs

#### **Decision Agents Handle Complex Judgment**

* **Multi-Criteria Analysis**: Systematic evaluation against weighted business criteria
* **Context Awareness**: Full situational understanding before making decisions
* **Edge Case Planning**: Proactive identification of potential complications
* **Risk-Adjusted Confidence**: Decisions include uncertainty quantification

#### **Why ALOMA Enables Superior Agents**

**Traditional AI Tools**: Linear, stateless, limited to single interactions

```
Input → AI Call → Output (no memory, no adaptation)
```

**ALOMA AI Agents**: Stateful, adaptive, multi-step reasoning

```
Context → Analysis → Planning → Execution → Learning → Adaptation
     ↑_____________Continuous State Evolution_____________↑
```

#### **Architectural Advantages**

1. **State Persistence**: Agent memory naturally maintained through data evolution
2. **Conditional Intelligence**: Agents respond intelligently to changing conditions
3. **Parallel Processing**: Multiple reasoning paths can execute simultaneously
4. **Error Resilience**: Failed steps don't break entire agent reasoning chains
5. **Incremental Enhancement**: New agent capabilities added as new conditional steps

#### **Next Steps**

Master these patterns and you can build agents that:

* **Research comprehensively** across multiple domains and sources
* **Make sophisticated decisions** with full context and risk awareness
* **Learn and adapt** from each interaction and outcome
* **Handle edge cases** that would break traditional automation
* **Scale intelligence** by adding new reasoning capabilities

Ready to build your first intelligent agent? The next guide walks through implementing a complete agent from scratch using these proven patterns.
