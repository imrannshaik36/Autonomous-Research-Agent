const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  keyFindings: {
    type: [String],
    default: []
  },
  conclusion: {
    type: String,
    default: ''
  },
  searchQueriesUsed: {
    type: [{
      query: String,
      source: {
        type: String,
        enum: ['wiki', 'tavily'],
        required: true
      }
    }],
    default: []
  },
  note: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
