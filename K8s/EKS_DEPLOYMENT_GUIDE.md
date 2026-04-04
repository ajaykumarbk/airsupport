# AWS EKS Deployment Guide

## Prerequisites
- AWS CLI configured with your credentials
- `kubectl` installed
- `eksctl` installed
- Cloudflare account with datanetwork.online domain
- Docker Hub images pushed (ajaykumara/gw-backend:latest, ajaykumara/gw-frontend:latest)

---

## 1. Create EKS Cluster

```bash
# Create EKS cluster (takes 10-15 minutes)
eksctl create cluster \
  --name gw-app-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 2 \
  --nodes-max 4

# Verify cluster
kubectl get nodes
kubectl get pods --all-namespaces
```

---

## 2. Install Nginx Ingress Controller

```bash
# Add Helm repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install Nginx Ingress
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Get Load Balancer DNS (use this for Cloudflare)
kubectl get svc -n ingress-nginx
# Copy the EXTERNAL-IP of nginx-ingress-ingress-nginx-controller
```

---

## 3. Setup Cloudflare DNS

1. Go to Cloudflare Dashboard
2. Select your zone (datanetwork.online)
3. Go to DNS Records
4. Create CNAME record:
   - Name: `admin-collab-tool`
   - Target: `<ELB_DNS_FROM_STEP_2>` (e.g., a1234567-123456789.us-east-1.elb.amazonaws.com)
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

**Wait 5-10 minutes for DNS propagation**

---

## 4. Install cert-manager (for HTTPS)

```bash
# Add Helm repo
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Verify installation
kubectl get pods -n cert-manager
```

---

## 5. Update Kubernetes Manifests with Your Values

**Edit K8s/1-secrets.yaml** - Update these values:
```bash
DB_HOST: "140.245.237.157"      # Your MySQL host
DB_USER: "wms_app"               # Your DB user
DB_PASSWORD: "Ajaykumar@12."     # Your DB password
JWT_SECRET: "generate-strong-secret-32-chars-minimum"
```

**Edit K8s/5-cert-issuer.yaml**:
```bash
email: your-actual-email@example.com  # For Let's Encrypt notifications
```

---

## 6. Deploy to EKS

```bash
# Create namespace and deploy all manifests
kubectl apply -f K8s/0-namespace.yaml
kubectl apply -f K8s/1-secrets.yaml
kubectl apply -f K8s/2-backend-deployment.yaml
kubectl apply -f K8s/3-frontend-deployment.yaml
kubectl apply -f K8s/5-cert-issuer.yaml
kubectl apply -f K8s/4-ingress.yaml

# Verify deployment
kubectl get all -n production
kubectl get ingress -n production
```

---

## 7. Monitor SSL Certificate Generation

```bash
# Watch cert-manager create the certificate
kubectl get certificate -n production
kubectl describe certificate app-tls-cert -n production

# Wait for Status=True (can take 2-5 minutes)
kubectl get certificate app-tls-cert -n production -w
```

---

## 8. Verify Application

```bash
# Check pod logs
kubectl logs -n production -l app=backend --tail=50
kubectl logs -n production -l app=frontend --tail=50

# Port-forward to test locally (optional)
kubectl port-forward -n production svc/backend 4000:4000
kubectl port-forward -n production svc/frontend 8080:80

# Once DNS is propagated, test:
curl https://admin-collab-tool.datanetwork.online/
curl https://admin-collab-tool.datanetwork.online/api/auth/health
```

---

## 9. Useful Commands

```bash
# View all resources
kubectl get all -n production
kubectl describe deployment backend -n production
kubectl describe ingress app-ingress -n production

# Check logs
kubectl logs -n production deployment/backend
kubectl logs -n production deployment/frontend

# Scale deployments
kubectl scale deployment/backend --replicas=3 -n production

# Update image
kubectl set image deployment/backend backend=ajaykumara/gw-backend:v2.0 -n production

# Port forward
kubectl port-forward -n production svc/backend 4000:4000

# Get shell in pod (debugging)
kubectl exec -it -n production deployment/backend -- sh
```

---

## 10. Troubleshooting

**Pods not starting?**
```bash
kubectl describe pod <pod-name> -n production
kubectl logs <pod-name> -n production
```

**SSL certificate not issuing?**
```bash
kubectl describe certificaterequest -n production
kubectl logs -n cert-manager deployment/cert-manager
```

**Can't access application?**
```bash
# Check ingress
kubectl describe ingress app-ingress -n production

# Check load balancer
kubectl get svc -n ingress-nginx

# Verify DNS
nslookup admin-collab-tool.datanetwork.online
```

**ImagePullBackOff error?**
- Verify Docker Hub images: `docker pull ajaykumara/gw-backend:latest`
- Check image name in manifests matches exactly

---

## 11. Cleanup (if needed)

```bash
# Delete EKS cluster
eksctl delete cluster --name gw-app-cluster --region us-east-1

# Or just delete resources
kubectl delete namespace production
```

---

## Final Checklist

- [x] EKS cluster created
- [ ] Nginx Ingress Controller installed
- [ ] Cloudflare DNS configured (CNAME record added)
- [ ] cert-manager installed
- [ ] K8s manifests updated with your secrets
- [ ] All manifests deployed (`kubectl apply`)
- [ ] Pods running (`kubectl get pods -n production`)
- [ ] Certificate issued (`kubectl get certificate -n production`)
- [ ] DNS propagated (nslookup check)
- [ ] HTTPS working (curl https://admin-collab-tool.datanetwork.online)
