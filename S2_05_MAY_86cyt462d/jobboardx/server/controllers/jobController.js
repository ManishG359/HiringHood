const Job = require('../models/Job');

// Create Job 
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

// Get All Jobs
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
  
      // Handle salary range (if salary is stored as string like "$100,000")
      if (minSalary || maxSalary) {
        query.salary = { $exists: true };
  
        // NOTE: Ideally, salary should be stored as number. 
        // This regex fallback matches simple ranges like "$100,000 - $120,000".
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
  
// Get Single Job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};
// Get Jobs posted by Current Employer
exports.getMyJobs = async (req, res) => {
  

  try {

    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (err) {
    console.error('❌ getMyJobs Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch your posted jobs' });
  }
};

// Update Job (Employer Only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) return res.status(403).json({ error: 'Not authorized or job not found' });

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// Delete Job (Employer Only)
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
