import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  IconButton,
  Drawer,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  FilterList,
  Close,
  Tune
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { jobService } from '../services/api';
import JobCard from '../components/jobs/JobCard';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EXPERIENCE_LEVELS = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];

const JobList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Fetch jobs with filters
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Prepare query params
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters
        };
        
        // Clean empty filters
        Object.keys(queryParams).forEach(key => 
          !queryParams[key] && delete queryParams[key]
        );
        
        const response = await jobService.getAllJobs(queryParams);
        
        setJobs(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: Math.ceil(response.data.count / prev.limit)
        }));
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [filters, pagination.page, pagination.limit]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Already handled by the filter change
  };
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      category: ''
    });
  };
  
  // Filter sidebar/drawer content
  const filterContent = (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Filters</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      )}
      
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Experience Level
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          name="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleFilterChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Experience Levels</MenuItem>
          {EXPERIENCE_LEVELS.map(level => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Job Type
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Job Types</MenuItem>
          {JOB_TYPES.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Category
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <TextField
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="e.g. IT, Marketing"
          size="small"
        />
      </FormControl>
      
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={clearFilters} 
        startIcon={<FilterList />}
        fullWidth
      >
        Clear Filters
      </Button>
    </Box>
  );
  
  return (
    <Box>
      {/* Search Bar Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.light',
          py: 4,
          px: 3,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" color="primary.contrastText">
          Find Your Dream Job
        </Typography>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <TextField
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Job title, keywords, or company"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: { bgcolor: 'background.paper', borderRadius: 1 }
            }}
            size="small"
          />
          <TextField
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
              sx: { bgcolor: 'background.paper', borderRadius: 1 }
            }}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            size="medium"
            sx={{ px: 4, whiteSpace: 'nowrap' }}
            startIcon={<Search />}
          >
            Search Jobs
          </Button>
          
          {/* Mobile filter button */}
          {isMobile && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Tune />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{ bgcolor: 'background.paper' }}
            >
              Filters
            </Button>
          )}
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 90 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Filters
              </Typography>
              {filterContent}
            </Paper>
          </Grid>
        )}
        
        {/* Job Listings */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {/* Applied filters */}
          {Object.values(filters).some(Boolean) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Applied Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.search && (
                  <Chip 
                    label={`Search: ${filters.search}`} 
                    onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                    size="small"
                  />
                )}
                {filters.location && (
                  <Chip 
                    label={`Location: ${filters.location}`} 
                    onDelete={() => setFilters(prev => ({ ...prev, location: '' }))}
                    size="small"
                  />
                )}
                {filters.jobType && (
                  <Chip 
                    label={`Job Type: ${filters.jobType}`} 
                    onDelete={() => setFilters(prev => ({ ...prev, jobType: '' }))}
                    size="small"
                  />
                )}
                {filters.experienceLevel && (
                  <Chip 
                    label={`Experience: ${filters.experienceLevel}`} 
                    onDelete={() => setFilters(prev => ({ ...prev, experienceLevel: '' }))}
                    size="small"
                  />
                )}
                {filters.category && (
                  <Chip 
                    label={`Category: ${filters.category}`} 
                    onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                    size="small"
                  />
                )}
                <Chip 
                  label="Clear All" 
                  onClick={clearFilters}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          )}
          
          {/* Results section */}
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light', color: 'error.dark' }}>
                <Typography>{error}</Typography>
              </Paper>
            ) : jobs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Work fontSize="large" color="disabled" sx={{ mb: 2, fontSize: 60 }} />
                <Typography variant="h6" gutterBottom>
                  No jobs found
                </Typography>
                <Typography color="textSecondary">
                  Try adjusting your search filters or check back later for new opportunities.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }} 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Paper>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Showing {jobs.length} jobs
                  </Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={pagination.limit}
                      onChange={(e) => setPagination(prev => ({ ...prev, limit: e.target.value, page: 1 }))}
                      displayEmpty
                    >
                      <MenuItem value={5}>5 per page</MenuItem>
                      <MenuItem value={10}>10 per page</MenuItem>
                      <MenuItem value={20}>20 per page</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
                
                {pagination.total > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination 
                      count={pagination.total} 
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <Box sx={{ width: 300 }}>
          {filterContent}
        </Box>
      </Drawer>
    </Box>
  );
};

export default JobList; 