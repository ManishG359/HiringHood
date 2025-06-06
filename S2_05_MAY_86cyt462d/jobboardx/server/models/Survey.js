const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    responses: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  });
  

const surveySchema = new mongoose.Schema({
  title: String,
  isActive: Boolean,
  questions: [
    {
      question: String,
      responses: [
        {
          employeeId: String,
          score: Number,
        },
      ],
      sentiment: String,
    },
  ],
  accessRecords: [
    {
      email: String,
      accessCount: { type: Number, default: 0 }, 
    },
  ],
  tokens: [tokenSchema],
});

module.exports = mongoose.model('Survey', surveySchema);