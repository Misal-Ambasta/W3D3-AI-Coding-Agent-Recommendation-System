const RecommendationEngine = require('../utils/recommendation_engine');
const agentsData = require('../agents_db.json');
const recommendationEngine = new RecommendationEngine(agentsData.agents);

exports.recommendAgents = (req, res) => {
  try {
    const { task_description, filters = {}, strategy = 'best_overall' } = req.body;
    if (!task_description || typeof task_description !== 'string') {
      return res.status(400).json({
        error: 'task_description is required and must be a string',
        code: 'MISSING_TASK_DESCRIPTION'
      });
    }
    req.startTime = req.startTime || Date.now();
    const recResult = recommendationEngine.getRecommendations(task_description, filters, strategy);
    const response = {
      success: true,
      data: {
        recommendations: recResult.top.map(rec => ({
          agent: {
            id: rec.agent.id,
            name: rec.agent.name,
            description: rec.agent.description,
            version: rec.agent.version,
            languages: rec.agent.languages,
            ide_integration: rec.agent.ide_integration,
            strengths: rec.agent.strengths,
            weaknesses: rec.agent.weaknesses,
            best_use_cases: rec.agent.best_use_cases,
            pricing: rec.agent.pricing,
            performance_metrics: rec.agent.performance_metrics,
            features: rec.agent.features,
            complexity_rating: rec.agent.complexity_rating,
            setup_difficulty: rec.agent.setup_difficulty,
            learning_curve: rec.agent.learning_curve
          },
          score: rec.score,
          scoreBreakdown: {
            language: Math.round(rec.scores.language),
            complexity: Math.round(rec.scores.complexity),
            useCase: Math.round(rec.scores.useCase),
            integration: Math.round(rec.scores.integration),
            performance: Math.round(rec.scores.performance)
          },
          reasoning: rec.reasoning,
          taskAnalysis: rec.taskAnalysis
        })),
        alternatives: recResult.alternatives.map(rec => ({
          agent: {
            id: rec.agent.id,
            name: rec.agent.name,
            description: rec.agent.description,
            version: rec.agent.version,
            languages: rec.agent.languages,
            ide_integration: rec.agent.ide_integration,
            strengths: rec.agent.strengths,
            weaknesses: rec.agent.weaknesses,
            best_use_cases: rec.agent.best_use_cases,
            pricing: rec.agent.pricing,
            performance_metrics: rec.agent.performance_metrics,
            features: rec.agent.features,
            complexity_rating: rec.agent.complexity_rating,
            setup_difficulty: rec.agent.setup_difficulty,
            learning_curve: rec.agent.learning_curve
          },
          score: rec.score,
          scoreBreakdown: {
            language: Math.round(rec.scores.language),
            complexity: Math.round(rec.scores.complexity),
            useCase: Math.round(rec.scores.useCase),
            integration: Math.round(rec.scores.integration),
            performance: Math.round(rec.scores.performance)
          },
          reasoning: rec.reasoning,
          taskAnalysis: rec.taskAnalysis
        })),
        allScores: recResult.all.map(rec => ({
          agentId: rec.agent.id,
          score: rec.score
        })),
        taskAnalysis: recResult.taskAnalysis,
        strategy: strategy,
        filters: filters,
        totalAgentsConsidered: agentsData.agents.length
      },
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - req.startTime
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error in recommendation endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

exports.getAllAgents = (req, res) => {
  try {
    const { limit, offset, category, language, sortBy, order, taskDescription } = req.query;
    let agents = recommendationEngine.getAllAgents({
      filter: { language, category, taskDescription },
      sortBy: sortBy || 'name',
      order: order || 'asc',
    });
    const limitNum = parseInt(limit) || agents.length;
    const offsetNum = parseInt(offset) || 0;
    const paginatedAgents = agents.slice(offsetNum, offsetNum + limitNum);
    const response = {
      success: true,
      data: {
        agents: paginatedAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          version: agent.version,
          languages: agent.languages,
          strengths: agent.strengths,
          weaknesses: agent.weaknesses,
          best_use_cases: agent.best_use_cases,
          pricing: agent.pricing,
          performance_metrics: agent.performance_metrics,
          complexity_rating: agent.complexity_rating,
          setup_difficulty: agent.setup_difficulty,
          learning_curve: agent.learning_curve,
          features: agent.features
        })),
        pagination: {
          total: agents.length,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + limitNum < agents.length
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error in agents endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

exports.getAgentById = (req, res) => {
  try {
    const { id } = req.params;
    const agent = recommendationEngine.getAgentById(id);
    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        code: 'AGENT_NOT_FOUND'
      });
    }
    const response = {
      success: true,
      data: {
        agent: {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          version: agent.version,
          languages: agent.languages,
          ide_integration: agent.ide_integration,
          strengths: agent.strengths,
          weaknesses: agent.weaknesses,
          best_use_cases: agent.best_use_cases,
          pricing: agent.pricing,
          performance_metrics: agent.performance_metrics,
          features: agent.features,
          complexity_rating: agent.complexity_rating,
          setup_difficulty: agent.setup_difficulty,
          learning_curve: agent.learning_curve
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error in agent detail endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

exports.analyzeTask = (req, res) => {
  try {
    const { task_description } = req.body;
    if (!task_description || typeof task_description !== 'string') {
      return res.status(400).json({
        error: 'task_description is required and must be a string',
        code: 'MISSING_TASK_DESCRIPTION'
      });
    }
    const analysis = recommendationEngine.analyzeTask(task_description);
    const response = {
      success: true,
      data: {
        analysis: analysis,
        suggestions: {
          recommendedLanguages: analysis.languages,
          complexityLevel: analysis.complexity,
          projectTypes: analysis.projectType,
          teamSize: analysis.teamSize,
          budgetConsiderations: analysis.budget,
          timeline: analysis.timeline,
          collaborationNeeds: analysis.collaboration,
          idePreference: analysis.idePreference,
          security: analysis.security
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
    res.json(response);
  } catch (error) {
    console.error('Error in analyze endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
}; 