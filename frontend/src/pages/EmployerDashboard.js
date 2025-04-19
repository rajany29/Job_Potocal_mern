import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Badge,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  LocationOn,
  Business,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { jobService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getAllJobs();
        // Filter only jobs posted by the current employer
        const employerJobs = response.data.data.filter(
          job => job.employer._id === user._id
        );
        setJobs(employerJobs);
        setError(null);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user._id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter jobs based on tab
  const filteredJobs = jobs.filter(job => {
    if (tabValue === 0) return true; // All jobs
    if (tabValue === 1) return job.status === 'Open';
    if (tabValue === 2) return job.status === 'Closed';
    if (tabValue === 3) return job.status === 'Draft';
    return true;
  });
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate statistics
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(job => job.status === 'Open').length;
  const closedJobs = jobs.filter(job => job.status === 'Closed').length;
  const totalApplications = jobs.reduce((total, job) => total + job.numberOfApplications, 0);
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Employer Dashboard
        </Typography>
        <Button
          component={RouterLink}
          to="/employer/post-job"
          variant="contained"
          startIcon={<Add />}
          sx={{ fontWeight: 'bold', mt: { xs: 2, sm: 0 } }}
        >
          Post New Job
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalJobs}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Jobs Posted
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {openJobs}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Active Jobs
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {closedJobs}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Closed Jobs
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {totalApplications}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Applications
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Jobs List */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight="bold">
            Manage Job Listings
          </Typography>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`All Jobs (${totalJobs})`} />
          <Tab label={`Active (${openJobs})`} />
          <Tab label={`Closed (${closedJobs})`} />
          <Tab label="Drafts" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              No jobs found in this category.
            </Typography>
            <Button
              component={RouterLink}
              to="/employer/post-job"
              variant="contained"
              startIcon={<Add />}
            >
              Post a New Job
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Posted Date</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                          {job.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={job.status} 
                        color={
                          job.status === 'Open' ? 'success' :
                          job.status === 'Closed' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={job.numberOfApplications} color="primary" showZero>
                        <Person color="action" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Job">
                        <IconButton 
                          component={RouterLink} 
                          to={`/jobs/${job._id}`}
                          size="small"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Job">
                        <IconButton 
                          component={RouterLink} 
                          to={`/employer/edit-job/${job._id}`}
                          size="small" 
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Recent Activity (placeholder) */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recent Activity
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemText 
              primary="Your job 'Senior Software Engineer' received 3 new applications"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} /> Today
              </Box>}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="You posted a new job 'UX Designer'"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} /> Yesterday
              </Box>}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="You closed the job 'Marketing Specialist'"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday fontSize="small" sx={{ mr: 0.5 }} /> 3 days ago
              </Box>}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default EmployerDashboard; 