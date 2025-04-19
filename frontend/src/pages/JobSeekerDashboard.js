import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tab,
  Tabs,
  Divider,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
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
  Visibility,
  Work,
  Business,
  LocationOn,
  Search
} from '@mui/icons-material';
import { applicationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const JobSeekerDashboard = () => {
  const { user: _ } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await applicationService.getMyApplications();
        setApplications(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter applications based on tab
  const filteredApplications = applications.filter(application => {
    if (tabValue === 0) return true; // All applications
    if (tabValue === 1) return application.status === 'Pending';
    if (tabValue === 2) return ['Reviewed', 'Shortlisted'].includes(application.status);
    if (tabValue === 3) return application.status === 'Hired';
    if (tabValue === 4) return application.status === 'Rejected';
    return true;
  });
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const inProgressApplications = applications.filter(app => ['Reviewed', 'Shortlisted'].includes(app.status)).length;
  const successfulApplications = applications.filter(app => app.status === 'Hired').length;
  const rejectedApplications = applications.filter(app => app.status === 'Rejected').length;
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Job Seeker Dashboard
        </Typography>
        <Button
          component={RouterLink}
          to="/jobs"
          variant="contained"
          startIcon={<Search />}
          sx={{ fontWeight: 'bold', mt: { xs: 2, sm: 0 } }}
        >
          Search Jobs
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {totalApplications}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Applications
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {pendingApplications}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {successfulApplications}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hired
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {inProgressApplications}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Applications List */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight="bold">
            My Applications
          </Typography>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`All (${totalApplications})`} />
          <Tab label={`Pending (${pendingApplications})`} />
          <Tab label={`In Progress (${inProgressApplications})`} />
          <Tab label={`Hired (${successfulApplications})`} />
          <Tab label={`Rejected (${rejectedApplications})`} />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : filteredApplications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              No applications found in this category.
            </Typography>
            <Button
              component={RouterLink}
              to="/jobs"
              variant="contained"
              startIcon={<Search />}
            >
              Browse Jobs
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {application.job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                          {application.job.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business fontSize="small" sx={{ mr: 0.5 }} />
                        {application.job.company}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(application.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={application.status} 
                        color={
                          application.status === 'Hired' ? 'success' :
                          application.status === 'Rejected' ? 'error' :
                          application.status === 'Pending' ? 'default' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Job">
                        <IconButton 
                          component={RouterLink} 
                          to={`/jobs/${application.job._id}`}
                          size="small"
                        >
                          <Visibility fontSize="small" />
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
      
      {/* Recommended Jobs (placeholder) */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recommended Jobs
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemText 
              primary="Senior Software Engineer at Tech Solutions"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <Work fontSize="small" sx={{ mr: 0.5 }} /> Full-time
                <LocationOn fontSize="small" sx={{ ml: 2, mr: 0.5 }} /> San Francisco, CA
              </Box>}
            />
            <Button variant="outlined" size="small" component={RouterLink} to="/jobs">
              View
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Product Manager at InnovateCorp"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <Work fontSize="small" sx={{ mr: 0.5 }} /> Full-time
                <LocationOn fontSize="small" sx={{ ml: 2, mr: 0.5 }} /> Remote
              </Box>}
            />
            <Button variant="outlined" size="small" component={RouterLink} to="/jobs">
              View
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="UX Designer at Creative Studio"
              secondary={<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <Work fontSize="small" sx={{ mr: 0.5 }} /> Contract
                <LocationOn fontSize="small" sx={{ ml: 2, mr: 0.5 }} /> New York, NY
              </Box>}
            />
            <Button variant="outlined" size="small" component={RouterLink} to="/jobs">
              View
            </Button>
          </ListItem>
        </List>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button component={RouterLink} to="/jobs" variant="contained">
            Browse All Jobs
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default JobSeekerDashboard; 