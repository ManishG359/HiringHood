
const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  score: { type: Number, required: true },
});

const SurveyQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  responses: { type: [SurveyResponseSchema], default: [] },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral',
  },
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  questions: { type: [SurveyQuestionSchema], default: [] },
});

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  surveys: { type: [SurveySchema], default: [] },
});


module.exports = mongoose.model('Company', CompanySchema);