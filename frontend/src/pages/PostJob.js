import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { Add, PostAdd } from '@mui/icons-material';
import { jobService } from '../services/api';
import { toast } from 'react-toastify';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
const categories = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Customer Service',
  'Engineering',
  'Design',
  'Administrative',
  'Manufacturing',
  'Retail',
  'Other'
];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };
  
  const onSubmit = async (data) => {
    if (skills.length === 0) {
      toast.error('Please add at least one required skill.');
      return;
    }
    
    try {
      setLoading(true);
      // Add skills to the data
      const jobData = { ...data, skills };
      
      await jobService.createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post job. Please try again.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Post a New Job
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete the form below to create a new job listing. Fields marked with * are required.
        </Typography>
        
        <Divider sx={{ mb: 4, mt: 2 }} />
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Basic Job Information */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Basic Job Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                {...register('title', {
                  required: 'Job title is required',
                  maxLength: {
                    value: 100,
                    message: 'Job title cannot exceed 100 characters'
                  }
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.jobType}>
                <InputLabel id="job-type-label">Job Type</InputLabel>
                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: 'Job type is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="job-type-label"
                      label="Job Type"
                      {...field}
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.jobType && (
                  <FormHelperText>{errors.jobType.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.experienceLevel}>
                <InputLabel id="experience-level-label">Experience Level</InputLabel>
                <Controller
                  name="experienceLevel"
                  control={control}
                  rules={{ required: 'Experience level is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="experience-level-label"
                      label="Experience Level"
                      {...field}
                    >
                      {experienceLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.experienceLevel && (
                  <FormHelperText>{errors.experienceLevel.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="category-label"
                      label="Category"
                      {...field}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary (Optional)"
                placeholder="e.g., $50,000 - $70,000 per year"
                {...register('salary')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                placeholder="e.g., New York, NY or Remote"
                {...register('location', {
                  required: 'Job location is required'
                })}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>
            
            {/* Required Skills */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Required Skills
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <TextField
                  label="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                  />
                ))}
                {skills.length === 0 && (
                  <Typography variant="body2" color="error">
                    Please add at least one required skill.
                  </Typography>
                )}
              </Box>
            </Grid>
            
            {/* Job Description */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Job Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Description"
                placeholder="Describe the job responsibilities, requirements, benefits, and any other relevant information."
                {...register('description', {
                  required: 'Job description is required',
                  minLength: {
                    value: 50,
                    message: 'Job description should be at least 50 characters'
                  }
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            
            {/* Application Deadline */}
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Application Deadline (Optional)
              </Typography>
              <TextField
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('applicationDeadline')}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PostAdd />}
                disabled={loading}
                sx={{ py: 1.5, px: 4 }}
              >
                {loading ? 'Posting Job...' : 'Post Job'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/employer/dashboard')}
                sx={{ py: 1.5, px: 4, ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostJob; 