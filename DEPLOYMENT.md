# Kernel Studio - Deployment Guide

## Production Deployment

### Prerequisites
- Node.js 18+ LTS
- PostgreSQL 12+
- npm or yarn
- Git

### Step 1: Clone and Setup

```bash
git clone <repository-url>
cd kernel-studio
npm install
```

### Step 2: Environment Configuration

Create a `.env.local` file:

```env
# Database
PGUSER=postgres
PGPASSWORD=your_secure_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=kernel_studio

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Step 3: Database Setup

```bash
# Create database
createdb -h $PGHOST -U $PGUSER $PGDATABASE

# Apply schema
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f schema.sql

# Seed demo data (optional)
PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f seed.sql
```

### Step 4: Build

```bash
npm run build
```

### Step 5: Start Production Server

```bash
npm run start
```

The application will be available at `http://localhost:3000`

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${PGPASSWORD}
      POSTGRES_DB: kernel_studio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      PGUSER: postgres
      PGPASSWORD: ${PGPASSWORD}
      PGHOST: postgres
      PGPORT: 5432
      PGDATABASE: kernel_studio
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
docker-compose up -d
```

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `PGUSER`
   - `PGPASSWORD`
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`

### Step 3: Deploy

Click "Deploy" - Vercel will automatically build and deploy your application.

## AWS Deployment

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 kernel-studio

# Create environment
eb create kernel-studio-env

# Deploy
eb deploy
```

### Using EC2

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PostgreSQL
sudo yum install -y postgresql-server

# Clone repository
git clone <repository-url>
cd kernel-studio

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "kernel-studio" -- start
pm2 startup
pm2 save
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_kernels_team_id ON kernels(team_id);
CREATE INDEX idx_contradictions_kernel_id ON contradictions(kernel_id);
CREATE INDEX idx_chat_threads_kernel_id ON chat_threads(kernel_id);
CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);

-- Analyze tables
ANALYZE kernels;
ANALYZE contradictions;
ANALYZE chat_threads;
ANALYZE chat_messages;
```

### 2. Connection Pooling

Update `app/api/` routes to use connection pooling:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool
```

### 3. Caching

Add Redis caching for frequently accessed data:

```typescript
import { createClient } from 'redis'

const redis = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
})

// Cache kernel data
const cacheKey = `kernel:${kernelId}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

// Fetch and cache
const data = await fetchKernel(kernelId)
await redis.setex(cacheKey, 3600, JSON.stringify(data))
return data
```

## Monitoring

### Application Monitoring

```bash
# Install PM2 Plus
pm2 install pm2-auto-pull
pm2 install pm2-logrotate

# Monitor
pm2 monit
```

### Database Monitoring

```sql
-- Check slow queries
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Backup and Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/kernel-studio"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/kernel_studio_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE > $BACKUP_FILE

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Schedule with cron:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < backup_file.sql
```

## Security

### 1. Environment Variables

Never commit sensitive data. Use `.env.local` (gitignored):

```bash
echo ".env.local" >> .gitignore
```

### 2. Database Security

```sql
-- Create restricted user
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE kernel_studio TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### 3. HTTPS

Use Let's Encrypt with Certbot:

```bash
sudo certbot certonly --standalone -d your-domain.com
```

Configure in nginx:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "SELECT 1"

# Check logs
tail -f /var/log/postgresql/postgresql.log
```

### Application Crashes

```bash
# Check PM2 logs
pm2 logs kernel-studio

# Restart
pm2 restart kernel-studio
```

### Memory Issues

```bash
# Monitor memory usage
free -h

# Increase Node.js heap
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use nginx or AWS ELB
2. **Multiple Instances**: Deploy app on multiple servers
3. **Shared Database**: Use single PostgreSQL instance
4. **Session Storage**: Use Redis for session management

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Implement caching layer
4. Use CDN for static assets

## Maintenance

### Regular Tasks

- Monitor disk space
- Review and optimize slow queries
- Update dependencies: `npm update`
- Backup database daily
- Review application logs
- Monitor error rates

### Update Procedure

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations if needed
npm run migrate

# Build
npm run build

# Restart
pm2 restart kernel-studio
```

## Support

For issues or questions:
- Email: ryan@datingappelites.com
- GitHub Issues: [repository-url]/issues
