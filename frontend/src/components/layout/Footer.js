import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    {
      category: 'For Job Seekers',
      links: [
        { name: 'Browse Jobs', url: '/jobs' },
        { name: 'Create Account', url: '/register' },
        { name: 'Job Alerts', url: '/job-alerts' },
        { name: 'Career Advice', url: '/blog' }
      ]
    },
    {
      category: 'For Employers',
      links: [
        { name: 'Post a Job', url: '/employer/post-job' },
        { name: 'Browse Candidates', url: '/candidates' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Recruiting Solutions', url: '/solutions' }
      ]
    },
    {
      category: 'About',
      links: [
        { name: 'About Us', url: '/about' },
        { name: 'Contact', url: '/contact' },
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' }
      ]
    }
  ];

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              JobPortal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connecting talent with opportunity. Find your dream job or the perfect candidate with JobPortal.
            </Typography>
          </Grid>
          
          {/* Quick Links */}
          {footerLinks.map((category) => (
            <Grid item xs={12} sm={6} md={2} key={category.category}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {category.category}
              </Typography>
              <Box>
                {category.links.map((link) => (
                  <Link
                    component={RouterLink}
                    to={link.url}
                    key={link.name}
                    color="inherit"
                    underline="hover"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        {/* Copyright */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Facebook
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Twitter
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              LinkedIn
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 