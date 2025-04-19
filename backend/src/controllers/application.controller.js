const Application = require('../models/application.model');
const Job = require('../models/job.model');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private/JobSeeker
exports.createApplication = async (req, res) => {
  try {
    // Add applicant to req.body
    req.body.applicant = req.user.id;

    // Check if job exists
    const job = await Job.findById(req.body.job);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      job: req.body.job,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create(req.body);

    // Increment job application count
    job.numberOfApplications += 1;
    await job.save();

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications for a job
// @route   GET /api/jobs/:jobId/applications
// @access  Private/Employer
exports.getJobApplications = async (req, res) => {
  try {
    // Check if job exists and belongs to the employer
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view applications for this job`
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'applicant',
        select: 'name email skills experience location'
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications for current user
// @route   GET /api/applications/me
// @access  Private/JobSeeker
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location jobType status'
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employer
exports.updateApplicationStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Make sure user is employer of this job
    if (application.job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this application`
      });
    }

    // Update status
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 