import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Business,
  Work,
  Timer,
  Category,
  Star,
  Schedule,
  AttachMoney,
  Description
} from '@mui/icons-material';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, isJobSeeker, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobById(id);
        setJob(response.data.data);
        
        // Check if user has already applied for this job
        if (isAuthenticated && isJobSeeker) {
          try {
            const applicationsResponse = await applicationService.getMyApplications();
            const applications = applicationsResponse.data.data;
            
            // Check if user has already applied to this job
            const hasAppliedToJob = applications.some(application => 
              application.job._id === id
            );
            
            setHasApplied(hasAppliedToJob);
          } catch (err) {
            console.error('Error checking application status:', err);
          }
        }
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, isAuthenticated, isJobSeeker]);

  const handleApply = async () => {
    try {
      setApplying(true);
      await applicationService.applyForJob({
        job: id,
        coverLetter: 'I am interested in this position and would like to apply.'
      });
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to apply for this job. Please try again.';
      toast.error(message);
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Failed to load job details. Please try again later.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {job.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Business sx={{ mr: 1 }} /> {job.company}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1 }} /> {job.location}
            </Typography>
          </Box>
          
          {isAuthenticated && isJobSeeker && (
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleApply}
                disabled={hasApplied || applying || job.status === 'Closed'}
                sx={{ fontWeight: 'bold', py: 1.5, px: 4 }}
              >
                {applying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
              </Button>
              {hasApplied && (
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}>
                  You have already applied for this job
                </Typography>
              )}
              {job.status === 'Closed' && (
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'error.main' }}>
                  This job is no longer accepting applications
                </Typography>
              )}
            </Box>
          )}
          
          {!isAuthenticated && (
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 'bold', py: 1.5, px: 4 }}
              >
                Login to Apply
              </Button>
            </Box>
          )}
          
          {isAuthenticated && !isJobSeeker && (
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Typography variant="body2" color="text.secondary">
                Only job seekers can apply for jobs
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip 
            icon={<Work />} 
            label={job.jobType} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<Star />} 
            label={job.experienceLevel} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            icon={<Category />} 
            label={job.category} 
            variant="outlined" 
          />
          {job.salary && (
            <Chip 
              icon={<AttachMoney />} 
              label={job.salary} 
              color="success" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Job Description
        </Typography>
        <Typography variant="body1" paragraph>
          {job.description}
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
          Required Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {job.skills.map((skill, index) => (
            <Chip key={index} label={skill} />
          ))}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Card sx={{ mb: 2, width: { xs: '100%', md: '48%' } }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Job Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Work fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Job Type" 
                    secondary={job.jobType} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experience Level" 
                    secondary={job.experienceLevel} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Category fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Category" 
                    secondary={job.category} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Salary" 
                    secondary={job.salary || 'Not specified'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Card sx={{ mb: 2, width: { xs: '100%', md: '48%' } }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                Company and Timeline
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Business fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Company" 
                    secondary={job.company} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location" 
                    secondary={job.location} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timer fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Posted Date" 
                    secondary={formatDate(job.createdAt)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Application Deadline" 
                    secondary={formatDate(job.applicationDeadline)} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      
      {isAuthenticated && isJobSeeker && !hasApplied && job.status !== 'Closed' && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleApply}
            disabled={applying}
            sx={{ fontWeight: 'bold', py: 1.5, px: 8 }}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default JobDetails; 