import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CircularProgress,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
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
const statusOptions = ['Open', 'Closed', 'Draft'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm();
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetchLoading(true);
        const response = await jobService.getJobById(id);
        const job = response.data.data;
        
        // Set skills
        setSkills(job.skills || []);
        
        // Reset form with job data
        reset({
          title: job.title,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          category: job.category,
          salary: job.salary,
          location: job.location,
          description: job.description,
          applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
          status: job.status
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchJob();
  }, [id, reset]);
  
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
      
      await jobService.updateJob(id, jobData);
      toast.success('Job updated successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update job. Please try again.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        setLoading(true);
        await jobService.deleteJob(id);
        toast.success('Job deleted successfully!');
        navigate('/employer/dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete job. Please try again.';
        toast.error(message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Edit Job
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Job
          </Button>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
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
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <Select
                      labelId="status-label"
                      label="Status"
                      {...field}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && (
                  <FormHelperText>{errors.status.message}</FormHelperText>
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
            
            <Grid item xs={12} sm={6}>
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Edit />}
                disabled={loading}
                sx={{ py: 1.5, px: 4 }}
              >
                {loading ? 'Updating Job...' : 'Update Job'}
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

export default EditJob; 