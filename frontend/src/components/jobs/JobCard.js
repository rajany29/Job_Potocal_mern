import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Divider,
  Avatar
} from '@mui/material';
import { 
  LocationOn, 
  Business, 
  Work, 
  AccessTime
} from '@mui/icons-material';

const JobCard = ({ job }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card 
      className="job-card" 
      elevation={2} 
      sx={{ 
        mb: 3,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {job.status === 'Closed' && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          Closed
        </Box>
      )}
      
      <CardContent sx={{ pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2, 
              width: 48, 
              height: 48,
              fontSize: '1rem'
            }}
          >
            {job.company?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business fontSize="small" sx={{ mr: 0.5 }} />
              {job.company}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
              {job.location}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              icon={<Work fontSize="small" />} 
              label={job.jobType} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={job.experienceLevel} 
              size="small" 
              color="secondary" 
              variant="outlined" 
            />
            {job.salary && (
              <Chip 
                label={job.salary} 
                size="small" 
                color="success" 
                variant="outlined" 
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph sx={{ maxHeight: '80px', overflow: 'hidden' }}>
            {job.description.length > 150 
              ? `${job.description.substring(0, 150)}...` 
              : job.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {job.skills.slice(0, 3).map((skill, index) => (
              <Chip 
                key={index} 
                label={skill} 
                size="small" 
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
            {job.skills.length > 3 && (
              <Chip 
                label={`+${job.skills.length - 3} more`} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {job.applicationDeadline 
              ? `Apply by ${formatDate(job.applicationDeadline)}` 
              : `Posted on ${formatDate(job.createdAt)}`}
          </Typography>
        </Box>
        
        <Button 
          component={RouterLink} 
          to={`/jobs/${job._id}`} 
          variant="contained" 
          size="small"
          disabled={job.status === 'Closed'}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard; 