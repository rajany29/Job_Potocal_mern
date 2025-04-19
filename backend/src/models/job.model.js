const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
      trim: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      required: [true, 'Please specify job type']
    },
    category: {
      type: String,
      required: [true, 'Please provide job category'],
      trim: true
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
      required: [true, 'Please specify experience level']
    },
    salary: {
      type: String,
      trim: true
    },
    skills: {
      type: [String],
      required: [true, 'Please specify required skills']
    },
    applicationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open'
    },
    numberOfApplications: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for applications
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  justOne: false
});

module.exports = mongoose.model('Job', jobSchema); 