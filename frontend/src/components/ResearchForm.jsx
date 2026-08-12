import React, { useState } from 'react';
import { Search, Sparkles, Compass } from 'lucide-react';

const PRESET_TOPICS = [
  'Artificial Intelligence in Healthcare 2026',
  'Quantum Computing Innovations',
  'Autonomous Vehicle Tech & Safety',
  'Future of Renewable Energy Storage',
  'Impact of Large Language Models'
];

export default function ResearchForm({ onStartResearch, isLoading }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onStartResearch(topic.trim());
    }
  };

  const handleChipClick = (presetTopic) => {
    setTopic(presetTopic);
    if (!isLoading) {
      onStartResearch(presetTopic);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontWeight: '600' }}>
        Initiate Autonomous Research
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
        Enter any topic or question. The AI agent will execute web searches, analyze findings, and compile a structured report.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: '1', minWidth: '280px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Latest breakthroughs in Solid State Battery technology..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
            <Search className="input-icon" size={20} />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading || !topic.trim()}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Researching...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Start Research</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Compass size={14} /> Suggestions:
        </span>
        {PRESET_TOPICS.map((preset, index) => (
          <button
            key={index}
            type="button"
            className="chip"
            onClick={() => handleChipClick(preset)}
            disabled={isLoading}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
