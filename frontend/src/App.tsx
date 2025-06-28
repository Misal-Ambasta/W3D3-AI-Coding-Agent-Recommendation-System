import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskInput } from './components/TaskInput';
import { TaskAnalysis } from './components/TaskAnalysis';
import { RecommendationCard } from './components/RecommendationCard';
import { apiService } from './services/api';
import type { Recommendation, Filters, TaskAnalysis as TaskAnalysisType, Agent, AgentSortBy, AgentSortOrder } from './types';

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [taskAnalysis, setTaskAnalysis] = useState<TaskAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResults, setHasResults] = useState(false);
  const [alternatives, setAlternatives] = useState<Recommendation[]>([]);
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [agentSortBy, setAgentSortBy] = useState<AgentSortBy>('name');
  const [agentSortOrder, setAgentSortOrder] = useState<AgentSortOrder>('asc');
  const [agentFilter, setAgentFilter] = useState<{ language?: string; category?: string }>({});

  const handleSubmit = async (taskDescription: string, filters: Filters, strategy: string) => {
    setIsLoading(true);
    setError(null);
    setHasResults(false);

    try {
      console.log('Submitting task:', taskDescription);
      const response = await apiService.getRecommendations(taskDescription, filters, strategy);
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('Setting recommendations:', response.data.recommendations);
        console.log('Setting alternatives:', response.data.alternatives);
        setRecommendations(response.data.recommendations);
        setAlternatives(response.data.alternatives);
        setTaskAnalysis(response.data.taskAnalysis);
        setHasResults(true);
      } else {
        setError('Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations([]);
    setAlternatives([]);
    setTaskAnalysis(null);
    setError(null);
    setHasResults(false);
    setShowAllAgents(false);
    setAllAgents([]);
  };

  const fetchAllAgents = async () => {
    try {
      const res = await apiService.getAgents(
        undefined,
        undefined,
        agentFilter.category,
        agentFilter.language,
        agentSortBy,
        agentSortOrder
      );
      if (res.success) setAllAgents(res.data.agents);
    } catch (err) {
      // ignore for now
    }
  };

  useEffect(() => {
    if (showAllAgents) fetchAllAgents();
    // eslint-disable-next-line
  }, [showAllAgents, agentSortBy, agentSortOrder, agentFilter]);

  return (
    <div className="min-h-screen bg-background-primary relative overflow-x-hidden">
      {/* Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {!hasResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskInput onSubmit={handleSubmit} isLoading={isLoading} />
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 glass-card p-4 border-l-4 border-red-400"
                >
                  <div className="text-red-400 font-medium">Error</div>
                  <div className="text-text-secondary text-sm mt-1">{error}</div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header with Reset Button */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold gradient-text">
                  Your Recommendations
                </h1>
                <button
                  onClick={handleReset}
                  className="glass-button-secondary"
                >
                  New Search
                </button>
              </div>

              {/* Task Analysis */}
              {taskAnalysis && (
                <TaskAnalysis analysis={taskAnalysis} />
              )}

              {/* Recommendations */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Top 3 AI Coding Agents
                </h2>
                
                <div className="grid gap-6">
                  {recommendations.map((recommendation, index) => (
                    <RecommendationCard
                      key={recommendation.agent.id}
                      recommendation={recommendation}
                      rank={index + 1}
                    />
                  ))}
                </div>

                {/* Alternatives Section */}
                {alternatives.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Other Options</h3>
                    <div className="grid gap-4">
                      {alternatives.map((alt, idx) => (
                        <RecommendationCard
                          key={alt.agent.id}
                          recommendation={alt}
                          rank={idx + 4}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Agents Section */}
                <div className="mt-10">
                  <button
                    className="glass-button-secondary mb-4"
                    onClick={() => setShowAllAgents((v) => !v)}
                  >
                    {showAllAgents ? 'Hide All Agents' : 'View All Agents'}
                  </button>
                  {showAllAgents && (
                    <div className="glass-card p-6">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <select
                          className="glass-input"
                          value={agentSortBy}
                          onChange={e => setAgentSortBy(e.target.value as AgentSortBy)}
                        >
                          <option value="name">Sort by Name</option>
                          <option value="score">Sort by Score (if task given)</option>
                        </select>
                        <select
                          className="glass-input"
                          value={agentSortOrder}
                          onChange={e => setAgentSortOrder(e.target.value as AgentSortOrder)}
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                        <input
                          className="glass-input"
                          placeholder="Filter by Language"
                          value={agentFilter.language || ''}
                          onChange={e => setAgentFilter(f => ({ ...f, language: e.target.value }))}
                        />
                        <input
                          className="glass-input"
                          placeholder="Filter by Category"
                          value={agentFilter.category || ''}
                          onChange={e => setAgentFilter(f => ({ ...f, category: e.target.value }))}
                        />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-text-secondary border-b border-glass-border">
                              <th className="py-2 px-4 text-left">Name</th>
                              <th className="py-2 px-4 text-left">Description</th>
                              <th className="py-2 px-4 text-left">Languages</th>
                              <th className="py-2 px-4 text-left">Best Use Cases</th>
                              <th className="py-2 px-4 text-left">Pricing</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allAgents.map(agent => (
                              <tr key={agent.id} className="border-b border-glass-border hover:bg-glass-secondary">
                                <td className="py-2 px-4 font-semibold text-text-primary">{agent.name}</td>
                                <td className="py-2 px-4 text-text-secondary">{agent.description}</td>
                                <td className="py-2 px-4">
                                  {Object.entries(agent.languages)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3)
                                    .map(([lang, score]) => (
                                      <span key={lang} className="score-badge score-good mr-1">
                                        {lang}: {score}%
                                      </span>
                                    ))}
                                </td>
                                <td className="py-2 px-4 text-xs text-text-tertiary">
                                  {agent.best_use_cases.slice(0, 2).join(', ')}
                                </td>
                                <td className="py-2 px-4 text-xs text-text-tertiary">
                                  {agent.pricing.free_tier ? 'Free' : `$${agent.pricing.individual || agent.pricing.pro || agent.pricing.starter || '?'} /mo`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Recommendation Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Best Match:</span>
                      <div className="text-text-primary font-medium">
                        {recommendations[0]?.agent.name} ({Math.round(recommendations[0]?.score || 0)}%)
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Average Score:</span>
                      <div className="text-text-primary font-medium">
                        {Math.round(recommendations.reduce((acc, rec) => acc + rec.score, 0) / recommendations.length)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-text-secondary">Agents Considered:</span>
                      <div className="text-text-primary font-medium">8 total agents</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-glass-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-tertiary text-sm">
            AI Coding Agent Recommendation System • Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
