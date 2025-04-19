const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getJobs, 
  getJob, 
  updateJob, 
  deleteJob 
} = require('../controllers/job.controller');
const { getJobApplications } = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Get all jobs and create a new job
router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'admin'), createJob);

// Get, update and delete a job
router.route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob);

// Get all applications for a job
router.route('/:jobId/applications')
  .get(protect, authorize('employer', 'admin'), getJobApplications);

module.exports = router; 