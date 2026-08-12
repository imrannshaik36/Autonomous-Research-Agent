import React from 'react';
import { Cpu, Sparkles, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ mongoConnected }) {
  return (
    <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }} className="gradient-text">
                Autonomous Research Agent
              </h1>
              <span className="pulse-badge">
                <span className="pulse-dot"></span>
                Agent Ready
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Powered by Groq Llama-3.1, Tavily Web Search &amp; MERN Stack Architecture
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            padding: '0.4rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <Database size={14} color={mongoConnected ? '#34d399' : '#fbbf24'} />
            <span>DB Status: {mongoConnected ? 'MongoDB Connected' : 'In-Memory Store'}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '0.4rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            color: '#a5b4fc'
          }}>
            <Sparkles size={14} />
            <span>MERN Enabled</span>
          </div>
        </div>
      </div>
    </header>
  );
}
