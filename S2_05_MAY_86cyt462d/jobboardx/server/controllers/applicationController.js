const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Job Seeker - Apply to a Job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, resumeLink, coverLetter } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeLink,
      coverLetter
    });

    // Notify employer
    const job = await Job.findById(jobId).populate('createdBy');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const employerEmail = job.createdBy.email;

    try {
      await sendEmail({
        to: employerEmail,
        subject: `New Applicant for ${job.title}`,
        text: `
Hello ${job.createdBy.name},

You have received a new application for your job post: ${job.title}.

Applicant Details:
- Name: ${req.user.name}
- Email: ${req.user.email}
- Resume: ${resumeLink}
- Cover Letter: ${coverLetter || 'No cover letter provided.'}

Please log into JobBoardX to review this application.

- JobBoardX Team
`
      });
    } catch (emailError) {
      console.error('❌ Email send failed:', emailError.message);
    }

    return res.status(201).json(application);

  } catch (err) {
    console.error('❌ Application submission failed:', err);
    return res.status(500).json({ error: 'Failed to apply to job' });
  }
};


// Seeker - View My Applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('job');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your applications' });
  }
};

// Employer - View Applicants for a Job
exports.getApplicantsByJobId = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate('applicant', 'name email')
    .populate('job', 'title');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants for this job' });
  }
};
//  Withdraw Application
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    //  Allow only owner to withdraw
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to withdraw this application.' });
    }

    await application.deleteOne();

    res.json({ message: 'Application withdrawn successfully.' });
  } catch (err) {
    console.error('❌ Failed to withdraw application:', err);
    res.status(500).json({ error: 'Server error while withdrawing application' });
  }
};
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Under Review', 'Shortlisted', 'Rejected', 'Hired'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update application status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getAllApplicantsForEmployer = async (req, res) => {
  try {
    const employerId = req.user._id;
    console.log('👤 Employer ID:', employerId);

    const jobs = await Job.find({ createdBy: employerId });
    console.log('📄 Jobs found:', jobs.length);

    const jobIds = jobs.map(job => job._id);
    console.log('🆔 Job IDs:', jobIds);

    const applications = await Application.find({ job: { $in: jobIds } })
    .populate('applicant', 'profile.fullName profile.email profile.resumeLink')
    .populate('job', 'title');
  

    console.log('📥 Applications:', applications.length);

    const formatted = applications.map(app => ({
      _id: app._id,
      fullName: app.applicant?.profile?.fullName || 'N/A',
      email: app.applicant?.profile?.email || 'N/A',
      resumeLink: app.resumeLink,
      coverLetter: app.coverLetter,
      jobTitle: app.job?.title || 'N/A',
      jobId: app.job?._id,
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching applicants:', err);
    res.status(500).json({ error: 'Failed to fetch applicants for employer' });
  }
};

