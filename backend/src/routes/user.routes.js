const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  getEmployerById, 
  getJobSeekerById 
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// Update user profile
router.put('/profile', protect, updateProfile);

// Get employer by ID
router.get('/employers/:id', getEmployerById);

// Get job seeker by ID
router.get('/job-seekers/:id', getJobSeekerById);

module.exports = router; 