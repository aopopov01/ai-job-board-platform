# Deployment Guide

This guide covers deploying the AI-powered job board platform to production.

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 18+ (for manual deployment)
- Supabase account and project
- OpenAI API key
- Domain name (optional, for custom domains)

## Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration
OPENAI_API_KEY=your-openai-api-key

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Security
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Performance
REDIS_URL=redis://redis:6379

# Email (optional)
RESEND_API_KEY=your-resend-api-key

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

## Database Setup

1. **Create Supabase Project**:
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Initialize project
   supabase init
   
   # Link to your project
   supabase link --project-ref your-project-ref
   ```

2. **Run Database Migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Seed Initial Data** (optional):
   ```bash
   npm run db:seed
   ```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Build and start services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Verify deployment**:
   ```bash
   docker-compose ps
   docker-compose logs web
   ```

3. **Access the application**:
   - Web: http://localhost:3000
   - Mobile: Use Expo Go app with the displayed QR code

### Option 2: Manual Deployment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm run start
   ```

### Option 3: Cloud Platform Deployment

#### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

#### Railway Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway deploy
   ```

#### AWS/GCP/Azure

Use the provided Dockerfile with your preferred cloud container service.

## Production Checklist

### Security
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS policies
- [ ] Set up rate limiting (configured in nginx.conf)
- [ ] Enable CSP headers (configured in next.config.js)
- [ ] Rotate API keys regularly
- [ ] Configure Supabase RLS policies

### Performance
- [ ] Enable Redis caching
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Enable gzip compression
- [ ] Optimize images and assets

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure application metrics
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for critical errors

### Backup
- [ ] Configure automated database backups
- [ ] Set up file storage backups
- [ ] Test backup restoration process

## Health Checks

The application includes health check endpoints:

- **Web App**: `GET /api/health`
- **Database**: Automatic connection testing
- **Redis**: Connection status monitoring

## Scaling

### Horizontal Scaling
```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  web:
    deploy:
      replicas: 3
  nginx:
    ports:
      - "80:80"
      - "443:443"
```

### Load Balancing
Configure nginx for load balancing multiple web instances:

```nginx
upstream web_servers {
    server web_1:3000;
    server web_2:3000;
    server web_3:3000;
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   ```bash
   # Check Supabase connectivity
   curl -I https://your-project.supabase.co
   
   # Verify environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Build Failures**:
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

3. **Performance Issues**:
   ```bash
   # Check Redis connection
   docker-compose exec redis redis-cli ping
   
   # Monitor container resources
   docker stats
   ```

### Logs

Access application logs:
```bash
# Web application logs
docker-compose logs -f web

# Database logs
docker-compose logs -f postgres

# Nginx logs
docker-compose logs -f nginx
```

## Maintenance

### Regular Tasks

1. **Update dependencies** (monthly):
   ```bash
   npm update
   npm audit fix
   ```

2. **Database maintenance** (weekly):
   ```bash
   # Backup database
   npm run db:backup
   
   # Analyze performance
   npm run db:analyze
   ```

3. **Security updates** (as needed):
   ```bash
   # Update Docker images
   docker-compose pull
   docker-compose up -d
   ```

## Support

For deployment issues:

1. Check the application logs first
2. Verify all environment variables are set
3. Ensure database connectivity
4. Check system resource usage
5. Review security settings

## Performance Benchmarks

Expected performance metrics:
- Page load time: < 2 seconds
- API response time: < 500ms
- Time to Interactive: < 3 seconds
- Core Web Vitals: All green

Monitor these metrics and optimize as needed.