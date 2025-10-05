# Docker Testing Guide

This guide provides step-by-step instructions for testing the Task Manager application using Docker.

## Quick Test (2 Minutes)

### 1. Start the Application

```bash
# Clone and start
git clone https://github.com/min3754/task-manager.git
cd task-manager
docker-compose up -d
```

Expected output:
```
Creating network "task-manager_taskmanager-network" with the default driver
Creating volume "task-manager_postgres_data" with default driver
Creating taskmanager-postgres ... done
Creating taskmanager-backend  ... done
Creating taskmanager-frontend ... done
```

### 2. Verify Services are Running

```bash
docker-compose ps
```

Expected output:
```
Name                      Command              State           Ports
----------------------------------------------------------------------------------
taskmanager-backend   sh -c sleep 5 && node ...   Up      0.0.0.0:5000->5000/tcp
taskmanager-frontend  /docker-entrypoint.sh ...   Up      0.0.0.0:3000->80/tcp
taskmanager-postgres  docker-entrypoint.sh ...    Up      0.0.0.0:5432->5432/tcp
```

All services should show "Up" status.

### 3. Test the Application

**Open in Browser:**
- Frontend: http://localhost:3000
- You should see the Task Manager login/register page

**Test API:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Task Manager API is running"}
```

### 4. Create Test Account

1. Go to http://localhost:3000
2. Click "Register"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Register"
5. You should be logged in automatically

### 5. Create Test Tasks

1. Click "Tasks" in navigation
2. Click "+ New Task"
3. Create a few sample tasks:
   - Title: "Setup Docker environment"
   - Status: DONE
   - Click "Create"

4. Create more tasks with different statuses
5. Test filtering by status

### 6. View Dashboard

1. Click "Dashboard" in navigation
2. You should see:
   - Task statistics (Total, TODO, In Progress, Done)
   - Progress bar showing completion percentage
   - Recent tasks list

### 7. Test Profile

1. Click "Profile" in navigation
2. Update your name or add an avatar URL
3. Click "Update Profile"

### 8. Check Logs (if issues)

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### 9. Stop the Application

```bash
docker-compose down
```

To also remove the database data:
```bash
docker-compose down -v
```

## Detailed Testing Scenarios

### Test 1: User Authentication

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "password123"
  }'

# Save the returned token
TOKEN="<paste_token_here>"

# Get profile
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: ******"
```

### Test 2: Task Management

```bash
# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: ******" \
  -d '{
    "title": "Docker Test Task",
    "description": "Testing task creation via API",
    "status": "TODO",
    "due_date": "2024-12-31"
  }'

# Get all tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: ******"

# Get task statistics
curl http://localhost:5000/api/tasks/stats \
  -H "Authorization: ******"
```

### Test 3: Database Persistence

```bash
# Create some tasks
# Stop containers
docker-compose down

# Start again
docker-compose up -d

# Check if data persists
# Login with same credentials and verify tasks are still there
```

### Test 4: Multiple Users

```bash
# Register second user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Second User",
    "email": "user2@test.com",
    "password": "password123"
  }'

# Create task and assign to second user
# Test collaboration features
```

## Performance Testing

### Check Container Resource Usage

```bash
docker stats
```

### Response Time Test

```bash
# Install Apache Bench (if not installed)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# Mac: brew install ab

# Test API endpoint
ab -n 100 -c 10 http://localhost:5000/api/health
```

## Troubleshooting Tests

### Test 1: Database Connection

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d taskmanager

# List tables
\dt

# Check data
SELECT * FROM users;
SELECT * FROM tasks;

# Exit
\q
```

### Test 2: Backend Logs

```bash
# Follow backend logs
docker-compose logs -f backend

# In another terminal, make API request
curl http://localhost:5000/api/health
```

### Test 3: Frontend Static Files

```bash
# Check nginx is serving files
curl http://localhost:3000

# Should return HTML content
```

### Test 4: Network Communication

```bash
# Check if backend can reach database
docker-compose exec backend sh -c "nc -zv postgres 5432"

# Should show: postgres (172.x.x.x:5432) open
```

## Load Testing

### Simple Load Test

```bash
# Create multiple concurrent requests
for i in {1..50}; do
  curl -s http://localhost:5000/api/health &
done
wait

# Check all succeeded
```

### With Authentication

```bash
# Register 10 users concurrently
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User $i\",
      \"email\": \"user$i@test.com\",
      \"password\": \"password123\"
    }" &
done
wait
```

## Browser Testing Checklist

- [ ] Can access http://localhost:3000
- [ ] Register page loads correctly
- [ ] Can register a new account
- [ ] Login works with registered credentials
- [ ] Dashboard displays statistics
- [ ] Can create new tasks
- [ ] Can edit existing tasks
- [ ] Can delete tasks
- [ ] Task filtering works
- [ ] "My Tasks" filter works
- [ ] Can update profile
- [ ] Logout works
- [ ] Login again works with same credentials

## Common Issues and Solutions

### Issue: Port already in use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Stop the process or change ports in docker-compose.yml
```

### Issue: Containers not starting

```bash
# Check Docker is running
docker info

# Rebuild containers
docker-compose down -v
docker-compose up -d --build
```

### Issue: Database not initialized

```bash
# Check init script ran
docker-compose logs postgres | grep "init-db.sql"

# Manually initialize if needed
docker-compose exec postgres psql -U postgres -d taskmanager -f /docker-entrypoint-initdb.d/init.sql
```

### Issue: Frontend can't reach backend

```bash
# Check backend is responding
curl http://localhost:5000/api/health

# Check nginx proxy config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Restart frontend
docker-compose restart frontend
```

## Cleanup After Testing

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (database data)
docker-compose down -v

# Remove images
docker rmi taskmanager-backend taskmanager-frontend

# Full cleanup (all Docker resources)
docker system prune -a
```

## Automated Test Script

Save this as `test-docker.sh`:

```bash
#!/bin/bash

echo "Starting Docker containers..."
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 10

echo "Testing backend health..."
HEALTH=$(curl -s http://localhost:5000/api/health)
echo $HEALTH

if [[ $HEALTH == *"ok"* ]]; then
  echo "✓ Backend is healthy"
else
  echo "✗ Backend health check failed"
  exit 1
fi

echo "Testing frontend..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ $FRONTEND -eq 200 ]; then
  echo "✓ Frontend is accessible"
else
  echo "✗ Frontend check failed (HTTP $FRONTEND)"
  exit 1
fi

echo "Testing database..."
DB_TEST=$(docker-compose exec -T postgres psql -U postgres -d taskmanager -c "\dt" | grep users)

if [[ $DB_TEST == *"users"* ]]; then
  echo "✓ Database is initialized"
else
  echo "✗ Database check failed"
  exit 1
fi

echo ""
echo "=========================="
echo "All tests passed! ✓"
echo "=========================="
echo ""
echo "Access the application at:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "To stop: docker-compose down"
```

Make executable and run:
```bash
chmod +x test-docker.sh
./test-docker.sh
```

## Success Criteria

The application is working correctly if:

1. ✅ All three containers start successfully
2. ✅ Backend health endpoint returns 200 OK
3. ✅ Frontend is accessible in browser
4. ✅ Can register a new user
5. ✅ Can login with credentials
6. ✅ Can create, edit, and delete tasks
7. ✅ Dashboard shows correct statistics
8. ✅ Data persists after container restart
9. ✅ No errors in logs
10. ✅ All containers show "Up" status

---

**Quick Command Reference:**

```bash
# Start
docker-compose up -d

# Status
docker-compose ps

# Logs
docker-compose logs -f

# Test API
curl http://localhost:5000/api/health

# Access database
docker-compose exec postgres psql -U postgres -d taskmanager

# Stop
docker-compose down

# Full cleanup
docker-compose down -v && docker system prune -a
```
