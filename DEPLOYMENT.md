# Deployment Guide

This guide covers deployment options for the Task Manager application.

## Prerequisites

- Node.js v16 or higher
- PostgreSQL v12 or higher
- Domain name (for production)
- SSL certificate (for production)

## Environment Configuration

### Production Environment Variables

**Backend (.env):**

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=your-db-user
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-very-secure-secret-key-here
JWT_EXPIRES_IN=7d

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@taskmanager.com

# CORS (set to your frontend URL)
FRONTEND_URL=https://your-domain.com
```

## Deployment Options

### Option 1: Heroku

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd backend
   heroku create task-manager-api
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   ```

6. **Create Procfile**
   ```
   web: node src/server.js
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

8. **Initialize database**
   ```bash
   heroku run npm run init-db
   ```

#### Frontend Deployment

Deploy frontend to Vercel or Netlify (see below).

### Option 2: DigitalOcean

#### 1. Create Droplet

- Choose Ubuntu 20.04 LTS
- Select appropriate size (Basic $5/mo for MVP)
- Add SSH key
- Create droplet

#### 2. Initial Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

#### 3. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE taskmanager;
CREATE USER taskmanager_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskmanager_user;
\q
```

#### 4. Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/min3754/task-manager.git
cd task-manager

# Install dependencies
npm run install-all

# Configure backend
cd backend
cp .env.example .env
nano .env  # Edit with your production values

# Initialize database
npm run init-db

# Build frontend
cd ../frontend
npm run build

# Start backend with PM2
cd ../backend
pm2 start src/server.js --name task-manager-api
pm2 save
pm2 startup
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/task-manager`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/task-manager/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/task-manager /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 6. SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

### Option 3: Vercel (Frontend) + Railway (Backend)

#### Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL service
6. Set environment variables in Railway dashboard
7. Deploy

#### Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app
   ```
6. Deploy

### Option 4: AWS

#### Backend on EC2

1. Launch EC2 instance (Ubuntu)
2. Follow similar steps as DigitalOcean above
3. Configure security groups for ports 80, 443, 5432

#### Database on RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Update backend .env with RDS endpoint

#### Frontend on S3 + CloudFront

1. Build frontend: `npm run build`
2. Create S3 bucket
3. Upload dist/ contents
4. Enable static website hosting
5. Create CloudFront distribution
6. Configure custom domain

## Post-Deployment

### Monitoring

**Using PM2:**

```bash
pm2 status
pm2 logs task-manager-api
pm2 monit
```

**Set up monitoring service:**
- New Relic
- DataDog
- Sentry for error tracking

### Backups

**Database backups:**

```bash
# Manual backup
pg_dump -U taskmanager_user taskmanager > backup.sql

# Automated daily backups (cron)
0 2 * * * pg_dump -U taskmanager_user taskmanager > /backups/taskmanager_$(date +\%Y\%m\%d).sql
```

### Maintenance

```bash
# Update application
cd /var/www/task-manager
git pull
npm run install-all
cd frontend
npm run build
cd ../backend
pm2 restart task-manager-api
```

### Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set strong JWT secret
- [ ] Use environment variables for secrets
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs
- [ ] Use strong database passwords
- [ ] Configure firewall

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, AWS ELB)
- Deploy multiple backend instances
- Use Redis for session management
- Implement caching layer

### Database Optimization

- Add indexes to frequently queried fields
- Use connection pooling
- Set up read replicas
- Regular VACUUM and ANALYZE

### CDN

- Use CloudFare or CloudFront
- Cache static assets
- Enable compression

## Troubleshooting

### Application not starting

```bash
# Check logs
pm2 logs task-manager-api

# Check if port is in use
lsof -i :5000

# Check environment variables
pm2 env 0
```

### Database connection issues

```bash
# Test connection
psql -h localhost -U taskmanager_user -d taskmanager

# Check PostgreSQL status
systemctl status postgresql
```

### Nginx issues

```bash
# Test configuration
nginx -t

# Check logs
tail -f /var/log/nginx/error.log
```

## Support

For deployment issues, please open an issue on GitHub or contact the maintainers.
