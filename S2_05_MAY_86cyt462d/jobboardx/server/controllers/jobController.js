const Job = require('../models/Job');
const moment = require('moment');

exports.createJob = async (req, res) => {
  try {
    const { title, company, location, role, description, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      role,
      description,
      salary,
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('❌ Job creation failed:', err);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
};


exports.getAllJobs = async (req, res) => {
    try {
      const { search, location, role, minSalary, maxSalary, page = 1, limit = 10 } = req.query;
  
      const query = {};
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }
  
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
  
      if (role) {
        query.role = { $regex: role, $options: 'i' };
      }
  
     
      if (minSalary || maxSalary) {
        query.salary = { $exists: true };
  
  
        if (minSalary) {
          query.salary.$regex = new RegExp(`\\$${minSalary}`, 'i');
        }
      }
  
      const total = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      if (jobs.length === 0) {
        return res.status(200).json({
          message: 'No jobs found matching your filters.',
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
          jobs: []
        });
      }
  
      res.json({
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        jobs
      });
    } catch (err) {
      console.error('❌ Advanced job search failed:', err);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  };
  

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

exports.getMyJobs = async (req, res) => {
  

  try {

    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (err) {
    console.error('❌ getMyJobs Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch your posted jobs' });
  }
};

const calculateHiringTimeline = require('../utils/calculateHiringTimeline');
const Application = require('../models/Application'); 

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      role,
      description,
      salary,
    } = req.body;

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.role = role || job.role;
    job.description = description || job.description;
    job.salary = salary || job.salary;

    await job.save();
    return res.status(200).json(job);
  } catch (err) {
    console.error('❌ Failed to update job:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!job) return res.status(403).json({ error: 'Not authorized or job not found' });

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
exports.getJobTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job || !job.hiringTimeline) {
      return res.status(404).json({ error: 'Timeline not found for this job' });
    }

    return res.status(200).json(job.hiringTimeline);
  } catch (err) {
    console.error('❌ Failed to fetch hiring timeline:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.recalculateTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job || !job.hiringTimeline) {
      return res.status(404).json({ error: 'No existing timeline to recalculate' });
    }

    const { minDays, scheduleDates } = calculateHiringTimeline(job.hiringTimeline);

    job.hiringTimeline.calculatedDays = minDays;
    job.hiringTimeline.calculatedDates = scheduleDates;
    job.hiringTimeline.updatedAt = new Date();

    await job.save();

    return res.status(200).json({
      message: 'Timeline recalculated successfully',
      hiringTimeline: job.hiringTimeline
    });
  } catch (err) {
    console.error('❌ Recalculation error:', err);
    res.status(500).json({ error: 'Failed to recalculate timeline' });
  }
};

