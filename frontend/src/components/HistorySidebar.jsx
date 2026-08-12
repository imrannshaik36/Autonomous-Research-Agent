import React, { useState } from 'react';
import { History, Search, Trash2, ChevronRight, FileText } from 'lucide-react';

export default function HistorySidebar({ reports = [], selectedReportId, onSelectReport, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      (r.topic && r.topic.toLowerCase().includes(term)) ||
      (r.title && r.title.toLowerCase().includes(term))
    );
  });

  return (
    <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="#818cf8" />
          <span>Research History</span>
        </h3>
        <span style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '0.2rem 0.6rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
        </span>
      </div>

      {reports.length > 0 && (
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="input-field"
            style={{ padding: '0.5rem 0.8rem 0.5rem 2.4rem', fontSize: '0.85rem' }}
            placeholder="Search past reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="input-icon" size={14} style={{ left: '0.8rem' }} />
        </div>
      )}

      {filteredReports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
          <FileText size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.85rem' }}>
            {reports.length === 0 ? 'No research reports generated yet.' : 'No matching reports found.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredReports.map((report) => {
            const isSelected = selectedReportId === report._id;

            return (
              <div
                key={report._id}
                onClick={() => onSelectReport(report)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? '600' : '500',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    lineHeight: '1.3',
                    marginBottom: '0.3rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {report.title || report.topic}
                  </h4>
                  <button
                    className="btn-danger"
                    title="Delete report"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(report._id);
                    }}
                    style={{ padding: '0.2rem 0.4rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Just now'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: isSelected ? '#818cf8' : 'inherit' }}>
                    View <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
