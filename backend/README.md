# Backend Setup Guide

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v12 or higher
- npm or yarn

## Installation Steps

### 1. Database Setup

First, ensure PostgreSQL is running on your system.

**Create the database:**

```bash
# Using psql
psql -U postgres
CREATE DATABASE taskmanager;
\q

# Or using createdb command
createdb -U postgres taskmanager
```

**Verify connection:**

```bash
psql -U postgres -d taskmanager -c "SELECT version();"
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (optional for MVP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@taskmanager.com
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong random string in production
- Never commit `.env` file to version control
- Use environment-specific configurations

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database Tables

```bash
npm run init-db
```

This will create all necessary tables:
- `users` - User accounts and profiles
- `tasks` - Task information
- `comments` - Task comments
- `activity_logs` - Activity tracking

### 5. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Verify Installation

Test the API health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Task Manager API is running"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'TODO',
  assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comments Table

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Activity Logs Table

```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # On Linux/Mac
   sudo service postgresql status
   # or
   sudo systemctl status postgresql
   ```

2. Check connection settings in `.env`
3. Ensure database exists:
   ```bash
   psql -U postgres -l | grep taskmanager
   ```

### Port Already in Use

**Problem:** Port 5000 is already in use

**Solution:** Change the PORT in `.env` file:
```env
PORT=5001
```

### JWT Token Issues

**Problem:** Invalid token errors

**Solutions:**
1. Ensure `JWT_SECRET` is set in `.env`
2. Clear browser localStorage and login again
3. Check token expiration settings

## Development Tips

### Hot Reloading

The server uses `nodemon` for automatic reloading during development. Any changes to `.js` files will restart the server automatically.

### Testing API Endpoints

Use tools like:
- Postman
- cURL
- HTTPie
- VS Code REST Client

Example cURL commands:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get tasks (with auth token)
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Database Management

**View all tables:**
```bash
psql -U postgres -d taskmanager -c "\dt"
```

**Reset database:**
```bash
psql -U postgres -d taskmanager -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run init-db
```

**Backup database:**
```bash
pg_dump -U postgres taskmanager > backup.sql
```

**Restore database:**
```bash
psql -U postgres taskmanager < backup.sql
```

## Production Deployment

### Environment Variables

Ensure all environment variables are properly set:
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure proper database credentials
- Set up SSL/TLS for database connection

### Security Checklist

- [ ] Change all default passwords
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS with specific origins
- [ ] Set up rate limiting
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure database connection pooling
- [ ] Set up monitoring and alerts

### Performance Optimization

- Use connection pooling (already configured)
- Add database indexes for frequently queried fields
- Implement caching (Redis)
- Enable compression middleware
- Set up CDN for static assets
