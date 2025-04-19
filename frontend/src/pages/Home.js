import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Container,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  Search, 
  Work, 
  Business, 
  LocationOn, 
  Star, 
  Person, 
  AssignmentTurnedIn
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isEmployer, isJobSeeker } = useAuth();

  const features = [
    {
      icon: <Work fontSize="large" color="primary" />,
      title: 'Latest Job Listings',
      description: 'Access thousands of job listings from top employers, updated daily with the newest opportunities.'
    },
    {
      icon: <Business fontSize="large" color="primary" />,
      title: 'Top Companies',
      description: 'Connect with leading companies looking for talent in various industries and sectors.'
    },
    {
      icon: <Person fontSize="large" color="primary" />,
      title: 'Career Profile',
      description: 'Create your professional profile, highlight your skills and let employers discover you.'
    },
    {
      icon: <Star fontSize="large" color="primary" />,
      title: 'Job Matching',
      description: 'Our intelligent system matches your skills and preferences with relevant job opportunities.'
    },
    {
      icon: <AssignmentTurnedIn fontSize="large" color="primary" />,
      title: 'Application Tracking',
      description: 'Manage and track all your job applications in one place with our easy-to-use dashboard.'
    },
    {
      icon: <LocationOn fontSize="large" color="primary" />,
      title: 'Location-Based Search',
      description: 'Find jobs near you or in your desired location with our advanced search filters.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.main',
          color: 'white',
          mb: 6,
          borderRadius: 4,
          overflow: 'hidden',
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Find Your Dream Job Today
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Connect with top employers and discover career opportunities that match your skills and aspirations.
              </Typography>
              
              {/* Search Bar */}
              <Box
                component="form"
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  maxWidth: '600px',
                  mb: 4
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Job title, keywords, or company"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    sx: { bgcolor: 'white', borderRadius: 2 }
                  }}
                  sx={{ flex: 2 }}
                />
                <Button
                  component={RouterLink}
                  to="/jobs"
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{ 
                    flex: { xs: '1 1 auto', sm: 'none' }, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  Search Jobs
                </Button>
              </Box>
              
              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {!isAuthenticated && (
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold' }}
                  >
                    Create Account
                  </Button>
                )}
                
                {isEmployer && (
                  <Button
                    component={RouterLink}
                    to="/employer/post-job"
                    variant="outlined"
                    size="large"
                    sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold' }}
                  >
                    Post a Job
                  </Button>
                )}
                
                {isJobSeeker && (
                  <Button
                    component={RouterLink}
                    to="/profile"
                    variant="outlined"
                    size="large"
                    sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold' }}
                  >
                    Update Profile
                  </Button>
                )}
                
                <Button
                  component={RouterLink}
                  to="/jobs"
                  variant="outlined"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold' }}
                >
                  Browse All Jobs
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              {/* Hero image could go here */}
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Why Choose Our Job Portal
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
                  }
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    component={RouterLink} 
                    to="/jobs" 
                    size="small" 
                    color="primary"
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Paper
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 6,
          px: 3,
          mt: 6,
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Ready to Take the Next Step in Your Career?
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
          Whether you're looking for your dream job or searching for the perfect candidate, we've got you covered.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/jobs"
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 'bold', py: 1.5, px: 4 }}
          >
            Find Jobs
          </Button>
          <Button
            component={RouterLink}
            to={isAuthenticated ? '/profile' : '/register'}
            variant="outlined"
            size="large"
            sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold', py: 1.5, px: 4 }}
          >
            {isAuthenticated ? 'My Profile' : 'Join Now'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home; 