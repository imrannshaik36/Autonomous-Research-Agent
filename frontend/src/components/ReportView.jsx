import React, { useState } from 'react';
import { CheckCircle2, Copy, Download, Search, Lightbulb, FileText, AlertTriangle } from 'lucide-react';

export default function ReportView({ report }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const { title, topic, keyFindings = [], conclusion, searchQueriesUsed = [], createdAt, note } = report;

  const handleCopy = () => {
    const textContent = `
TITLE: ${title}
TOPIC: ${topic}
DATE: ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}

KEY FINDINGS:
${keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

CONCLUSION:
${conclusion}

SEARCH QUERIES USED:
${searchQueriesUsed.map((sq) => typeof sq === 'string' ? sq : `${sq.query} (Source: ${sq.source})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const textContent = `AUTONOMOUS AI RESEARCH REPORT
==================================================
TITLE: ${title}
TOPIC: ${topic}
DATE: ${createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}

KEY FINDINGS:
${keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n\n')}

CONCLUSION:
${conclusion}

SEARCH QUERIES USED:
${searchQueriesUsed.map((sq) => typeof sq === 'string' ? `- ${sq}` : `- ${sq.query} (Source: ${sq.source.toUpperCase()})`).join('\n')}
==================================================
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${(topic || 'research-report').toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
      {/* Top Banner Actions & Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-glow)', textTransform: 'uppercase', tracking: '0.05em', fontWeight: '600' }}>
            Research Topic
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginTop: '0.2rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Generated on {createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <CheckCircle2 size={16} color="#34d399" />
                <span style={{ color: '#34d399' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
          <button className="btn-secondary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Fallback Note Alert if present */}
      {note && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          color: '#fbbf24'
        }}>
          <AlertTriangle size={18} flexShrink={0} />
          <span>{note}</span>
        </div>
      )}

      {/* Key Findings Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Lightbulb size={20} color="#818cf8" />
          <span>Key Findings</span>
        </h3>
        <div className="findings-grid">
          {keyFindings.map((finding, idx) => (
            <div key={idx} className="finding-card">
              <span className="finding-num">{idx + 1}</span>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#e2e8f0' }}>
                {finding}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', marginBottom: '0.6rem' }}>
          <FileText size={18} />
          <span>Executive Conclusion</span>
        </h3>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#f1f5f9', fontStyle: 'italic' }}>
          "{conclusion}"
        </p>
      </div>

      {/* Search Queries Used */}
      {searchQueriesUsed.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={14} />
            <span>Search Queries Executed by Agent:</span>
          </h4>
          <div className="queries-flex">
            {searchQueriesUsed.map((sq, i) => {
              const query = typeof sq === 'string' ? sq : sq.query;
              const source = typeof sq === 'string' ? 'unknown' : sq.source;
              const sourceBadgeColor = source === 'tavily' ? '#ec4899' : '#06b6d4';
              const sourceBadgeBg = source === 'tavily' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(6, 182, 212, 0.15)';
              
              return (
                <span key={i} className="query-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔍 {query}
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: sourceBadgeBg,
                    color: sourceBadgeColor,
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {source}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
