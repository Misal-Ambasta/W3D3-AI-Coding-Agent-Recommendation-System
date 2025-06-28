import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Users, 
  DollarSign, 
  Clock, 
  Shield, 
  Monitor,
  TrendingUp,
  Zap
} from 'lucide-react';
import type { TaskAnalysis as TaskAnalysisType } from '../types';

interface TaskAnalysisProps {
  analysis: TaskAnalysisType;
}

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'beginner': return 'text-green-400';
    case 'intermediate': return 'text-yellow-400';
    case 'advanced': return 'text-red-400';
    default: return 'text-text-secondary';
  }
};

const getTeamSizeIcon = (teamSize: string) => {
  switch (teamSize) {
    case 'solo': return <Users className="w-4 h-4" />;
    case 'small': return <Users className="w-4 h-4" />;
    case 'large': return <Users className="w-4 h-4" />;
    default: return <Users className="w-4 h-4" />;
  }
};

const getTimelineIcon = (timeline: string) => {
  switch (timeline) {
    case 'urgent': return <Zap className="w-4 h-4" />;
    case 'standard': return <Clock className="w-4 h-4" />;
    case 'long_term': return <TrendingUp className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export const TaskAnalysis: React.FC<TaskAnalysisProps> = ({ analysis }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Monitor className="w-5 h-5 text-accent-primary" />
        Task Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Programming Languages */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Code className="w-4 h-4" />
            Programming Languages
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.languages.map((lang) => (
              <span
                key={lang}
                className="score-badge score-good text-xs capitalize"
              >
                {lang.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Project Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <TrendingUp className="w-4 h-4" />
            Project Type
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.projectType.map((type) => (
              <span
                key={type}
                className="score-badge score-average text-xs capitalize"
              >
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Complexity Level */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <Zap className="w-4 h-4" />
            Complexity Level
          </div>
          <div className={`text-lg font-semibold capitalize ${getComplexityColor(analysis.complexity)}`}>
            {analysis.complexity}
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            {getTeamSizeIcon(analysis.teamSize)}
            Team Size
          </div>
          <div className="text-lg font-semibold text-text-primary capitalize">
            {analysis.teamSize}
          </div>
        </div>

        {/* Budget Considerations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <DollarSign className="w-4 h-4" />
            Budget
          </div>
          <div className="text-lg font-semibold text-text-primary capitalize">
            {analysis.budget === 'any' ? 'Flexible' : analysis.budget}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            {getTimelineIcon(analysis.timeline)}
            Timeline
          </div>
          <div className="text-lg font-semibold text-text-primary capitalize">
            {analysis.timeline.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 pt-4 border-t border-glass-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Additional Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {analysis.collaboration && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-text-secondary">Collaboration features recommended</span>
              </div>
            )}
            {analysis.idePreference && (
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span className="text-text-secondary">IDE preference detected: {analysis.idePreference}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {analysis.security && (
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-text-secondary">Security features recommended</span>
              </div>
            )}
            {analysis.timeline === 'urgent' && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-text-secondary">Fast response time prioritized</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Summary */}
      <div className="mt-6 p-4 bg-glass-secondary rounded-lg">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Recommendation Strategy</h3>
        <div className="text-sm text-text-secondary space-y-1">
          <p>Based on your task analysis, we recommend agents that excel in:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            {analysis.languages.length > 0 && (
              <li><strong>{analysis.languages.join(', ')}</strong> development</li>
            )}
            {analysis.projectType.length > 0 && (
              <li><strong>{analysis.projectType.join(', ')}</strong> projects</li>
            )}
            <li><strong>{analysis.complexity}</strong> level complexity</li>
            {analysis.teamSize !== 'solo' && (
              <li><strong>Team collaboration</strong> features</li>
            )}
            {analysis.security && (
              <li><strong>Security and compliance</strong> features</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}; 