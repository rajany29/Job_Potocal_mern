# Job Portal - MERN Stack Application

A fully functional job portal web application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows employers to post job listings and job seekers to apply for jobs.

## Features

- **User Authentication System**
  - JWT-based authentication
  - Role-Based Access Control (RBAC) for Employers and Job Seekers

- **Job Listings & Search**
  - CRUD operations for job listings
  - Advanced search and filtering system

- **Job Application System**
  - Job application workflow
  - Application status tracking

- **Employer & Job Seeker Dashboards**
  - Employer Dashboard: Manage job postings and view applicants
  - Job Seeker Dashboard: Track applied jobs and manage applications

## Prerequisites

- Node.js (v16 or later)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd job-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your MongoDB connection string and JWT secret:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Start Backend Server

```bash
# From the backend directory
npm run dev
```

The server will run on http://localhost:5000.

### Start Frontend Development Server

```bash
# From the frontend directory
npm start
```

The frontend will run on http://localhost:3000.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile

### Jobs

- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (Employers only)
- `PUT /api/jobs/:id` - Update a job (Employers only)
- `DELETE /api/jobs/:id` - Delete a job (Employers only)

### Applications

- `POST /api/applications` - Apply for a job (Job Seekers only)
- `GET /api/applications/me` - Get current user's applications (Job Seekers only)
- `GET /api/jobs/:jobId/applications` - Get all applications for a job (Employers only)
- `PUT /api/applications/:id` - Update application status (Employers only)

### Users

- `PUT /api/users/profile` - Update user profile
- `GET /api/users/employers/:id` - Get employer public profile
- `GET /api/users/job-seekers/:id` - Get job seeker public profile

## Project Structure

```
job-portal/
├── backend/             # Backend code
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Middleware functions
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # Express routes
│   │   └── utils/       # Utility functions
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
│
├── frontend/            # Frontend code
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts (Auth, etc.)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   ├── package.json     # Frontend dependencies
│   └── README.md        # Frontend documentation
│
└── README.md            # Project documentation
```

## Deployment

The application can be deployed to platforms like:
- Render for the backend
- Vercel or Netlify for the frontend
- MongoDB Atlas for the database

## License

This project is licensed under the MIT License.

## Acknowledgements

- Create React App - Frontend boilerplate
- Material-UI - UI component library
- Express.js - Backend framework
- Mongoose - MongoDB object modeling
- JWT - Authentication # Job_Potocal_mern
