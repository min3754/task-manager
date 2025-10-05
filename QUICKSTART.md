# Quick Start Guide

Get the Task Manager up and running in minutes!

## Choose Your Setup Method

### 🐳 Option 1: Docker (Easiest - 2 Minutes)

**Prerequisites:**
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))

**Steps:**
```bash
# 1. Clone the repository
git clone https://github.com/min3754/task-manager.git
cd task-manager

# 2. Start everything with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

**That's it!** No need to install Node.js or PostgreSQL.

To stop:
```bash
docker-compose down
```

For more Docker commands, see [DOCKER.md](DOCKER.md)

---

### 💻 Option 2: Manual Setup (5 Minutes)

**Prerequisites:**
- Node.js v16+ installed
- PostgreSQL installed and running
- Git installed

**Step-by-Step Setup**

### 1. Clone the Repository

```bash
git clone https://github.com/min3754/task-manager.git
cd task-manager
```

### 2. Install Dependencies

```bash
npm run install-all
```

This installs dependencies for both backend and frontend.

### 3. Set Up Database

**Create PostgreSQL database:**

```bash
# Using psql
createdb taskmanager

# Or with psql interactive
psql -U postgres
CREATE DATABASE taskmanager;
\q
```

### 4. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key_here
```

### 5. Initialize Database Tables

```bash
npm run init-db
```

You should see: "All tables created successfully"

### 6. Start the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

Backend will run on http://localhost:5000

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

### 7. Access the Application

Open your browser and go to: http://localhost:3000

### 8. Create Your First Account

1. Click "Register" 
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: (minimum 6 characters)
3. Click "Register"

You'll be automatically logged in!

## What's Next?

### Create Your First Task

1. Click "Tasks" in the navigation
2. Click "+ New Task" button
3. Fill in task details:
   - Title (required)
   - Description
   - Status (TODO, IN_PROGRESS, DONE)
   - Assignee (yourself or other users)
   - Due Date
4. Click "Create"

### Explore Features

- **Dashboard**: View task statistics and progress
- **Tasks**: Manage all tasks with filtering options
- **Profile**: Update your profile information
- **Comments**: Add comments to tasks for collaboration

### Add More Users

1. Logout from current account
2. Register another user
3. Login back to your first account
4. Now you can assign tasks to other users!

## Troubleshooting

### Database Connection Error

**Problem:** Cannot connect to database

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # On Mac/Linux
   sudo service postgresql status
   # On Windows
   pg_ctl status
   ```
2. Check database exists:
   ```bash
   psql -U postgres -l | grep taskmanager
   ```
3. Verify credentials in `backend/.env`

### Port Already in Use

**Problem:** Port 5000 or 3000 already in use

**Solution:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update proxy in `frontend/vite.config.js`:
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:5001'
     }
   }
   ```

### Module Not Found

**Problem:** Module not found error

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install
```

## Testing API with cURL

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Tasks

```bash
# Replace YOUR_TOKEN with the token from login response
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development Mode Features

- **Hot Reload**: Changes to code automatically reload the application
- **Error Overlay**: Frontend shows errors directly in browser
- **Console Logging**: Backend logs all requests and errors
- **Database Logging**: SQL queries logged in development

## Production Build

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Next Steps

- Read the [full README](README.md) for detailed documentation
- Check [API documentation](API.md) for API reference
- Read [Contributing guidelines](CONTRIBUTING.md) to contribute
- See [Deployment guide](DEPLOYMENT.md) for production deployment

## Need Help?

- Check [GitHub Issues](https://github.com/min3754/task-manager/issues)
- Read the troubleshooting sections in documentation
- Open a new issue with detailed information

## Quick Commands Reference

```bash
# Install all dependencies
npm run install-all

# Start development (both backend and frontend)
npm run dev

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Initialize database
cd backend && npm run init-db

# Build frontend for production
cd frontend && npm run build
```

Enjoy using Task Manager! 🚀
