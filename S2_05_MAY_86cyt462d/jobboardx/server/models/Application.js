const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeLink: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'], 
    default: 'Submitted',
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
