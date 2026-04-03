# AiRSupport - Complete Documentation

**Last Updated:** April 2026  
**Version:** 2.0.0 (With User Authentication) 

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Authentication System](#authentication-system)
4. [Docker Production Deployment](#docker-production-deployment)
5. [Architecture](#architecture)
6. [API Documentation](#api-documentation)
7. [Code Style Guide](#code-style-guide)
8. [Deployment Checklist](#deployment-checklist)
9. [Kubernetes Deployment](#kubernetes-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**AiRSupport** is a Google Workspace administration dashboard with secure user authentication. It provides efficient lookup capabilities for:
- **Users** - Search and manage Google Workspace users
- **Shared Drives** - Find and manage shared drives
- **Groups** - Locate and manage Google Workspace groups

### Technology Stack

**Backend:**
- Node.js 18 (Alpine)
- Express.js
- MySQL (with connection pooling)
- JWT Authentication
- Google APIs (Admin Directory)

**Frontend:**
- React 18 with Vite
- React Router v6
- Axios for API calls
- Professional UI components

**DevOps:**
- Docker & Docker Compose
- Kubernetes-ready manifests
- Nginx reverse proxy
- Multi-stage builds

---

## Quick Start

### Development Environment

#### Prerequisites
- Node.js 18+
- MySQL running on Ubuntu VM (140.245.237.157:3306)
- npm or yarn

#### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

#### Step 2: Configure Environment

**Backend** - Update `backend/.env`:
```bash
PORT=4000
NODE_ENV=development

# Google Workspace
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./credentials.json
GOOGLE_ADMIN_SUBJECT=ajay@devopshome.online

# MySQL Database
DB_HOST=140.245.237.157
DB_PORT=3306
DB_USER=wms_app
DB_PASSWORD=Ajaykumar@12.
DB_NAME=supportair

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Frontend** - Create `frontend/.env`:
```bash
VITE_API_BASE=http://localhost:4000/api
```

#### Step 3: Start Services

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Backend runs on http://localhost:4000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

#### Step 4: Access Application

1. Open browser → `http://localhost:3000`
2. Register new account or login
3. Access dashboard with user/group/drive search

---

## Authentication System

### ✅ What's Implemented

#### 1. Database Layer (`backend/database.js`)
- MySQL connection pool with proper configuration
- Auto-creates `users` table with fields:
  - `id`, `email`, `password_hash`, `username`
  - `first_name`, `last_name`, `is_active`
  - `created_at`, `updated_at`, `last_login`
- Connection pooling for better performance

#### 2. Authentication Middleware (`backend/middleware/auth.js`)
- JWT token generation (24-hour expiry)
- Token verification for protected routes
- Optional authentication support

#### 3. Auth Routes (`backend/routes/auth.js`)
- **POST /api/auth/register** - User registration
- **POST /api/auth/login** - User login
- **GET /api/auth/me** - Get current user (protected)
- **POST /api/auth/change-password** - Change password (protected)

#### 4. Dependencies Added
- `mysql2` - MySQL driver with promise support
- `bcryptjs` - Secure password hashing (10 rounds)
- `jsonwebtoken` - JWT token management

#### 5. Frontend Authentication (`frontend/src/context/AuthContext.jsx`)
- Context API for auth state management
- Token storage in localStorage
- User info persistence
- Automatic token verification on app load

#### 6. Protected Routes (`frontend/src/components/ProtectedRoute.jsx`)
- Guards dashboard pages (User/Group/Drive search)
- Redirects unauthenticated users to login
- Handles loading states

#### 7. Auth Pages
- **Login.jsx** - Email & password login
- **Register.jsx** - User registration with validation
- Professional auth UI with gradient styling

### API Usage Examples

#### Register New User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Get Current User (Protected)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Change Password (Protected)
```bash
curl -X POST http://localhost:4000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123",
    "newPassword": "NewSecurePass456"
  }'
```

### Using Auth in Protected Routes

```javascript
import { authenticateToken } from '../middleware/auth';

// Protected route
router.get('/protected-endpoint', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const userEmail = req.user.email;
  // Your logic here
});
```

### Frontend Token Management

```javascript
// After successful login, token is automatically saved
localStorage.getItem('authToken');  // Retrieve token

// Use token in API requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};

// Clear token on logout
localStorage.removeItem('authToken');
```

---

## Docker Production Deployment

### Key Production Features

✅ **Security**
- Non-root users in all containers
- Security headers configured
- No hardcoded secrets
- Minimal base images

✅ **Performance**
- Gzip compression
- Browser caching (1 year for static assets)
- Optimized image sizes
- Multi-stage builds

✅ **Reliability**
- Health checks for auto-recovery
- Proper signal handling (SIGTERM/SIGKILL)
- Structured logging
- Graceful degradation

✅ **DevOps Ready**
- Kubernetes-compatible manifests in `K8s/` directory
- Registry-agnostic (use any Docker registry)
- Environment-based configuration
- Centralized logging configuration

### 5-Minute Setup

#### Step 1: Prepare Environment Files
```bash
# Backend
cp backend/.env.production.example backend/.env.production
# Edit with production secrets

# Frontend
cp frontend/.env.production.example frontend/.env.production
# Edit with API URLs
```

#### Step 2: Build Images
```bash
# Option A: Using docker-compose (recommended)
docker-compose build

# Option B: Using build script (Windows)
build-docker.bat

# Option C: Using build script (Linux/Mac)
bash build-docker.sh
```

#### Step 3: Start Services
```bash
docker-compose up -d
```

#### Step 4: Verify Deployment
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Test backend health
curl http://localhost:4000/health

# Test frontend (open in browser)
http://localhost
```

### Building Production Images

#### Option 1: Build with Docker Compose (Recommended)
```bash
# Build both images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build with no cache (fresh build)
docker-compose build --no-cache
```

#### Option 2: Build Individual Images
```bash
# Backend
docker build -t gw-dashboard-backend:latest ./backend

# Frontend
docker build -t gw-dashboard-frontend:latest ./frontend
```

#### Option 3: Build with Custom Registry Tags
```bash
docker build -t myregistry.azurecr.io/gw-dashboard-backend:v1.0.0 ./backend
docker build -t myregistry.azurecr.io/gw-dashboard-frontend:v1.0.0 ./frontend
```

### Running Production Containers

#### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check health
docker-compose ps

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Common Docker Commands

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Remove all (including volumes)
docker-compose down -v

# Build and push to registry
docker build -t myregistry.io/gw/backend:v1.0.0 ./backend
docker push myregistry.io/gw/backend:v1.0.0
```

### Backend Container Features

- **Node.js 18 Alpine** base image (~150-200 MB final size)
- **Multi-stage build** - separates dependencies installation from runtime
- **Non-root user** - runs as `nodejs` user
- **Health checks** - monitors service availability
- **Volume mount** - `backend-logs` for persistent logs
- **Network** - `app-network` for secure inter-container communication

### Frontend Container Features

- **Nginx Alpine** base image (~40-60 MB final size)
- **Multi-stage Node build** - React app compiled separately
- **Optimized configuration**:
  - Gzip compression for faster delivery
  - Smart caching for static assets
  - SPA routing support (React Router)
  - Security headers (CSP, X-Frame-Options, etc.)
- **Health checks** - verifies nginx is responding
- **Non-root user** - runs as `nginx` user

---

## Architecture

### Project Structure

```
airsupport/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── users.js         # Google Workspace users
│   │   ├── drives.js        # Shared drives
│   │   └── groups.js        # Google Workspace groups
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── database.js          # MySQL connection & initialization
│   ├── server.js            # Express app setup
│   ├── Dockerfile           # Production build
│   ├── .dockerignore        # Build optimization
│   ├── package.json         # Dependencies
│   └── credentials.json     # Google service account (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── UserLookup.jsx      # User search
│   │   │   ├── SharedDriveLookup.jsx
│   │   │   └── GroupLookup.jsx
│   │   ├── components/
│   │   │   ├── NavBar.jsx          # Sidebar navigation
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   └── ResultCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── styles/
│   │   │   └── auth.css            # Auth pages styling
│   │   ├── App.jsx                 # Router setup
│   │   └── main.jsx                # React entry point
│   ├── Dockerfile           # Production build
│   ├── nginx.conf           # Nginx configuration
│   ├── nginx-default.conf   # Server block
│   ├── package.json         # Dependencies
│   └── vite.config.mjs      # Vite configuration
│
├── K8s/
│   ├── 1-namespace.yaml
│   ├── 2-backend.yaml
│   ├── 3-frontend.yaml
│   └── kind-cluster-config.yaml
│
├── ansible/
│   ├── ansible.cfg
│   ├── inventory.yaml
│   └── playbooks/
│       ├── jenkins_setup.yaml
│       └── update_cache.yaml
│
├── docker-compose.yml       # Multi-container setup
├── build-docker.bat         # Windows build script
├── build-docker.sh          # Linux/Mac build script
└── README.md               # This file
```

---

## API Documentation

### Backend Base URL
- **Development**: `http://localhost:4000/api`
- **Production**: `http://backend:4000/api` (Docker) or configured URL

### Authentication Endpoints

#### 1. Register User
```
POST /api/auth/register
Headers: Content-Type: application/json
Body: {
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "optional",
  "firstName": "John",
  "lastName": "Doe"
}
Response: { message, token, user }
Status: 201 (Created) | 409 (Conflict) | 500 (Error)
```

#### 2. Login
```
POST /api/auth/login
Headers: Content-Type: application/json
Body: {
  "email": "user@example.com",
  "password": "SecurePass123"
}
Response: { message, token, user }
Status: 200 (OK) | 401 (Unauthorized) | 500 (Error)
```

#### 3. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <JWT_TOKEN>
Response: { user: { id, email, username, firstName, lastName, isActive, createdAt, lastLogin } }
Status: 200 (OK) | 401 (Unauthorized) | 404 (Not Found) | 500 (Error)
```

#### 4. Change Password
```
POST /api/auth/change-password
Headers: 
  - Authorization: Bearer <JWT_TOKEN>
  - Content-Type: application/json
Body: {
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
Response: { message: "Password changed successfully" }
Status: 200 (OK) | 401 (Unauthorized) | 400 (Bad Request) | 500 (Error)
```

### User Lookup Endpoints

#### 1. Get User Info
```
GET /api/user/:email
Response: { user, aliases, groups }
Status: 200 (OK) | 400 (Bad Request) | 500 (Error)
```

### Group Lookup Endpoints

#### 1. Search Groups
```
GET /api/group/search?q=group-name
Response: { groups }
Status: 200 (OK) | 400 (Bad Request) | 500 (Error)
```

### (More endpoints documented in original code)

---

## Code Style Guide

### JavaScript/Node.js Standards

#### Indentation & Spacing
- **Indentation**: 2 spaces (never tabs)
- **Line Length**: Maximum 100 characters
- **Trailing Spaces**: None
- **End of Line**: LF (Unix line endings)

#### Semicolons
```javascript
// ✅ Good
const name = 'John';
const add = (a, b) => a + b;

// ❌ Bad
const name = 'John'
const add = (a, b) => a + b
```

#### Quotes
Use single quotes for strings:
```javascript
// ✅ Good
const message = 'Hello World';
const html = `<div>${name}</div>`;

// ❌ Bad
const message = "Hello World";
```

#### Variable Declaration
Prefer `const` over `let` over `var`:
```javascript
// ✅ Good
const API_URL = 'https://api.example.com';
let count = 0;

// ❌ Bad
var API_URL = 'https://api.example.com';
var count = 0;
```

#### Function Declaration
```javascript
// ✅ Good
/**
 * Calculate user eligibility
 * @param {Object} user - User object
 * @returns {boolean} Is eligible
 */
function isEligible(user) {
  return user.age >= 18;
}

// ❌ Bad
function isEligible (user){
  return user.age >= 18
}
```

#### Async/Await Best Practices
```javascript
// ✅ Good
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// ❌ Bad
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;  // No error handling
}
```

#### Comments & Documentation
```javascript
// ✅ Good - JSDoc format
/**
 * Fetch user information by email
 * @param {string} email - User email address
 * @returns {Promise<Object>} User data object
 * @throws {Error} If email is invalid or not found
 */
export async function fetchUser(email) {
  // Implementation
}

// ❌ Bad - Unclear comments
// Get user data
function getUser(email) {
  // Do stuff
}
```

#### Error Handling
```javascript
// ✅ Good
try {
  const result = await operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error.message);
  res.status(500).json({ error: 'Operation failed' });
}

// ❌ Bad
try {
  const result = await operation();
} catch (error) {
  // Do nothing - silent failure
}
```

### React/JSX Standards

#### Component Structure
```javascript
// ✅ Good
import React from 'react';
import { useEffect, useState } from 'react';

function UserCard({ user }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default UserCard;
```

#### Props & Prop Types
```javascript
// ✅ Good - Use prop destructuring
function Button({ label, onClick, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

#### Hooks Usage
```javascript
// ✅ Good - Proper hook dependencies
useEffect(() => {
  fetchData(id);
}, [id]); // Include id in dependencies

// ❌ Bad - Missing dependencies
useEffect(() => {
  fetchData(id);
}, []); // Should include id
```

---

## Deployment Checklist

### Pre-Deployment Configuration

#### 1. Environment Files Setup
- [ ] Create `backend/.env.production`
- [ ] Create `frontend/.env.production`
- [ ] Verify all secrets are configured
- [ ] No hardcoded passwords in code

#### 2. Image Building & Registry
- [ ] Verify Docker is running: `docker --version`
- [ ] Build images: `docker-compose build`
- [ ] Test images locally: `docker-compose up -d`
- [ ] Verify health: `docker-compose ps`
- [ ] View logs: `docker-compose logs -f`
- [ ] Stop and cleanup: `docker-compose down`

#### 3. Security Review
- [ ] Verify non-root users in containers
- [ ] Check for secrets in .env files
- [ ] `.gitignore` includes `.env*` and `credentials.json`
- [ ] Review security headers in nginx-default.conf
- [ ] No passwords in Dockerfiles

#### 4. Network & Port Configuration
- [ ] Backend port (4000): Verify not in use
- [ ] Frontend port (80): Verify not in use
- [ ] Firewall rules allow traffic
- [ ] HTTPS configured (if needed)

#### 5. Persistence & Storage
- [ ] Backup strategy in place for persistent data
- [ ] Volume mounts configured correctly
- [ ] backend-logs volume for logs

#### 6. Database & External Services
- [ ] MySQL accessible from containers
- [ ] Google Workspace credentials valid
- [ ] All external APIs accessible
- [ ] No hardcoded secrets in code

#### 7. Logging & Monitoring
- [ ] Log driver configured: json-file with rotation
- [ ] Max log size limits set: 10m per file
- [ ] Max log files: 3 (30M total per service)
- [ ] Health check endpoints accessible
- [ ] Monitoring tools ready to collect logs

#### 8. Performance Tuning
- [ ] Frontend: Gzip compression enabled
- [ ] Frontend: Cache-Control headers set
- [ ] Backend: Connection pooling configured
- [ ] Memory/CPU limits appropriate

#### 9. Docker Registry Setup (if using private)
- [ ] Docker login credentials available
- [ ] Registry credentials NOT in version control
- [ ] Images tagged with version numbers
- [ ] Image naming convention: `registry.io/namespace/service:version`

#### 10. Kubernetes Deployment (if applicable)
- [ ] Kubernetes manifests updated with image URLs
- [ ] ConfigMaps created for non-sensitive configuration
- [ ] Secrets created for sensitive data
- [ ] Resource requests and limits set
- [ ] Health checks match Kubernetes probes

### Pre-Production Testing

#### Local Testing
- [ ] Run `docker-compose up -d`
- [ ] Backend health check: `curl http://localhost:4000/health`
- [ ] Frontend loads in browser: `http://localhost`
- [ ] Health endpoints respond correctly
- [ ] API communication works (frontend to backend)
- [ ] Error logs are being written correctly
- [ ] No errors in `docker-compose logs`

### Production Deployment Steps

#### 1. Database/Initial Setup
```bash
# If needed, run migrations
docker-compose exec backend npm run migrate
```

#### 2. Start Services
```bash
# Start all services
docker-compose up -d

# Verify all services are healthy
docker-compose ps
```

#### 3. Verify Deployment
```bash
# Check container logs
docker-compose logs -f

# Verify health endpoints
curl http://localhost:4000/health
curl http://localhost/health

# Check system resources
docker stats
```

#### 4. Post-Deployment
- [ ] Health checks consistently passing
- [ ] No error logs in container output
- [ ] Website loads correctly from browser
- [ ] API endpoints respond as expected
- [ ] Monitoring/alerting confirms all metrics normal

### Rollback Procedure

If issues are detected:

```bash
# 1. Stop services
docker-compose down

# 2. Restore previous version
docker-compose up -d

# 3. Verify health
docker-compose ps

# 4. Review logs
docker-compose logs
```

### Maintenance Schedule

#### Daily
- [ ] Monitor logs for errors
- [ ] Check disk space (cleanup if needed)
- [ ] Verify health checks passing

#### Weekly
- [ ] Review security logs
- [ ] Check for available updates to base images
- [ ] Verify backup integrity (if applicable)

#### Monthly
- [ ] Update base images: `docker-compose pull && docker-compose up -d`
- [ ] Review and rotate secrets if needed
- [ ] Test disaster recovery procedures

---

## Kubernetes Deployment

Kubernetes manifests are provided in the `K8s/` directory:

- **1-namespace.yaml** - Create `airsupport` namespace
- **2-backend.yaml** - Backend deployment, service, and config
- **3-frontend.yaml** - Frontend deployment, service, and config
- **kind-cluster-config.yaml** - Kind cluster configuration for local testing

### Deploy to Kubernetes

```bash
# Create namespace and deploy
kubectl apply -f K8s/

# Verify deployment
kubectl get pods -n airsupport
kubectl get svc -n airsupport

# View logs
kubectl logs -n airsupport -l app=backend
kubectl logs -n airsupport -l app=frontend

# Port forward for testing
kubectl port-forward -n airsupport svc/backend 4000:4000
kubectl port-forward -n airsupport svc/frontend 3000:80
```

---

## Troubleshooting

### Containers failing to start?
```bash
docker-compose logs
# Check for missing environment variables or port conflicts
```

### API calls between containers failing?
```bash
# Use internal network hostname, not localhost
VITE_API_URL=http://backend:4000  # Correct
VITE_API_URL=http://localhost:4000  # Wrong in Docker
```

### Health check failing?
```bash
# Verify service is responding
curl -v http://localhost:4000/health
curl -v http://localhost/health
```

### High memory usage?
```bash
# Check for memory leaks
docker stats
# Review logs for issues
docker-compose logs backend
```

### Port already in use?
```bash
# Windows
netstat -ano | findstr :4000

# Linux/Mac
lsof -i :4000

# Then kill the process or change port in docker-compose.yml
```

### Permission denied errors?
```bash
# Verify user permissions in Dockerfile (non-root)
docker inspect container-name | grep User
```

### Slow startup?
```bash
# Review logs for initialization delays
docker-compose logs -f

# Increase health check start_period if needed
```

---

## Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24-hour expiry
- ✅ Environment variables for secrets (not in code)
- ✅ Non-root users in Docker containers
- ✅ SQL connection pooling for performance
- ✅ CORS configured for frontend domain
- ✅ Security headers in Nginx (CSP, X-Frame-Options)
- ✅ Health check endpoints for monitoring
- ✅ Minimal base images (Alpine Linux)
- ✅ Multi-stage builds for smaller images

---

## Support & Contact

For issues, questions, or contributions:
- Check the troubleshooting section above
- Review application logs: `docker-compose logs -f`
- Verify environment configuration
- Check database connectivity

---

## Version History

- **v2.0.0** (Apr 2026) - Added user authentication with JWT
- **v1.0.0** (Mar 2026) - Initial release with Google Workspace integration

---

## License

MIT License - See LICENSE file for details
