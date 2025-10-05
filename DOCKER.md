# Docker Setup Guide

This guide explains how to run the Task Manager application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/min3754/task-manager.git
cd task-manager
```

### 2. Start the Application

```bash
docker-compose up -d
```

This command will:
- Pull the PostgreSQL image
- Build the backend Docker image
- Build the frontend Docker image
- Create a Docker network
- Start all services

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432 (postgres/postgres)

### 4. Stop the Application

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Detailed Usage

### View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services

**All services:**
```bash
docker-compose restart
```

**Specific service:**
```bash
docker-compose restart backend
```

### Rebuild After Code Changes

```bash
docker-compose up -d --build
```

### Execute Commands in Containers

**Backend container:**
```bash
docker-compose exec backend sh
```

**Database container:**
```bash
docker-compose exec postgres psql -U postgres -d taskmanager
```

### Check Service Status

```bash
docker-compose ps
```

## Architecture

The Docker setup consists of three services:

### 1. PostgreSQL Database (`postgres`)
- Image: `postgres:14-alpine`
- Port: 5432
- Database: taskmanager
- User: postgres
- Password: postgres
- Volume: `postgres_data` for data persistence

### 2. Backend API (`backend`)
- Built from: `./backend/Dockerfile`
- Port: 5000
- Environment: Production
- Dependencies: PostgreSQL
- Auto-restart: enabled

### 3. Frontend (`frontend`)
- Built from: `./frontend/Dockerfile`
- Port: 3000 (mapped to nginx port 80)
- Multi-stage build: Node.js build + Nginx serve
- Dependencies: Backend API
- Auto-restart: enabled

## Configuration

### Environment Variables

You can customize environment variables in `docker-compose.yml`:

```yaml
backend:
  environment:
    NODE_ENV: production
    PORT: 5000
    DB_HOST: postgres
    DB_PORT: 5432
    DB_NAME: taskmanager
    DB_USER: postgres
    DB_PASSWORD: postgres
    JWT_SECRET: your_jwt_secret_key_change_in_production
    JWT_EXPIRES_IN: 7d
```

**Important**: Change `JWT_SECRET` to a secure random string for production use.

### Ports

Default ports can be changed in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "5432:5432"  # Change first number to use different host port
  
  backend:
    ports:
      - "5000:5000"
  
  frontend:
    ports:
      - "3000:80"
```

## Database Initialization

The database is automatically initialized on first start using the SQL script:
- Location: `backend/src/utils/init-db.sql`
- Creates all tables: users, tasks, comments, activity_logs
- Creates indexes for better performance

## Networking

All services are connected via a custom Docker network (`taskmanager-network`):
- Services can communicate using service names as hostnames
- Frontend proxies API requests to backend
- Backend connects to database using hostname `postgres`

## Volumes

### Persistent Data

Database data is stored in a Docker volume:
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect task-manager_postgres_data

# Remove volume (deletes all data)
docker volume rm task-manager_postgres_data
```

## Development vs Production

### Development Mode

For development with hot-reload:
```bash
# Use the standard setup (not Docker)
npm run install-all
npm run dev
```

### Production Mode

Docker setup is optimized for production:
- Multi-stage builds for minimal image size
- Nginx serves static frontend files
- Production Node.js environment
- Health checks enabled
- Auto-restart on failure

## Troubleshooting

### Service Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

**Check if ports are available:**
```bash
# Check if ports 3000, 5000, 5432 are in use
lsof -i :3000
lsof -i :5000
lsof -i :5432
```

### Database Connection Issues

**Verify database is ready:**
```bash
docker-compose exec postgres pg_isready -U postgres
```

**Check database tables:**
```bash
docker-compose exec postgres psql -U postgres -d taskmanager -c "\dt"
```

### Backend Can't Connect to Database

1. Ensure PostgreSQL is healthy:
   ```bash
   docker-compose ps
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

### Frontend Can't Connect to Backend

1. Check if backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. Verify nginx configuration:
   ```bash
   docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
   ```

### Out of Disk Space

**Clean up Docker resources:**
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (careful!)
docker system prune -a --volumes
```

## Building Individual Images

### Backend Only

```bash
cd backend
docker build -t taskmanager-backend .
docker run -p 5000:5000 --env-file .env taskmanager-backend
```

### Frontend Only

```bash
cd frontend
docker build -t taskmanager-frontend .
docker run -p 3000:80 taskmanager-frontend
```

## Health Checks

### PostgreSQL Health Check

Automatic health check runs every 10 seconds:
```bash
pg_isready -U postgres
```

### Backend Health Check

Manual check:
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

### Frontend Health Check

```bash
curl http://localhost:3000
```

Should return the HTML page.

## Performance Optimization

### Build Cache

Docker uses layer caching. To maximize cache hits:
- Package files are copied first
- Dependencies are installed before copying source code
- Only source code changes trigger rebuild of final layers

### Image Sizes

Optimized image sizes:
- PostgreSQL: ~230 MB (alpine)
- Backend: ~150 MB (node:16-alpine + app)
- Frontend: ~25 MB (nginx:alpine + static files)

## Security Considerations

### For Production Deployment

1. **Change default passwords**:
   ```yaml
   POSTGRES_PASSWORD: use_strong_password_here
   JWT_SECRET: use_long_random_string_here
   ```

2. **Use environment files**:
   ```bash
   # Create .env file
   echo "POSTGRES_PASSWORD=secure_password" > .env
   
   # Reference in docker-compose.yml
   env_file:
     - .env
   ```

3. **Don't expose database port**:
   ```yaml
   postgres:
     # Remove or comment out ports section
     # ports:
     #   - "5432:5432"
   ```

4. **Enable HTTPS**:
   - Use reverse proxy (Nginx, Traefik, Caddy)
   - Configure SSL certificates
   - Update nginx.conf for HTTPS

5. **Limit resource usage**:
   ```yaml
   backend:
     deploy:
       resources:
         limits:
           cpus: '1'
           memory: 512M
   ```

## Backup and Restore

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres taskmanager > backup.sql

# Or with docker run
docker run --rm --network task-manager_taskmanager-network \
  -v $(pwd):/backup postgres:14-alpine \
  pg_dump -h postgres -U postgres taskmanager > /backup/backup.sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T postgres psql -U postgres taskmanager < backup.sql
```

## Scaling

### Multiple Backend Instances

```bash
docker-compose up -d --scale backend=3
```

Add a load balancer (nginx, HAProxy) to distribute requests.

## CI/CD Integration

### Build Images in CI

```yaml
# Example GitHub Actions
- name: Build Docker images
  run: docker-compose build

- name: Push to registry
  run: |
    docker tag taskmanager-backend registry.example.com/taskmanager-backend
    docker push registry.example.com/taskmanager-backend
```

## Monitoring

### Container Stats

```bash
docker stats
```

### Resource Usage

```bash
docker-compose top
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Node.js Docker Hub](https://hub.docker.com/_/node)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

## Support

For issues related to Docker setup:
1. Check the troubleshooting section above
2. Review Docker logs
3. Open an issue on GitHub with logs and error messages

---

**Quick Commands Summary:**

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Clean up (including data)
docker-compose down -v
```
