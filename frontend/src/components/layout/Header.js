import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Work,
  Person,
  Login,
  HowToReg
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isEmployer, isJobSeeker, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const renderPublicLinks = () => (
    <>
      <Button 
        component={RouterLink} 
        to="/jobs" 
        color="inherit" 
        sx={{ mx: 1 }}
      >
        Browse Jobs
      </Button>
    </>
  );
  
  const renderAuthLinks = () => (
    <>
      {isEmployer && (
        <Button 
          component={RouterLink} 
          to="/employer/post-job" 
          color="inherit" 
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Post a Job
        </Button>
      )}
    </>
  );
  
  const userMenuItems = [
    {
      text: 'Profile',
      icon: <Person />,
      onClick: () => {
        navigate('/profile');
        handleCloseUserMenu();
      }
    },
    {
      text: isEmployer ? 'Employer Dashboard' : 'Job Seeker Dashboard',
      icon: <Dashboard />,
      onClick: () => {
        navigate(isEmployer ? '/employer/dashboard' : '/job-seeker/dashboard');
        handleCloseUserMenu();
      }
    },
    {
      text: 'Logout',
      icon: <Logout />,
      onClick: handleLogout
    }
  ];
  
  const mobileMenuItems = [
    { 
      text: 'Browse Jobs',
      icon: <Work />,
      onClick: () => navigate('/jobs'),
      showAlways: true
    },
    { 
      text: 'Post a Job',
      icon: <Work />,
      onClick: () => navigate('/employer/post-job'),
      showWhen: 'employer'
    },
    { 
      text: 'Dashboard',
      icon: <Dashboard />,
      onClick: () => navigate(isEmployer ? '/employer/dashboard' : '/job-seeker/dashboard'),
      showWhen: 'authenticated'
    },
    { 
      text: 'Profile',
      icon: <Person />,
      onClick: () => navigate('/profile'),
      showWhen: 'authenticated'
    },
    { 
      text: 'Login',
      icon: <Login />,
      onClick: () => navigate('/login'),
      showWhen: 'unauthenticated'
    },
    { 
      text: 'Register',
      icon: <HowToReg />,
      onClick: () => navigate('/register'),
      showWhen: 'unauthenticated'
    },
    { 
      text: 'Logout',
      icon: <Logout />,
      onClick: handleLogout,
      showWhen: 'authenticated'
    }
  ];
  
  const shouldShowMobileItem = (item) => {
    if (item.showAlways) return true;
    if (item.showWhen === 'authenticated' && isAuthenticated) return true;
    if (item.showWhen === 'unauthenticated' && !isAuthenticated) return true;
    if (item.showWhen === 'employer' && isEmployer) return true;
    if (item.showWhen === 'jobSeeker' && isJobSeeker) return true;
    return false;
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile hamburger menu */}
          <IconButton
            size="large"
            aria-label="menu"
            color="inherit"
            sx={{ display: { md: 'none' } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JobPortal
          </Typography>
          
          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {renderPublicLinks()}
          </Box>
          
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                {renderAuthLinks()}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name} src="/static/images/avatar/2.jpg">
                      {user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem key={item.text} onClick={item.onClick}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText>{item.text}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ mx: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  variant="outlined"
                  sx={{ mx: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
          
          {/* Mobile only avatar if logged in */}
          {isAuthenticated && (
            <Box sx={{ display: { md: 'none' } }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                  <Avatar alt={user?.name} src="/static/images/avatar/2.jpg">
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-mobile"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userMenuItems.map((item) => (
                  <MenuItem key={item.text} onClick={item.onClick}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile drawer menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileMenu}
        >
          <List>
            {mobileMenuItems.map((item) => (
              shouldShowMobileItem(item) && (
                <ListItem button key={item.text} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header; 