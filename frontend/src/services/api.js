import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me')
};

// Job services
export const jobService = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`)
};

// Application services
export const applicationService = {
  applyForJob: (applicationData) => api.post('/applications', applicationData),
  getMyApplications: () => api.get('/applications/me'),
  updateApplicationStatus: (id, statusData) => api.put(`/applications/${id}`, statusData)
};

// User services
export const userService = {
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getEmployerById: (id) => api.get(`/users/employers/${id}`),
  getJobSeekerById: (id) => api.get(`/users/job-seekers/${id}`)
};

export default api; 