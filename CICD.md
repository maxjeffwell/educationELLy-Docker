# CI/CD Documentation

This document explains the GitHub Actions CI/CD pipeline for educationELLy.

## Overview

The CI/CD pipeline consists of three main workflows:

1. **CI (Continuous Integration)** - Runs tests, linting, and Docker build checks
2. **Docker Build & Push** - Builds and publishes Docker images to Docker Hub
3. **Deploy** - Deploys the application to staging or production environments

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via workflow dispatch

**Jobs:**
- `test-server` - Tests and lints the Express backend
- `test-client` - Tests, lints, and builds the React frontend
- `docker-build-check` - Verifies Docker images build successfully
- `ci-success` - Summary job that confirms all checks passed

**What it does:**
- Installs dependencies with `npm ci`
- Runs ESLint for code quality
- Executes tests (if present)
- Builds production artifacts
- Validates Docker builds without pushing

### 2. Docker Build & Push (`.github/workflows/docker-build.yml`)

**Triggers:**
- Push to `main` branch
- Git tags matching `v*.*.*` pattern (e.g., v1.0.0)
- Manual trigger via workflow dispatch

**Jobs:**
- `build-and-push` - Builds multi-platform Docker images and pushes to Docker Hub
- `security-scan` - Scans images for vulnerabilities using Trivy

**Features:**
- Multi-platform builds (linux/amd64, linux/arm64)
- Automatic tagging based on branch, tag, or commit SHA
- Build caching for faster builds
- Security scanning with vulnerability reports

**Image tags generated:**
- `latest` - Latest build from main branch
- `main` - Current main branch
- `v1.2.3` - Semantic version tags
- `main-abc1234` - Branch with commit SHA

### 3. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Manual trigger only (workflow dispatch)

**Inputs:**
- `environment` - staging or production
- `version` - Docker image tag to deploy (default: latest)

**Deployment Methods:**

**Option A: SSH Deployment (VPS/Droplet)**
- Connects to server via SSH
- Pulls latest code and Docker images
- Restarts containers with docker-compose
- Cleans up old images

**Option B: Kubernetes Deployment**
- Updates Kubernetes deployments
- Rolls out new image versions
- (Coming soon - requires K8s manifests)

**Option C: DigitalOcean App Platform**
- Triggers deployment via DO API
- Managed platform handles the rest

**Post-Deployment:**
- Health check to verify application is running
- Automatic rollback notification on failure

## Setup Instructions

### 1. Create Docker Hub Account

1. Sign up at https://hub.docker.com
2. Create two repositories:
   - `educationelly-server`
   - `educationelly-client`
3. Generate an access token:
   - Account Settings → Security → New Access Token
   - Name: `github-actions`
   - Access: Read & Write
   - Save the token securely

### 2. Configure GitHub Secrets

Go to your repository on GitHub:
**Settings → Secrets and variables → Actions → New repository secret**

#### Required Secrets for Docker Build:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `maxjeffwell` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_abc123...` |

#### Optional Secrets for CI:

| Secret Name | Description |
|------------|-------------|
| `MONGODB_URI_TEST` | Test database connection string (optional) |

#### Required Secrets for Deployment (SSH Method):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SSH_HOST` | Server hostname or IP | `123.45.67.89` |
| `SSH_USERNAME` | SSH username | `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH private key | Full contents of `~/.ssh/id_rsa` |
| `SSH_PORT` | SSH port (optional) | `22` |
| `DEPLOY_PATH` | Path to app on server | `/home/ubuntu/educationELLy-Docker` |
| `APP_URL` | Application URL for health checks | `https://yourdomain.com` |

#### Repository Variables:

Go to **Settings → Secrets and variables → Actions → Variables**

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `DEPLOY_METHOD` | Deployment method to use | `ssh`, `kubernetes`, or `app-platform` |

### 3. Configure GitHub Environments (Optional but Recommended)

Create environments for staging and production with protection rules:

1. Go to **Settings → Environments**
2. Click **New environment**
3. Name: `production` (and repeat for `staging`)
4. Configure protection rules:
   - ✅ Required reviewers (select team members)
   - ✅ Wait timer (e.g., 5 minutes)
   - ✅ Deployment branches (only `main`)

Add environment-specific secrets:
- `SSH_HOST` (different for staging vs production)
- `APP_URL` (different for staging vs production)

### 4. SSH Key Setup (for SSH Deployment)

On your local machine:

```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions

# Copy public key to server
ssh-copy-id -i ~/.ssh/github-actions.pub user@your-server

# Test connection
ssh -i ~/.ssh/github-actions user@your-server

# Copy private key contents for GitHub secret
cat ~/.ssh/github-actions
```

Copy the **entire private key** (including `-----BEGIN` and `-----END` lines) to the `SSH_PRIVATE_KEY` secret.

### 5. Server Preparation (for SSH Deployment)

On your deployment server:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Clone repository
git clone https://github.com/maxjeffwell/educationELLy-Docker.git
cd educationELLy-Docker

# Create production environment file
cp .env.production.example .env.production
nano .env.production  # Add your production values

# Test deployment manually first
docker-compose -f docker-compose.prod.yml up -d
```

## Usage

### Running CI Checks

CI runs automatically on every push and pull request. To manually trigger:

1. Go to **Actions** tab
2. Select **CI - Test and Lint**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Building and Pushing Docker Images

**Automatic (on push to main):**
```bash
git push origin main
```

**Manual trigger:**
1. Go to **Actions** tab
2. Select **Docker Build & Push**
3. Click **Run workflow**
4. Choose whether to push images
5. Click **Run workflow**

**Using version tags:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

This will build and push images tagged as:
- `v1.0.0`
- `1.0`
- `1`
- `latest`

### Deploying to Environments

Deployment is always manual for safety:

1. Go to **Actions** tab
2. Select **Deploy**
3. Click **Run workflow**
4. Select:
   - Environment: `staging` or `production`
   - Version: `latest`, `v1.0.0`, or commit SHA
5. Click **Run workflow**

**For production deployments:**
- Approvals may be required (if configured)
- Health checks run automatically after deployment
- Failed health checks trigger alerts

## Workflow Diagram

```
┌─────────────────┐
│  Push to main   │
│   or PR create  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Workflow   │
│                 │
│ 1. Test server  │
│ 2. Test client  │
│ 3. Docker check │
└────────┬────────┘
         │
    ✅ Success
         │
         ▼
┌─────────────────┐
│  Docker Build   │  (only on push to main)
│    & Push       │
│                 │
│ 1. Build images │
│ 2. Push to Hub  │
│ 3. Scan vulns   │
└────────┬────────┘
         │
    ✅ Images ready
         │
         ▼
┌─────────────────┐
│  Manual Deploy  │  (workflow dispatch)
│                 │
│ 1. SSH to server│
│ 2. Pull images  │
│ 3. Restart app  │
│ 4. Health check │
└─────────────────┘
```

## Best Practices

### Branch Strategy

1. **Feature branches** → PR to `develop`
   - CI runs on every push
   - No Docker builds

2. **Develop branch** → PR to `main`
   - Full CI suite runs
   - Docker images can be built for testing

3. **Main branch** → Protected
   - Requires PR approval
   - CI must pass before merge
   - Automatic Docker builds on merge
   - Deploy manually after verification

### Version Tagging

Use semantic versioning for releases:

```bash
# Patch release (bug fixes)
git tag v1.0.1

# Minor release (new features)
git tag v1.1.0

# Major release (breaking changes)
git tag v2.0.0

# Push tags
git push origin --tags
```

### Rollback Strategy

If deployment fails or issues arise:

1. **Quick rollback** - Deploy previous version:
   ```
   Actions → Deploy → Run workflow → Version: v1.0.0
   ```

2. **Emergency rollback** - SSH to server:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   git checkout v1.0.0
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Security Considerations

- ✅ Never commit secrets to the repository
- ✅ Use separate databases for test/staging/production
- ✅ Rotate SSH keys and tokens periodically
- ✅ Review security scan results from Trivy
- ✅ Use environment protection rules for production
- ✅ Enable branch protection on main
- ✅ Require status checks to pass before merge

## Monitoring and Alerts

### GitHub Actions Email Notifications

By default, you'll receive email notifications for:
- Failed workflow runs
- Deployment approvals (if required)

Configure in **Settings → Notifications**

### Adding Slack Notifications (Optional)

Add to the end of any workflow job:

```yaml
- name: Slack notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to ${{ github.event.inputs.environment }} ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

Create Slack webhook at: https://api.slack.com/messaging/webhooks

## Troubleshooting

### CI Fails: "npm ci" errors

**Cause:** package-lock.json out of sync

**Solution:**
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
```

### Docker Build Fails: Permission denied

**Cause:** Docker Hub authentication failed

**Solution:**
1. Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
2. Regenerate Docker Hub token if expired
3. Check token has read & write permissions

### Deployment Fails: SSH connection refused

**Cause:** SSH key or host issues

**Solution:**
1. Verify SSH_HOST is correct
2. Check SSH_PRIVATE_KEY contains full key (including headers)
3. Ensure server's `authorized_keys` has the public key
4. Test SSH manually: `ssh -i key user@host`

### Health Check Fails After Deployment

**Cause:** Application not ready or not healthy

**Solution:**
1. Check application logs: `docker-compose logs -f`
2. Verify environment variables on server
3. Check database connection
4. Increase wait time before health check (currently 30s)

## Next Steps

- [ ] Set up GitHub secrets
- [ ] Configure Docker Hub repositories
- [ ] Test CI workflow with a PR
- [ ] Build and push Docker images
- [ ] Prepare deployment server
- [ ] Configure SSH access
- [ ] Test deployment to staging
- [ ] Configure production environment
- [ ] Set up monitoring and alerts
- [ ] Document runbook for common issues

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Semantic Versioning](https://semver.org/)
- [SSH Key Management](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-protection-rules)
