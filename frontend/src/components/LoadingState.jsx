import React, { useEffect, useState } from 'react';
import { Globe, Brain, FileCheck, Loader2 } from 'lucide-react';

const STEPS = [
  { icon: Globe, label: 'Dispatching Tavily Web Search queries...', duration: 1500 },
  { icon: Brain, label: 'Analyzing search results & facts with Groq Llama-3.1...', duration: 2000 },
  { icon: FileCheck, label: 'Formulating 5 key findings & structured conclusion...', duration: 1500 }
];

export default function LoadingState({ topic }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 1800);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', margin: '1.5rem 0' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
        marginBottom: '1.25rem'
      }}>
        <Loader2 size={32} color="#818cf8" style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
        Researching: <span className="gradient-text">"{topic}"</span>
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        The autonomous agent is searching web sources and generating structured insights.
      </p>

      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {STEPS.map((step, idx) => {
          const IconComponent = step.icon;
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                color: isDone ? '#34d399' : isActive ? '#818cf8' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <IconComponent size={20} />
              </div>
              <span style={{
                fontSize: '0.875rem',
                color: isDone ? '#cbd5e1' : isActive ? '#f8fafc' : 'var(--text-dim)',
                fontWeight: isActive ? '600' : '400',
                flex: 1,
                textAlign: 'left'
              }}>
                {step.label}
              </span>
              {isDone && <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: '600' }}>✓ Done</span>}
              {isActive && <span className="spinner" style={{ width: '14px', height: '14px' }}></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
