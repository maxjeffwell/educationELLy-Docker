# Docker Setup for educationELLy

This guide explains how to run the educationELLy application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

Check your versions:
```bash
docker --version
docker-compose --version
```

## Project Structure

```
educationELLy/
├── docker-compose.yml              # Orchestrates all services
├── .env                            # Your environment variables (not in git)
├── .env.example                    # Template for environment variables
├── full-stack-capstone-client/
│   ├── Dockerfile                  # Client container configuration
│   └── .dockerignore              # Files to exclude from client build
└── full-stack-capstone-server/
    ├── Dockerfile                  # Server container configuration
    └── .dockerignore              # Files to exclude from server build
```

## Initial Setup

### 1. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/educationelly?retryWrites=true&w=majority
JWT_SECRET=your-secure-secret-key-here
```

**To generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

### 2. Configure MongoDB Atlas

1. Log in to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to your cluster's Network Access settings
3. Add your IP address or allow access from anywhere (0.0.0.0/0) for development
4. Get your connection string from the "Connect" button
5. Replace `<password>` in the connection string with your actual password
6. Update `MONGODB_URI` in your `.env` file

## Running the Application

### Start All Services

From the project root directory:

```bash
docker-compose up
```

This will:
- Build the client and server Docker images (first time only)
- Start the React client on http://localhost:3000
- Start the Express server on http://localhost:8080
- Connect to your MongoDB Atlas database

**Run in detached mode (background):**
```bash
docker-compose up -d
```

### Stop All Services

```bash
docker-compose down
```

**Stop and remove volumes:**
```bash
docker-compose down -v
```

## Common Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f server
docker-compose logs -f client
```

### Rebuild Containers

**Rebuild all:**
```bash
docker-compose up --build
```

**Rebuild specific service:**
```bash
docker-compose up --build server
```

### Access Container Shell

**Server:**
```bash
docker-compose exec server sh
```

**Client:**
```bash
docker-compose exec client sh
```

### Restart a Service

```bash
docker-compose restart server
docker-compose restart client
```

## Development Workflow

### Hot Reloading

Both services are configured with hot reloading:
- **Client**: Changes to files in `full-stack-capstone-client/src` will automatically reload
- **Server**: Changes to files in `full-stack-capstone-server` will automatically restart (using nodemon)

### Installing New Dependencies

**Option 1: Rebuild container (recommended)**
```bash
docker-compose down
docker-compose up --build
```

**Option 2: Install inside running container**
```bash
docker-compose exec server npm install package-name
docker-compose exec client npm install package-name
```

Then rebuild to persist changes:
```bash
docker-compose up --build
```

## Production Build

### Build Production Images

Update `docker-compose.yml` to use production targets:

```yaml
services:
  server:
    build:
      target: production  # Change from development
  client:
    build:
      target: production  # Change from development
```

Then build:
```bash
docker-compose -f docker-compose.yml build
```

### Run Production Containers

```bash
docker-compose -f docker-compose.yml up -d
```

## Troubleshooting

### Port Already in Use

If you get port binding errors:

**Check what's using the port:**
```bash
lsof -i :3000  # Client
lsof -i :8080  # Server
```

**Stop conflicting processes or change ports in docker-compose.yml:**
```yaml
ports:
  - "3001:3000"  # Map to different host port
```

### Database Connection Issues

1. Verify MongoDB Atlas connection string in `.env`
2. Check Network Access whitelist in MongoDB Atlas
3. Ensure your IP address is allowed
4. Test connection string with MongoDB Compass

### Container Won't Start

**Check logs:**
```bash
docker-compose logs server
docker-compose logs client
```

**Remove all containers and rebuild:**
```bash
docker-compose down -v
docker-compose up --build
```

### node_modules Issues

If you're getting dependency errors:

```bash
docker-compose down
docker volume prune -f
docker-compose up --build
```

### Permission Issues on Linux

If you get permission errors on Linux:

```bash
sudo chown -R $USER:$USER .
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT token signing | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `REACT_APP_API_URL` | API endpoint for client | `http://localhost:8080` |

## Production Deployment

### Production Configuration Files

The production setup includes:
- `docker-compose.prod.yml` - Production orchestration with nginx reverse proxy
- `.env.production` - Production environment variables (create from `.env.production.example`)
- `nginx/nginx.conf` - Nginx configuration with SSL support and rate limiting
- `scripts/deploy-production.sh` - Automated production deployment script

### Setting Up Production

**1. Create production environment file:**
```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your production values:
```env
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/production-db
JWT_SECRET=<generate-new-secret-with-openssl-rand-base64-64>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```

**IMPORTANT:**
- Use a separate production database, not your development database
- Generate a new, different JWT secret for production
- Use strong passwords and keep credentials secure

**2. (Optional) Add SSL Certificates:**

For HTTPS support, add your SSL certificates:
```bash
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem
```

Then uncomment the HTTPS server block in `nginx/nginx.conf`.

For free SSL certificates, use [Let's Encrypt](https://letsencrypt.org/) or [Certbot](https://certbot.eff.org/).

**3. Deploy to Production:**

Using the deployment script:
```bash
./scripts/deploy-production.sh
```

Or manually:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Production Features

**Nginx Reverse Proxy:**
- Routes `/api` to the Express server
- Routes `/` to the React client
- Rate limiting (10 req/s for API, 100 req/s for general)
- Gzip compression
- Health check endpoint at `/health`
- SSL/TLS support (when configured)
- Security headers

**Optimized Containers:**
- Multi-stage builds with production targets
- No development dependencies
- Non-root users for security
- Health checks for all services
- Log rotation (10MB max, 3 files)
- Automatic restart on failure

**Resource Management:**
- Exposed ports only (not published) for security
- Internal Docker network
- No volume mounts (immutable containers)

### Production Commands

**View logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml logs -f server
docker-compose -f docker-compose.prod.yml logs -f client
docker-compose -f docker-compose.prod.yml logs -f nginx
```

**Check status:**
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost/health
```

**Update application:**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

**Stop production:**
```bash
docker-compose -f docker-compose.prod.yml down
```

### Production Checklist

Before deploying to production:

- [ ] Use separate production MongoDB database
- [ ] Generate new JWT secret (different from development)
- [ ] Update ALLOWED_ORIGINS with your production domain
- [ ] Configure SSL certificates for HTTPS
- [ ] Set up MongoDB Atlas IP whitelist for production servers
- [ ] Test all functionality in staging environment
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for database
- [ ] Review and update nginx security settings
- [ ] Set up CI/CD pipeline (optional)

### Security Best Practices

1. **Never commit `.env.production` to version control**
2. **Use strong, unique passwords for production**
3. **Enable SSL/TLS for production**
4. **Keep Docker images updated** (`docker-compose pull`)
5. **Monitor logs regularly** for suspicious activity
6. **Use MongoDB Atlas IP whitelist** instead of 0.0.0.0/0
7. **Enable MongoDB authentication** (Atlas has this by default)
8. **Implement rate limiting** (included in nginx config)
9. **Use firewall rules** to restrict access
10. **Regular security audits** and dependency updates

### Differences: Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| **Hot Reloading** | ✅ Yes | ❌ No |
| **Volume Mounts** | ✅ Yes | ❌ No |
| **Source Maps** | ✅ Yes | ⚠️ Optional |
| **Minification** | ❌ No | ✅ Yes |
| **Reverse Proxy** | ❌ No | ✅ Nginx |
| **SSL/HTTPS** | ❌ No | ✅ Yes |
| **Rate Limiting** | ❌ No | ✅ Yes |
| **Health Checks** | ⚠️ Optional | ✅ Yes |
| **Log Rotation** | ❌ No | ✅ Yes |
| **Auto Restart** | ⚠️ unless-stopped | ✅ always |

## Next Steps: Kubernetes Deployment

After successfully running with Docker Compose in production, you can deploy to DigitalOcean Kubernetes:

1. Push images to a container registry (Docker Hub, DigitalOcean Container Registry)
2. Create Kubernetes manifests (deployments, services, ingress)
3. Set up DigitalOcean Kubernetes cluster
4. Deploy using `kubectl apply`
5. Configure cert-manager for automatic SSL certificates
6. Set up horizontal pod autoscaling

See `KUBERNETES.md` (coming soon) for detailed instructions.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL certificates
- [Best Practices for Node.js in Docker](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [OWASP Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
