import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

const getScoreClass = (score: number) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  return 'score-poor';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Poor';
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { agent, score, scoreBreakdown, reasoning } = recommendation;

  // Handle both old 'scores' and new 'scoreBreakdown' from API
  const scores = scoreBreakdown || recommendation.scores || {};

  const formatPrice = (pricing: any) => {
    if (pricing.free_tier) {
      return 'Free tier available';
    }
    if (pricing.individual) {
      return `$${pricing.individual}/month`;
    }
    if (pricing.business) {
      return `$${pricing.business}/month`;
    }
    return 'Contact for pricing';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className="glass-card-hover p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg text-white font-bold text-lg">
            {rank}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{agent.name}</h3>
            <p className="text-sm text-text-secondary">{agent.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-text-tertiary">v{agent.version}</span>
              <span className="text-xs text-text-tertiary">•</span>
              <span className="text-xs text-text-tertiary">{formatPrice(agent.pricing)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">{Math.round(score)}%</div>
          <div className="text-sm text-text-secondary">Overall Score</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className={`score-badge ${getScoreClass(value as number)} mb-1`}>
              {Math.round(value as number)}%
            </div>
            <div className="text-xs text-text-tertiary capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <span className="text-text-secondary">Complexity:</span>
          <span className="ml-1 text-text-primary capitalize">{agent.complexity_rating?.replace('_', ' ') || 'N/A'}</span>
        </div>
        <div>
          <span className="text-text-secondary">Setup:</span>
          <span className="ml-1 text-text-primary capitalize">{agent.setup_difficulty || 'N/A'}</span>
        </div>
        <div>
          <span className="text-text-secondary">Learning:</span>
          <span className="ml-1 text-text-primary capitalize">{agent.learning_curve || 'N/A'}</span>
        </div>
        <div>
          <span className="text-text-secondary">Context:</span>
          <span className="ml-1 text-text-primary">{agent.features?.context_window?.toLocaleString() || 'N/A'} tokens</span>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200 py-2"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Details
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-glass-border space-y-4"
        >
          {/* Reasoning */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-accent-primary" />
              Why This Agent?
            </h4>
            <div className="space-y-2">
              {reasoning.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary">{reason}</span>
                </div>
              ))}
              {reasoning.warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary">{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-green-400" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {reasoning.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Limitations
              </h4>
              <ul className="space-y-1">
                {reasoning.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Language Proficiency */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Language Proficiency</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(agent.languages || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([lang, proficiency]) => (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary capitalize">{lang.replace('_', ' ')}</span>
                    <span className={`score-badge ${getScoreClass(proficiency)}`}>
                      {proficiency}%
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* IDE Integration */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">IDE Integration</h4>
            <div className="flex flex-wrap gap-2">
              {(agent.ide_integration || []).map((ide) => (
                <span key={ide} className="score-badge score-good text-xs">
                  {ide.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Response Time:</span>
                <div className="text-text-primary">{agent.performance_metrics?.response_time_ms || 'N/A'}ms</div>
              </div>
              <div>
                <span className="text-text-secondary">Accuracy:</span>
                <div className="text-text-primary">{agent.performance_metrics?.accuracy_score || 'N/A'}%</div>
              </div>
              <div>
                <span className="text-text-secondary">Code Quality:</span>
                <div className="text-text-primary">{agent.performance_metrics?.code_quality_score || 'N/A'}%</div>
              </div>
              <div>
                <span className="text-text-secondary">User Satisfaction:</span>
                <div className="text-text-primary">{agent.performance_metrics?.user_satisfaction || 'N/A'}/5</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 