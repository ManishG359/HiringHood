const mongoose = require('mongoose');

const hiringTimelineSchema = new mongoose.Schema({
  candidates: Number,
  dailyCapacity: Number,
  parallelTracks: Number,
  startDate: String,
  excludeWeekends: Boolean,
  holidays: [String],
  calculatedDays: Number,
  calculatedDates: [String],
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  role: { type: String, required: true }, 
  description: { type: String, required: true },
  salary: { type: String }, // optional
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hiringTimeline: hiringTimelineSchema 
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

