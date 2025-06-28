import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import type { Filters, Strategy } from '../types';

interface TaskInputProps {
  onSubmit: (taskDescription: string, filters: Filters, strategy: string) => void;
  isLoading: boolean;
}

const QUICK_PROJECTS = [
  { label: 'React Web App', value: 'Build a modern React web application with TypeScript and Tailwind CSS' },
  { label: 'Python API', value: 'Create a REST API using Python Flask or FastAPI with database integration' },
  { label: 'Mobile App', value: 'Develop a cross-platform mobile app using React Native or Flutter' },
  { label: 'Data Analysis', value: 'Perform data analysis and visualization using Python pandas and matplotlib' },
  { label: 'DevOps Setup', value: 'Set up CI/CD pipeline with Docker and Kubernetes for deployment' },
  { label: 'Game Development', value: 'Create a simple 2D game using Unity or a web-based game with JavaScript' },
];

const STRATEGIES: Strategy[] = [
  { id: 'best_overall', name: 'Best Overall', description: 'Balanced recommendation for most use cases' },
  { id: 'beginner_friendly', name: 'Beginner Friendly', description: 'Prioritizes ease of use and learning' },
  { id: 'enterprise_ready', name: 'Enterprise Ready', description: 'Focuses on security, collaboration, and scalability' },
  { id: 'budget_conscious', name: 'Budget Conscious', description: 'Prioritizes cost-effective solutions' },
];

export const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading }) => {
  const [taskDescription, setTaskDescription] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [strategy, setStrategy] = useState('best_overall');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleQuickSelect = (value: string) => {
    setTaskDescription(value);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskDescription.trim().length >= 10) {
      onSubmit(taskDescription.trim(), filters, strategy);
    }
  };

  const updateFilters = (key: keyof Filters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AI Coding Agent
          </motion.h1>
          <motion.p 
            className="text-xl text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Describe your coding task and get personalized recommendations for the best AI coding agents
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Description Input */}
          <div className="relative">
            <label htmlFor="task-description" className="block text-sm font-medium text-text-secondary mb-3">
              Describe your coding task
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                id="task-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="e.g., I need to build a React web application with user authentication, real-time chat features, and payment integration..."
                className="glass-input w-full min-h-[120px] resize-none pr-12"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3">
                <Sparkles className="w-5 h-5 text-accent-primary" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-text-tertiary">
                {taskDescription.length}/500 characters
              </span>
              <span className="text-xs text-text-tertiary">
                Minimum 10 characters required
              </span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Quick Select Common Projects
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUICK_PROJECTS.map((project, index) => (
                <motion.button
                  key={project.label}
                  type="button"
                  onClick={() => handleQuickSelect(project.value)}
                  className="glass-button-secondary text-sm py-2 px-3 text-left hover:bg-glass-secondary transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {project.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Strategy Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Recommendation Strategy
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STRATEGIES.map((strat) => (
                <motion.button
                  key={strat.id}
                  type="button"
                  onClick={() => setStrategy(strat.id)}
                  className={`glass-button-secondary text-sm py-3 px-4 text-center transition-all duration-200 ${
                    strategy === strat.id 
                      ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' 
                      : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{strat.name}</div>
                  <div className="text-xs text-text-tertiary mt-1">{strat.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-button-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {hasActiveFilters && (
                <span className="bg-accent-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-text-tertiary hover:text-text-secondary text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-4">Advanced Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Budget
                  </label>
                  <select
                    value={filters.budget || ''}
                    onChange={(e) => updateFilters('budget', e.target.value || undefined)}
                    className="glass-input w-full bg-glass-secondary text-white"
                  >
                    <option value="" className="bg-glass-secondary text-black">Any Budget</option>
                    <option value="free" className="bg-glass-secondary text-black">Free Only</option>
                    <option value="paid" className="bg-glass-secondary text-black">Paid Options</option>
                    <option value="enterprise" className="bg-glass-secondary text-black">Enterprise</option>
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel || ''}
                    onChange={(e) => updateFilters('experienceLevel', e.target.value || undefined)}
                    className="glass-input w-full bg-glass-secondary text-white"
                  >
                    <option value="" className="bg-glass-secondary text-black">Any Level</option>
                    <option value="beginner" className="bg-glass-secondary text-black">Beginner</option>
                    <option value="intermediate" className="bg-glass-secondary text-black">Intermediate</option>
                    <option value="advanced" className="bg-glass-secondary text-black">Advanced</option>
                  </select>
                </div>

                {/* Team Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Team Size
                  </label>
                  <select
                    value={filters.teamSize || ''}
                    onChange={(e) => updateFilters('teamSize', e.target.value || undefined)}
                    className="glass-input w-full bg-glass-secondary text-white"
                  >
                    <option value="" className="bg-glass-secondary text-black">Any Size</option>
                    <option value="solo" className="bg-glass-secondary text-black">Solo Developer</option>
                    <option value="small" className="bg-glass-secondary text-black">Small Team (2-5)</option>
                    <option value="large" className="bg-glass-secondary text-black">Large Team (6+)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
              disabled={taskDescription.trim().length < 10 || isLoading}
              className="glass-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Task...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Get Recommendations
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}; 