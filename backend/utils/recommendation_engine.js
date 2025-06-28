const natural = require('natural');
const nlp = require('compromise');

class RecommendationEngine {
  constructor(agentsData) {
    this.agents = agentsData.agents;
    this.metadata = agentsData.metadata;
    this.tokenizer = new natural.WordTokenizer();
    
    // Static language family mapping
    this.languageFamilies = {
      javascript: ['typescript'],
      typescript: ['javascript'],
      java: ['kotlin', 'scala'],
      kotlin: ['java', 'scala'],
      scala: ['java', 'kotlin'],
      python: ['r'],
      r: ['python'],
      c_sharp: ['cpp'],
      cpp: ['c_sharp'],
      html: ['css', 'javascript'],
      css: ['html', 'javascript'],
      go: [],
      rust: [],
      php: [],
      ruby: [],
      swift: [],
    };

    // Task complexity keywords
    this.complexityKeywords = {
      beginner: ['simple', 'basic', 'learn', 'tutorial', 'first', 'start', 'beginner', 'student'],
      intermediate: ['medium', 'moderate', 'standard', 'typical', 'common'],
      advanced: ['complex', 'advanced', 'enterprise', 'large', 'scalable', 'optimization', 'performance'],
    };

    // Project type keywords
    this.projectTypes = {
      web_development: ['web', 'website', 'frontend', 'react', 'vue', 'angular', 'html', 'css'],
      api_development: ['api', 'backend', 'server', 'rest', 'graphql', 'microservices'],
      mobile_app: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter'],
      data_science: ['data', 'ml', 'ai', 'machine learning', 'analysis', 'pandas', 'numpy'],
      game_development: ['game', 'unity', 'unreal', 'gaming'],
      devops: ['devops', 'deployment', 'ci/cd', 'docker', 'kubernetes', 'aws'],
      desktop_app: ['desktop', 'application', 'gui', 'electron'],
    };
  }

  // Task Analysis
  analyzeTask(taskDescription) {
    const tokens = this.tokenizer.tokenize(taskDescription.toLowerCase());
    const doc = nlp(taskDescription.toLowerCase());
    
    const analysis = {
      languages: this.extractLanguages(taskDescription, tokens),
      complexity: this.assessComplexity(taskDescription, tokens),
      projectType: this.identifyProjectType(taskDescription, tokens),
      teamSize: this.estimateTeamSize(taskDescription),
      budget: this.extractBudgetConstraints(taskDescription),
      timeline: this.assessTimeline(taskDescription),
      collaboration: this.needsCollaboration(taskDescription),
      idePreference: this.extractIDEPreference(taskDescription),
      security: this.extractSecurityRequirements(taskDescription)
    };

    return analysis;
  }

  extractLanguages(description, tokens) {
    const languages = [];
    const languageKeywords = Object.keys(this.metadata.supported_languages);
    
    for (const lang of languageKeywords) {
      const patterns = [
        lang,
        lang.replace('_', ''),
        lang.replace('_', '.'),
        lang.toUpperCase(),
        lang.charAt(0).toUpperCase() + lang.slice(1)
      ];
      
      for (const pattern of patterns) {
        if (description.toLowerCase().includes(pattern.toLowerCase())) {
          languages.push(lang);
          break;
        }
      }
    }

    // Handle special cases
    if (description.toLowerCase().includes('js') || description.toLowerCase().includes('javascript')) {
      if (!languages.includes('javascript')) languages.push('javascript');
    }
    if (description.toLowerCase().includes('ts') || description.toLowerCase().includes('typescript')) {
      if (!languages.includes('typescript')) languages.push('typescript');
    }

    return languages.length > 0 ? languages : ['javascript']; // Default fallback
  }

  assessComplexity(description, tokens) {
    let complexity = 'intermediate'; // Default
    let maxScore = 0;

    for (const [level, keywords] of Object.entries(this.complexityKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (description.toLowerCase().includes(keyword)) {
          score += 1;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        complexity = level;
      }
    }

    return complexity;
  }

  identifyProjectType(description, tokens) {
    const types = [];
    for (const [type, keywords] of Object.entries(this.projectTypes)) {
      for (const keyword of keywords) {
        if (description.toLowerCase().includes(keyword)) {
          types.push(type);
          break;
        }
      }
    }
    return types.length > 0 ? types : ['web_development']; // Default
  }

  estimateTeamSize(description) {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('team') || lowerDesc.includes('collaboration') || lowerDesc.includes('enterprise')) {
      return 'large';
    } else if (lowerDesc.includes('pair') || lowerDesc.includes('small team')) {
      return 'small';
    }
    return 'solo';
  }

  extractBudgetConstraints(description) {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('free') || lowerDesc.includes('budget') || lowerDesc.includes('cost')) {
      return 'free';
    } else if (lowerDesc.includes('enterprise') || lowerDesc.includes('professional')) {
      return 'enterprise';
    }
    return 'any';
  }

  assessTimeline(description) {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('urgent') || lowerDesc.includes('quick') || lowerDesc.includes('fast')) {
      return 'urgent';
    } else if (lowerDesc.includes('long term') || lowerDesc.includes('ongoing')) {
      return 'long_term';
    }
    return 'standard';
  }

  needsCollaboration(description) {
    const lowerDesc = description.toLowerCase();
    return lowerDesc.includes('team') || lowerDesc.includes('collaboration') || lowerDesc.includes('pair');
  }

  extractIDEPreference(description) {
    const lowerDesc = description.toLowerCase();
    const ides = ['vscode', 'visual studio', 'intellij', 'pycharm', 'webstorm', 'sublime', 'vim', 'emacs'];
    for (const ide of ides) {
      if (lowerDesc.includes(ide)) {
        return ide;
      }
    }
    return null;
  }

  extractSecurityRequirements(description) {
    const lowerDesc = description.toLowerCase();
    return lowerDesc.includes('security') || lowerDesc.includes('secure') || lowerDesc.includes('enterprise');
  }

  // Scoring Functions
  calculateLanguageScore(agent, requiredLanguages) {
    if (requiredLanguages.length === 0) return 50; // Neutral score if no language specified
    let totalScore = 0;
    let maxPossibleScore = requiredLanguages.length * 100;
    for (const lang of requiredLanguages) {
      const proficiency = agent.languages[lang] || 0;
      if (proficiency >= 80) {
        totalScore += 100; // Exact match
      } else if (this.languageFamilies[lang]) {
        // Check for similar language family
        const family = this.languageFamilies[lang];
        const hasFamily = family.some(famLang => agent.languages[famLang] && agent.languages[famLang] >= 70);
        if (hasFamily) {
          totalScore += 70; // Similar language family
        } else if (proficiency >= 60) {
          totalScore += 70; // Good support
        } else if (proficiency >= 40) {
          totalScore += 40; // Basic support
        } else {
          totalScore += 10; // Poor support
        }
      } else if (proficiency >= 60) {
        totalScore += 70; // Good support
      } else if (proficiency >= 40) {
        totalScore += 40; // Basic support
      } else {
        totalScore += 10; // Poor support
      }
    }
    return (totalScore / maxPossibleScore) * 100;
  }

  calculateComplexityScore(agent, taskComplexity) {
    const complexityMap = {
      'beginner': ['beginner_to_intermediate', 'beginner_to_advanced'],
      'intermediate': ['beginner_to_intermediate', 'intermediate_to_advanced', 'beginner_to_advanced'],
      'advanced': ['intermediate_to_advanced', 'advanced', 'beginner_to_advanced']
    };

    const suitableComplexities = complexityMap[taskComplexity] || complexityMap['intermediate'];
    
    if (suitableComplexities.includes(agent.complexity_rating)) {
      return 100;
    } else if (taskComplexity === 'beginner' && agent.complexity_rating === 'intermediate_to_advanced') {
      return 60; // Might be too complex for beginners
    } else if (taskComplexity === 'advanced' && agent.complexity_rating === 'beginner_to_intermediate') {
      return 40; // Too simple for advanced tasks
    }
    
    return 30;
  }

  calculateUseCaseScore(agent, projectTypes) {
    if (projectTypes.length === 0) return 50;

    let totalScore = 0;
    let maxPossibleScore = projectTypes.length * 100;

    for (const projectType of projectTypes) {
      let bestMatch = 0;
      
      for (const useCase of agent.best_use_cases) {
        const useCaseLower = useCase.toLowerCase();
        
        if (useCaseLower.includes(projectType.replace('_', ' ')) || 
            useCaseLower.includes(projectType.split('_')[0])) {
          bestMatch = Math.max(bestMatch, 100); // Direct match
        } else if (this.isRelatedUseCase(useCaseLower, projectType)) {
          bestMatch = Math.max(bestMatch, 60); // Related use case
        } else {
          bestMatch = Math.max(bestMatch, 30); // Generic capability
        }
      }
      
      totalScore += bestMatch;
    }

    return (totalScore / maxPossibleScore) * 100;
  }

  isRelatedUseCase(useCase, projectType) {
    const relatedMap = {
      'web_development': ['frontend', 'backend', 'full-stack'],
      'api_development': ['backend', 'server', 'full-stack'],
      'mobile_app': ['mobile', 'app development'],
      'data_science': ['analysis', 'research'],
      'game_development': ['creative', 'multimedia'],
      'devops': ['deployment', 'infrastructure'],
      'desktop_app': ['application', 'software']
    };

    const relatedTerms = relatedMap[projectType] || [];
    return relatedTerms.some(term => useCase.includes(term));
  }

  calculateIntegrationScore(agent, idePreference, teamSize) {
    let score = 50; // Base score
    // IDE compatibility
    if (idePreference) {
      const ideLower = idePreference.toLowerCase();
      const hasIDE = agent.ide_integration.some(
        ide => ide.toLowerCase().includes(ideLower) || ideLower.includes(ide.toLowerCase())
      );
      if (hasIDE) score += 30;
    }
    // Team collaboration
    if (teamSize !== 'solo' && agent.features.collaboration) {
      score += 20;
    }
    // Setup difficulty vs team size
    if (teamSize === 'large' && agent.setup_difficulty === 'easy') {
      score += 10;
    } else if (teamSize === 'solo' && agent.setup_difficulty === 'hard') {
      score -= 10;
    }
    return Math.max(0, Math.min(100, score));
  }

  calculatePerformanceScore(agent) {
    const responseScore = Math.max(0, 100 - (agent.performance_metrics.response_time_ms / 10));
    const accuracyScore = agent.performance_metrics.accuracy_score;
    const qualityScore = agent.performance_metrics.code_quality_score;
    const satisfactionScore = agent.performance_metrics.user_satisfaction * 20;

    return (responseScore + accuracyScore + qualityScore + satisfactionScore) / 4;
  }

  // Main Recommendation Function
  getRecommendations(taskDescription, filters = {}, strategy = 'best_overall') {
    const taskAnalysis = this.analyzeTask(taskDescription);
    const recommendations = [];
    // Apply filters
    let filteredAgents = this.applyFilters(this.agents, filters);
    for (const agent of filteredAgents) {
      const scores = {
        language: this.calculateLanguageScore(agent, taskAnalysis.languages),
        complexity: this.calculateComplexityScore(agent, taskAnalysis.complexity),
        useCase: this.calculateUseCaseScore(agent, taskAnalysis.projectType),
        integration: this.calculateIntegrationScore(agent, taskAnalysis.idePreference, taskAnalysis.teamSize),
        performance: this.calculatePerformanceScore(agent),
      };
      // Apply strategy-specific weights
      const weights = this.getStrategyWeights(strategy);
      let finalScore = (
        scores.language * weights.language +
        scores.complexity * weights.complexity +
        scores.useCase * weights.useCase +
        scores.integration * weights.integration +
        scores.performance * weights.performance
      );
      // Collaboration bonus
      if (taskAnalysis.teamSize !== 'solo' && agent.features.collaboration) {
        finalScore *= 1.12; // +12% boost
      }
      const reasoning = this.generateReasoning(agent, scores, taskAnalysis);
      recommendations.push({
        agent: agent,
        score: Math.round(finalScore * 100) / 100,
        scores: scores,
        reasoning: reasoning,
        taskAnalysis: taskAnalysis,
      });
    }
    // Sort by score
    const sorted = recommendations.sort((a, b) => b.score - a.score);
    // Top 3 recommendations
    const top3 = sorted.slice(0, 3);
    // Up to 5 alternatives (excluding top 3)
    const alternatives = sorted.slice(3, 8);
    return {
      top: top3,
      alternatives: alternatives,
      all: sorted,
      taskAnalysis: top3[0]?.taskAnalysis || null,
    };
  }

  applyFilters(agents, filters) {
    let filtered = agents;

    if (filters.budget) {
      filtered = filtered.filter(agent => {
        if (filters.budget === 'free') {
          return agent.pricing.free_tier === true;
        } else if (filters.budget === 'paid') {
          return agent.pricing.free_tier === false;
        }
        return true;
      });
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(agent => {
        const level = filters.experienceLevel;
        if (level === 'beginner') {
          return agent.complexity_rating.includes('beginner');
        } else if (level === 'advanced') {
          return agent.complexity_rating.includes('advanced');
        }
        return true;
      });
    }

    if (filters.teamSize) {
      filtered = filtered.filter(agent => {
        if (filters.teamSize === 'large') {
          return agent.features.collaboration === true;
        }
        return true;
      });
    }

    return filtered;
  }

  getStrategyWeights(strategy) {
    const strategies = {
      'best_overall': {
        language: 0.3,
        complexity: 0.25,
        useCase: 0.2,
        integration: 0.15,
        performance: 0.1
      },
      'beginner_friendly': {
        language: 0.25,
        complexity: 0.35,
        useCase: 0.2,
        integration: 0.15,
        performance: 0.05
      },
      'enterprise_ready': {
        language: 0.25,
        complexity: 0.2,
        useCase: 0.2,
        integration: 0.25,
        performance: 0.1
      },
      'budget_conscious': {
        language: 0.3,
        complexity: 0.2,
        useCase: 0.2,
        integration: 0.1,
        performance: 0.2
      }
    };

    return strategies[strategy] || strategies['best_overall'];
  }

  generateReasoning(agent, scores, taskAnalysis) {
    const reasons = [];
    const warnings = [];

    // Language reasoning
    if (scores.language >= 80) {
      reasons.push(`Excellent support for ${taskAnalysis.languages.join(', ')}`);
    } else if (scores.language >= 60) {
      reasons.push(`Good support for ${taskAnalysis.languages.join(', ')}`);
    } else if (scores.language < 40) {
      warnings.push(`Limited support for ${taskAnalysis.languages.join(', ')}`);
    }

    // Complexity reasoning
    if (scores.complexity >= 80) {
      reasons.push(`Perfect complexity match for ${taskAnalysis.complexity} level tasks`);
    } else if (scores.complexity < 50) {
      warnings.push(`May be ${agent.complexity_rating.includes('advanced') ? 'too complex' : 'too simple'} for your needs`);
    }

    // Use case reasoning
    if (scores.useCase >= 80) {
      reasons.push(`Specifically designed for ${taskAnalysis.projectType.join(', ')} projects`);
    } else if (scores.useCase >= 60) {
      reasons.push(`Good for ${taskAnalysis.projectType.join(', ')} projects`);
    }

    // Integration reasoning
    if (taskAnalysis.idePreference && scores.integration >= 70) {
      reasons.push(`Works well with ${taskAnalysis.idePreference}`);
    }

    if (taskAnalysis.teamSize !== 'solo' && agent.features.collaboration) {
      reasons.push('Excellent collaboration features');
    }

    // Performance reasoning
    if (scores.performance >= 80) {
      reasons.push('High performance and reliability');
    }

    return {
      reasons: reasons,
      warnings: warnings,
      strengths: agent.strengths.slice(0, 3),
      weaknesses: agent.weaknesses.slice(0, 2)
    };
  }

  // Get all agents with optional filtering/sorting
  getAllAgents({ filter = {}, sortBy = 'name', order = 'asc' } = {}) {
    let agents = [...this.agents];
    // Filtering
    if (filter.language) {
      agents = agents.filter(agent => agent.languages[filter.language] && agent.languages[filter.language] >= 60);
    }
    if (filter.category) {
      agents = agents.filter(agent =>
        agent.best_use_cases.some(useCase => useCase.toLowerCase().includes(filter.category.toLowerCase()))
      );
    }
    // Sorting
    agents.sort((a, b) => {
      if (sortBy === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortBy === 'score' && filter.taskDescription) {
        // If sorting by score, use the recommendation engine
        const recs = this.getRecommendations(filter.taskDescription);
        const all = recs.all;
        const aScore = all.find(x => x.agent.id === a.id)?.score || 0;
        const bScore = all.find(x => x.agent.id === b.id)?.score || 0;
        return order === 'asc' ? aScore - bScore : bScore - aScore;
      }
      return 0;
    });
    return agents;
  }

  // Get specific agent
  getAgentById(agentId) {
    return this.agents.find(agent => agent.id === agentId);
  }
}

module.exports = RecommendationEngine; 