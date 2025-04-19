import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const RoleRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user's role is included in the allowed roles
  const hasRequiredRole = user && roles.includes(user.role);
  
  // If user doesn't have required role, redirect to home page
  return hasRequiredRole ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoute; 