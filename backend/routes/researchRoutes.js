const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const mongoose = require('mongoose');
const Report = require('../models/Report');

// In-memory fallback store for offline MongoDB mode
const inMemoryReports = [];

// Helper to check MongoDB connection status
const isMongoConnected = () => mongoose.connection.readyState === 1;

// POST /api/research - Start new research task
router.post('/research', async (req, res) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Research topic is required' });
  }

  const projectRoot = path.join(__dirname, '..', '..');
  const pythonPath = path.join(projectRoot, 'venv', 'bin', 'python');

  console.log(`[Backend] Triggering research for topic: "${topic}"`);

  const pyProcess = spawn(pythonPath, ['run_research.py', '--topic', topic], {
    cwd: projectRoot,
    env: { ...process.env }
  });

  let stdoutData = '';
  let stderrData = '';

  pyProcess.stdout.on('data', (chunk) => {
    stdoutData += chunk.toString();
  });

  pyProcess.stderr.on('data', (chunk) => {
    stderrData += chunk.toString();
  });

  pyProcess.on('close', async (code) => {
    console.log(`[Backend] Python process exited with code ${code}`);

    if (code !== 0 && !stdoutData.trim()) {
      console.error('[Backend] Python Stderr:', stderrData);
      return res.status(500).json({
        error: 'Failed to execute research agent',
        details: stderrData || 'Python process returned error code'
      });
    }

    try {
      const parsedReport = JSON.parse(stdoutData.trim());

      if (parsedReport.error) {
        return res.status(500).json({ error: parsedReport.error });
      }

      let savedReport;
      if (isMongoConnected()) {
        const newReport = new Report({
          topic: parsedReport.topic || topic,
          title: parsedReport.title || `Research: ${topic}`,
          keyFindings: parsedReport.keyFindings || [],
          conclusion: parsedReport.conclusion || '',
          searchQueriesUsed: parsedReport.searchQueriesUsed || [],
          note: parsedReport.note || null
        });
        savedReport = await newReport.save();
      } else {
        // Fallback store
        savedReport = {
          _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          topic: parsedReport.topic || topic,
          title: parsedReport.title || `Research: ${topic}`,
          keyFindings: parsedReport.keyFindings || [],
          conclusion: parsedReport.conclusion || '',
          searchQueriesUsed: parsedReport.searchQueriesUsed || [],
          note: parsedReport.note || null,
          createdAt: new Date().toISOString()
        };
        inMemoryReports.unshift(savedReport);
      }

      res.status(201).json(savedReport);
    } catch (parseError) {
      console.error('[Backend] Failed to parse stdout JSON:', stdoutData, parseError);
      res.status(500).json({
        error: 'Invalid response received from research agent',
        rawOutput: stdoutData
      });
    }
  });
});

// GET /api/reports - Fetch all research reports
router.get('/reports', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const reports = await Report.find().sort({ createdAt: -1 });
      return res.json(reports);
    } else {
      return res.json(inMemoryReports);
    }
  } catch (error) {
    console.error('[Backend] Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

// GET /api/reports/:id - Fetch single report
router.get('/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      const report = await Report.findById(id);
      if (!report) return res.status(404).json({ error: 'Report not found' });
      return res.json(report);
    } else {
      const report = inMemoryReports.find((r) => r._id === id);
      if (!report) return res.status(404).json({ error: 'Report not found' });
      return res.json(report);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching report' });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete('/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected()) {
      await Report.findByIdAndDelete(id);
      return res.json({ message: 'Report deleted successfully' });
    } else {
      const index = inMemoryReports.findIndex((r) => r._id === id);
      if (index !== -1) {
        inMemoryReports.splice(index, 1);
      }
      return res.json({ message: 'Report deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting report' });
  }
});

module.exports = router;
