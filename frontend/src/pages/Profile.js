import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import { PersonOutline, Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      position: user?.position || '',
      company: user?.company || '',
      experience: user?.experience || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || ''
    }
  });
  
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
    try {
      setLoading(true);
      // Add skills to the data
      const updatedData = { ...data, skills };
      
      await userService.updateProfile(updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              mr: 2,
              fontSize: '1.5rem'
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email} • {user?.role === 'job-seeker' ? 'Job Seeker' : 'Employer'}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                {...register('name', {
                  required: 'Name is required'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register('phone')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City, Country"
                {...register('location')}
              />
            </Grid>
            
            {/* Professional Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Professional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position/Title"
                {...register('position')}
              />
            </Grid>
            
            {user?.role === 'employer' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  {...register('company', {
                    required: user?.role === 'employer' ? 'Company name is required for employers' : false
                  })}
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={user?.role === 'employer' ? 12 : 6}>
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                {...register('experience')}
              />
            </Grid>
            
            {/* Skills */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Skills
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
                  <Typography variant="body2" color="text.secondary">
                    No skills added yet. Add some skills to make your profile stand out.
                  </Typography>
                )}
              </Box>
            </Grid>
            
            {/* Bio */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Bio
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About Me"
                placeholder="Tell us about yourself, your experience, and what you're looking for."
                {...register('bio')}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 