# Kubernetes Deployment Guide

This guide explains how to deploy educationELLy to Kubernetes, specifically optimized for DigitalOcean Kubernetes (DOKS).

## Prerequisites

- Docker images published to Docker Hub
- Kubernetes cluster (DOKS, EKS, GKE, or local)
- `kubectl` CLI installed and configured
- `doctl` (DigitalOcean CLI) for DOKS
- Domain name with DNS access

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Ingress (nginx)     │  ← SSL/TLS Termination
            │  + cert-manager      │     (Let's Encrypt)
            └──────────┬───────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌────────────────┐          ┌────────────────┐
│  Client Pods   │          │  Server Pods   │
│  (React SPA)   │          │  (Express API) │
│  Replicas: 2-10│          │  Replicas: 2-10│
└────────────────┘          └───────┬────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ MongoDB Atlas │
                            │  (External)   │
                            └───────────────┘
```

## Directory Structure

```
k8s/
├── base/                          # Base manifests (environment-agnostic)
│   ├── namespace.yaml             # Namespace definition
│   ├── configmap.yaml             # Non-sensitive configuration
│   ├── secret.example.yaml        # Secret template (DO NOT commit real secrets)
│   ├── deployment-server.yaml     # Server deployment
│   ├── deployment-client.yaml     # Client deployment
│   ├── service-server.yaml        # Server service
│   ├── service-client.yaml        # Client service
│   ├── ingress.yaml               # Ingress with SSL
│   ├── hpa-server.yaml            # Horizontal Pod Autoscaler (server)
│   ├── hpa-client.yaml            # Horizontal Pod Autoscaler (client)
│   ├── cluster-issuer.yaml        # Cert-manager for SSL
│   └── kustomization.yaml         # Kustomize config
├── overlays/
│   ├── staging/                   # Staging environment overrides
│   │   └── kustomization.yaml
│   └── production/                # Production environment overrides
│       └── kustomization.yaml
└── scripts/                       # Helper scripts (coming soon)
```

## DigitalOcean Kubernetes Setup

### 1. Create DOKS Cluster

**Via Web Interface:**
1. Go to https://cloud.digitalocean.com/kubernetes/clusters
2. Click **Create Cluster**
3. Configuration:
   - **Kubernetes version**: Latest stable (1.28+)
   - **Datacenter region**: Choose closest to your users
   - **Node pool**:
     - Size: Basic ($12/month nodes) or higher
     - Count: 2-3 nodes minimum
   - **Name**: `educationelly-cluster`
4. Click **Create Cluster**
5. Wait 3-5 minutes for provisioning

**Via CLI:**
```bash
# Create cluster
doctl kubernetes cluster create educationelly-cluster \
  --region nyc1 \
  --version 1.28.2-do.0 \
  --node-pool "name=worker-pool;size=s-2vcpu-4gb;count=2;auto-scale=true;min-nodes=2;max-nodes=5"

# Get kubeconfig
doctl kubernetes cluster kubeconfig save educationelly-cluster
```

### 2. Install Required Components

**Install NGINX Ingress Controller:**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.0/deploy/static/provider/do/deploy.yaml
```

Wait for LoadBalancer IP:
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller --watch
```

**Install cert-manager (for automatic SSL):**
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Verify installation:
```bash
kubectl get pods -n cert-manager
```

### 3. Configure DNS

Get the LoadBalancer IP:
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Add DNS A records:
- `yourdomain.com` → LoadBalancer IP
- `www.yourdomain.com` → LoadBalancer IP

Verify DNS propagation:
```bash
dig yourdomain.com +short
```

## Deployment Steps

### 1. Clone Repository

```bash
git clone https://github.com/maxjeffwell/educationELLy-Docker.git
cd educationELLy-Docker/k8s
```

### 2. Create Secrets

**IMPORTANT: Never commit secrets to git!**

Create the secrets in Kubernetes:

```bash
# Base64 encode your values
echo -n 'mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority' | base64
echo -n 'your-jwt-secret-key-here' | base64

# Create secret manually
kubectl create namespace educationelly

kubectl create secret generic educationelly-secrets \
  --from-literal=mongodb-uri='mongodb+srv://user:pass@cluster.mongodb.net/db' \
  --from-literal=jwt-secret='your-jwt-secret-here' \
  --namespace=educationelly
```

**Verify secret:**
```bash
kubectl get secrets -n educationelly
```

### 3. Update Configuration

**Edit** `k8s/base/configmap.yaml`:
```yaml
data:
  ALLOWED_ORIGINS: "https://yourdomain.com,https://www.yourdomain.com"
  REACT_APP_API_URL: "https://yourdomain.com/api"
```

**Edit** `k8s/base/cluster-issuer.yaml`:
```yaml
email: your-email@example.com  # Your actual email
```

**Edit** `k8s/base/ingress.yaml`:
```yaml
spec:
  tls:
  - hosts:
    - yourdomain.com              # Your actual domain
    - www.yourdomain.com
  rules:
  - host: yourdomain.com          # Your actual domain
```

### 4. Deploy to Production

**Using kubectl:**
```bash
# Apply all manifests
kubectl apply -k k8s/base/

# Or apply individually
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/cluster-issuer.yaml
kubectl apply -f k8s/base/deployment-server.yaml
kubectl apply -f k8s/base/deployment-client.yaml
kubectl apply -f k8s/base/service-server.yaml
kubectl apply -f k8s/base/service-client.yaml
kubectl apply -f k8s/base/ingress.yaml
kubectl apply -f k8s/base/hpa-server.yaml
kubectl apply -f k8s/base/hpa-client.yaml
```

**Using kustomize:**
```bash
# Production
kubectl apply -k k8s/overlays/production/

# Staging
kubectl apply -k k8s/overlays/staging/
```

### 5. Verify Deployment

**Check pods:**
```bash
kubectl get pods -n educationelly
```

Expected output:
```
NAME                                    READY   STATUS    RESTARTS   AGE
educationelly-client-xxxxxx-xxxxx       1/1     Running   0          2m
educationelly-client-xxxxxx-xxxxx       1/1     Running   0          2m
educationelly-server-xxxxxx-xxxxx       1/1     Running   0          2m
educationelly-server-xxxxxx-xxxxx       1/1     Running   0          2m
```

**Check services:**
```bash
kubectl get svc -n educationelly
```

**Check ingress:**
```bash
kubectl get ingress -n educationelly
```

**Check certificate (wait 2-5 minutes for issuance):**
```bash
kubectl get certificate -n educationelly
kubectl describe certificate educationelly-tls -n educationelly
```

**View logs:**
```bash
# Server logs
kubectl logs -n educationelly -l component=server --tail=100

# Client logs
kubectl logs -n educationelly -l component=client --tail=100

# Follow logs
kubectl logs -n educationelly -l component=server -f
```

### 6. Test Application

**Check health endpoints:**
```bash
# Via port-forward
kubectl port-forward -n educationelly svc/educationelly-server 8080:8080
curl http://localhost:8080/health

kubectl port-forward -n educationelly svc/educationelly-client 3000:3000
curl http://localhost:3000/health
```

**Access application:**
```bash
# Should redirect to HTTPS
curl -I http://yourdomain.com

# Should return 200 OK
curl -I https://yourdomain.com
```

Visit: `https://yourdomain.com`

## Updating Deployment

### Update Image Tag

**Update specific image:**
```bash
kubectl set image deployment/educationelly-server \
  server=maxjeffwell/educationelly-server:v1.2.3 \
  -n educationelly

kubectl set image deployment/educationelly-client \
  client=maxjeffwell/educationelly-client:v1.2.3 \
  -n educationelly
```

**Or update via manifest:**
```bash
# Edit image tags in deployment files
vim k8s/base/deployment-server.yaml
vim k8s/base/deployment-client.yaml

# Apply changes
kubectl apply -k k8s/base/
```

### Rolling Update

Kubernetes performs rolling updates automatically:

**Watch rollout:**
```bash
kubectl rollout status deployment/educationelly-server -n educationelly
kubectl rollout status deployment/educationelly-client -n educationelly
```

**Rollout history:**
```bash
kubectl rollout history deployment/educationelly-server -n educationelly
```

**Rollback if needed:**
```bash
kubectl rollout undo deployment/educationelly-server -n educationelly
kubectl rollout undo deployment/educationelly-server -n educationelly --to-revision=2
```

## Scaling

### Manual Scaling

```bash
# Scale server
kubectl scale deployment educationelly-server --replicas=5 -n educationelly

# Scale client
kubectl scale deployment educationelly-client --replicas=5 -n educationelly
```

### Auto-Scaling (HPA)

Horizontal Pod Autoscaler is configured to scale based on CPU/memory:

**Check HPA status:**
```bash
kubectl get hpa -n educationelly
```

**View HPA details:**
```bash
kubectl describe hpa educationelly-server-hpa -n educationelly
```

**Adjust HPA:**
```yaml
# Edit hpa-server.yaml or hpa-client.yaml
spec:
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Monitoring and Troubleshooting

### Common Commands

```bash
# Get all resources
kubectl get all -n educationelly

# Describe deployment
kubectl describe deployment educationelly-server -n educationelly

# Get events
kubectl get events -n educationelly --sort-by='.lastTimestamp'

# Execute command in pod
kubectl exec -it -n educationelly <pod-name> -- /bin/sh

# Check resource usage
kubectl top pods -n educationelly
kubectl top nodes
```

### Common Issues

**Pods stuck in Pending:**
```bash
kubectl describe pod <pod-name> -n educationelly
# Check: Insufficient CPU/memory, node selector issues
```

**CrashLoopBackOff:**
```bash
kubectl logs <pod-name> -n educationelly --previous
# Check: Application errors, missing environment variables
```

**Certificate not issued:**
```bash
kubectl describe certificate educationelly-tls -n educationelly
kubectl logs -n cert-manager -l app=cert-manager
# Check: DNS configuration, ClusterIssuer setup
```

**502 Bad Gateway:**
```bash
# Check if pods are running
kubectl get pods -n educationelly

# Check pod logs
kubectl logs -n educationelly -l component=server
```

## Security Best Practices

1. **Secrets Management:**
   - Never commit secrets to git
   - Use Kubernetes Secrets or external secret managers (Sealed Secrets, External Secrets Operator)
   - Rotate secrets regularly

2. **Network Policies:**
   - Implement NetworkPolicies to restrict pod-to-pod communication
   - Only allow necessary ingress/egress traffic

3. **RBAC:**
   - Use Role-Based Access Control
   - Follow principle of least privilege
   - Create service accounts with minimal permissions

4. **Image Security:**
   - Scan images for vulnerabilities (Trivy in CI/CD)
   - Use specific image tags (not `latest`)
   - Pull from trusted registries only

5. **Pod Security:**
   - Run as non-root user (configured in deployments)
   - Drop unnecessary capabilities
   - Use read-only root filesystem where possible

## Cost Optimization

**DigitalOcean Kubernetes Pricing:**
- Cluster management: **Free**
- Nodes: Starting at **$12/month** per node
- LoadBalancer: **$12/month**

**Estimated monthly cost:**
- 2x Basic Droplets (2vCPU, 4GB): **$24**
- 1x LoadBalancer: **$12**
- **Total: ~$36/month**

**Tips to reduce costs:**
1. Use node autoscaling (only pay for what you use)
2. Set appropriate resource requests/limits
3. Use spot instances if available
4. Consolidate multiple apps on one cluster

## Backup and Disaster Recovery

**Backup strategies:**

1. **Database:** MongoDB Atlas handles backups automatically

2. **Kubernetes configs:**
   - All manifests are in git (infrastructure as code)
   - Use `kubectl get all -n educationelly -o yaml > backup.yaml`

3. **Cluster backup:** Use Velero for full cluster backups
   ```bash
   # Install Velero
   velero install --provider digitalocean --plugins velero/velero-plugin-for-aws:v1.8.0 \
     --bucket my-backup-bucket --backup-location-config region=nyc3

   # Create backup
   velero backup create educationelly-backup --include-namespaces educationelly
   ```

## CI/CD Integration

Update your GitHub Actions workflow to deploy to Kubernetes:

```yaml
# Add to .github/workflows/deploy.yml
- name: Deploy to Kubernetes
  run: |
    doctl kubernetes cluster kubeconfig save educationelly-cluster
    kubectl set image deployment/educationelly-server \
      server=${{ env.SERVER_IMAGE }}:${{ github.sha }} \
      -n educationelly
    kubectl set image deployment/educationelly-client \
      client=${{ env.CLIENT_IMAGE }}:${{ github.sha }} \
      -n educationelly
    kubectl rollout status deployment/educationelly-server -n educationelly
    kubectl rollout status deployment/educationelly-client -n educationelly
```

## Monitoring and Observability

**Recommended tools:**

1. **DigitalOcean Monitoring** (built-in, free)
   - Basic metrics for nodes and cluster

2. **Prometheus + Grafana**
   ```bash
   kubectl create namespace monitoring
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
   ```

3. **Loki for logs**
   ```bash
   helm repo add grafana https://grafana.github.io/helm-charts
   helm install loki grafana/loki-stack -n monitoring
   ```

## Migration from Heroku

**Checklist:**
- [ ] Deploy to Kubernetes (this guide)
- [ ] Test thoroughly in staging
- [ ] Update DNS to point to K8s LoadBalancer
- [ ] Monitor for 24-48 hours
- [ ] Keep Heroku running as backup
- [ ] Scale down/delete Heroku apps after confirmation

## Additional Resources

- [DigitalOcean Kubernetes Documentation](https://docs.digitalocean.com/products/kubernetes/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Ingress-NGINX Documentation](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)

## Support

For issues or questions:
- GitHub Issues: https://github.com/maxjeffwell/educationELLy-Docker/issues
- Kubernetes Slack: https://kubernetes.slack.com
- DigitalOcean Community: https://www.digitalocean.com/community

---

**Made with ❤️ for ELL educators**
