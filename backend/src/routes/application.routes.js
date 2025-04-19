const express = require('express');
const router = express.Router();
const { 
  createApplication, 
  getMyApplications, 
  updateApplicationStatus 
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Create application and get user's applications
router.route('/')
  .post(protect, authorize('job-seeker'), createApplication);

// Get current user's applications
router.get('/me', protect, authorize('job-seeker'), getMyApplications);

// Update application status
router.put('/:id', protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router; 