import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResearchForm from './components/ResearchForm';
import LoadingState from './components/LoadingState';
import ReportView from './components/ReportView';
import HistorySidebar from './components/HistorySidebar';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [activeTopic, setActiveTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mongoConnected, setMongoConnected] = useState(false);

  // Fetch server health & saved reports on mount
  useEffect(() => {
    fetchHealth();
    fetchReports();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setMongoConnected(data.mongoConnected);
    } catch (err) {
      console.warn('Backend health check failed:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0 && !currentReport) {
          setCurrentReport(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load research history:', err);
    }
  };

  const handleStartResearch = async (topic) => {
    setIsLoading(true);
    setActiveTopic(topic);
    setError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to generate research report');
      }

      setCurrentReport(data);
      setReports((prev) => [data, ...prev.filter((r) => r._id !== data._id)]);
    } catch (err) {
      console.error('Research error:', err);
      setError(err.message || 'An error occurred while running the research agent.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        if (currentReport && currentReport._id === id) {
          const remaining = reports.filter((r) => r._id !== id);
          setCurrentReport(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  return (
    <div className="app-container">
      <Header mongoConnected={mongoConnected} />

      <main className="main-content">
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <ResearchForm onStartResearch={handleStartResearch} isLoading={isLoading} />

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={20} flexShrink={0} />
                <span>{error}</span>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {isLoading && <LoadingState topic={activeTopic} />}

          {!isLoading && currentReport && <ReportView report={currentReport} />}

          {!isLoading && !currentReport && !error && (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                No Active Research Selected
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                Enter a topic above or pick a sample suggestion to trigger the AI agent.
              </p>
            </div>
          )}
        </section>

        <HistorySidebar
          reports={reports}
          selectedReportId={currentReport?._id}
          onSelectReport={(report) => setCurrentReport(report)}
          onDeleteReport={handleDeleteReport}
        />
      </main>
    </div>
  );
}
