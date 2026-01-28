# ☁️ Cloud & Infrastructure as Code Security

> **Security guardrails for agent-generated infrastructure**
>
> Vibe coding extends beyond application code into Terraform, Docker, and cloud configurations.
> Agents frequently generate insecure defaults that violate least privilege.

---

## Executive Summary

AI agents generating IaC exhibit these patterns:
- **Wildcard permissions** - `Action: "*"` to make code "work"
- **Hardcoded secrets** - Credentials in config files
- **Overly permissive networks** - `0.0.0.0/0` CIDR blocks
- **Missing encryption** - Unencrypted storage by default
- **Exposed metadata** - CDE environments leaking tokens

---

## Cloud Development Environments (CDEs)

### Metadata Service Risk

CDEs (GitHub Codespaces, Google Cloud Workstations, Gitpod) run on cloud VMs with attached service accounts.

**The Risk:**
```bash
# Agent in CDE can execute this
curl -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token

# Returns: {"access_token":"ya29.XXXXXXX","expires_in":3599,"token_type":"Bearer"}
```

If the CDE service account has production permissions, an agent (or malicious code) can access production resources.

**Mitigation:**
```markdown
## CDE Security Checklist

- [ ] CDE service account has MINIMAL permissions
- [ ] No production database access from CDE
- [ ] No deployment permissions from CDE
- [ ] VPC Service Controls limit API access
- [ ] Workstation Metadata concealment enabled (if available)
```

---

## Terraform Security

### TF-001: Wildcard IAM Permissions

| Severity | 🔴 Critical |
|----------|-------------|
| Impact | Full account compromise |

**Vulnerable Pattern:**
```hcl
# Agent generates this to "make it work"
resource "aws_iam_policy" "lambda_policy" {
  name = "lambda-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "*"           # 🔴 CRITICAL
        Resource = "*"           # 🔴 CRITICAL
      }
    ]
  })
}
```

**Mitigation:**
```hcl
# ✅ Least privilege
resource "aws_iam_policy" "lambda_policy" {
  name = "lambda-policy"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.data.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          "${aws_cloudwatch_log_group.lambda.arn}:*"
        ]
      }
    ]
  })
}
```

---

### TF-002: Hardcoded Secrets

| Severity | 🔴 Critical |
|----------|-------------|
| Impact | Credential exposure in VCS |

**Vulnerable Pattern:**
```hcl
# Agent puts credentials directly in config
resource "aws_db_instance" "main" {
  identifier     = "production-db"
  engine         = "postgres"
  instance_class = "db.t3.medium"
  
  username = "admin"
  password = "SuperSecret123!"  # 🔴 CRITICAL
}

provider "aws" {
  access_key = "AKIAIOSFODNN7EXAMPLE"  # 🔴 CRITICAL
  secret_key = "wJalrXUtnFEMI/K7MDENG"  # 🔴 CRITICAL
  region     = "us-east-1"
}
```

**Mitigation:**
```hcl
# ✅ Use variables with environment/secrets manager
variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_instance" "main" {
  identifier     = "production-db"
  engine         = "postgres"
  instance_class = "db.t3.medium"
  
  username = "admin"
  password = var.db_password  # From TF_VAR_db_password or secrets
}

# ✅ Use AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db" {
  secret_id = "production/db/credentials"
}

resource "aws_db_instance" "main" {
  password = jsondecode(data.aws_secretsmanager_secret_version.db.secret_string)["password"]
}
```

---

### TF-003: Public S3 Buckets

| Severity | 🟠 High |
|----------|---------|
| Impact | Data exposure |

**Vulnerable Pattern:**
```hcl
# Agent generates for "public website hosting"
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id
  
  block_public_acls       = false  # 🟠 HIGH
  block_public_policy     = false  # 🟠 HIGH
  ignore_public_acls      = false
  restrict_public_buckets = false
}
```

**Mitigation:**
```hcl
# ✅ Private by default
resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ✅ Use CloudFront for public access
resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name = aws_s3_bucket.data.bucket_regional_domain_name
    origin_id   = "S3Origin"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }
  # ... rest of config
}
```

---

### TF-004: Unencrypted Storage

| Severity | 🟠 High |
|----------|---------|
| Impact | Data exposure at rest |

**Vulnerable Pattern:**
```hcl
# Agent omits encryption (default is unencrypted)
resource "aws_ebs_volume" "data" {
  availability_zone = "us-east-1a"
  size              = 100
  # No encryption specified = unencrypted
}

resource "aws_s3_bucket" "data" {
  bucket = "my-bucket"
  # No encryption specified
}
```

**Mitigation:**
```hcl
# ✅ Always encrypt
resource "aws_ebs_volume" "data" {
  availability_zone = "us-east-1a"
  size              = 100
  encrypted         = true
  kms_key_id        = aws_kms_key.data.arn
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.data.arn
    }
  }
}
```

---

## Docker Security

### DOCKER-001: Running as Root

| Severity | 🟠 High |
|----------|---------|
| Impact | Container escape, privilege escalation |

**Vulnerable Pattern:**
```dockerfile
# Agent generates minimal Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
# Running as root by default
```

**Mitigation:**
```dockerfile
# ✅ Non-root user
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy as root, then change ownership
COPY --chown=nextjs:nodejs . .

# Install dependencies
RUN npm ci --only=production

# Switch to non-root user
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
```

---

### DOCKER-002: Latest Tag

| Severity | 🟡 Medium |
|----------|----------|
| Impact | Unpredictable builds, supply chain |

**Vulnerable Pattern:**
```dockerfile
FROM python:latest  # 🟡 Unpredictable
FROM node:latest    # 🟡 Unpredictable
```

**Mitigation:**
```dockerfile
# ✅ Pin specific versions
FROM python:3.11.7-slim-bookworm
FROM node:20.11.0-alpine3.19

# ✅ Use digest for immutability
FROM python@sha256:abc123...
```

---

### DOCKER-003: Secrets in Build

| Severity | 🔴 Critical |
|----------|-------------|
| Impact | Secrets in image layers |

**Vulnerable Pattern:**
```dockerfile
# Agent copies .env for build
COPY .env .env                    # 🔴 CRITICAL
ENV API_KEY=sk-secret123          # 🔴 CRITICAL

# Secrets remain in image layers even if deleted
RUN rm .env  # Still in previous layer!
```

**Mitigation:**
```dockerfile
# ✅ Use build-time secrets (BuildKit)
# syntax=docker/dockerfile:1.4

FROM node:20-alpine

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm install

# ✅ Use multi-stage builds
FROM node:20 AS builder
RUN --mount=type=secret,id=api_key \
    API_KEY=$(cat /run/secrets/api_key) npm run build

FROM node:20-alpine
COPY --from=builder /app/dist /app/dist
# Secret never in final image
```

---

### DOCKER-004: Exposed Ports

| Severity | 🟡 Medium |
|----------|----------|
| Impact | Unintended network exposure |

**Vulnerable Pattern:**
```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    ports:
      - "5432:5432"  # 🟡 Exposed to host network
```

**Mitigation:**
```yaml
# ✅ Internal network only
services:
  db:
    image: postgres:15
    expose:
      - "5432"  # Only within Docker network
    # No 'ports' mapping
    
  app:
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://db:5432/app
```

---

## Kubernetes Security

### K8S-001: Privileged Containers

| Severity | 🔴 Critical |
|----------|-------------|
| Impact | Container escape, node compromise |

**Vulnerable Pattern:**
```yaml
# Agent enables privileges to "fix" permission issues
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    securityContext:
      privileged: true          # 🔴 CRITICAL
      runAsRoot: true           # 🔴 CRITICAL
```

**Mitigation:**
```yaml
# ✅ Security context with restrictions
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
    
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
```

---

### K8S-002: Secrets in ConfigMap

| Severity | 🔴 Critical |
|----------|-------------|
| Impact | Unencrypted secret storage |

**Vulnerable Pattern:**
```yaml
# Agent puts secrets in ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: postgres://user:password@db/app  # 🔴 CRITICAL
  API_KEY: sk-secret123                          # 🔴 CRITICAL
```

**Mitigation:**
```yaml
# ✅ Use Secrets (base64 encoded, encrypted at rest)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_URL: postgres://user:password@db/app
  API_KEY: sk-secret123

# ✅ Better: External secrets manager
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-secrets
spec:
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: app-secrets
  data:
  - secretKey: DATABASE_URL
    remoteRef:
      key: production/database
      property: url
```

---

## IaC Scanning Tools

### Required Scanners

```bash
# Terraform
tfsec .
checkov -d .
terrascan scan -t aws

# Docker
trivy image myapp:latest
hadolint Dockerfile

# Kubernetes
kubesec scan deployment.yaml
kube-bench run --targets master,node

# General
detect-secrets scan
```

### Pre-commit Configuration

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.86.0
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      - id: terraform_tfsec
      
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint
      
  - repo: https://github.com/bridgecrewio/checkov
    rev: 3.1.0
    hooks:
      - id: checkov
        args: ['--framework', 'terraform,dockerfile,kubernetes']
```

---

## Agent Instructions

```markdown
When generating Infrastructure as Code:

1. NEVER use wildcard (*) permissions in IAM policies
2. NEVER hardcode secrets in config files
3. NEVER expose databases directly to internet (0.0.0.0/0)
4. ALWAYS encrypt storage at rest (EBS, S3, RDS)
5. ALWAYS use non-root users in containers
6. ALWAYS pin image versions (no :latest)
7. ALWAYS use Secrets, not ConfigMaps, for sensitive data
8. Run tfsec/checkov before committing Terraform
9. Run hadolint before committing Dockerfiles
```

---

## Governance Checklist

| Category | Check | Tool |
|----------|-------|------|
| Secrets | No hardcoded credentials | detect-secrets, gitleaks |
| IAM | No wildcard permissions | tfsec, checkov |
| Network | No 0.0.0.0/0 ingress | tfsec, AWS Config |
| Encryption | All storage encrypted | tfsec, checkov |
| Containers | Non-root, pinned versions | hadolint, trivy |
| Kubernetes | No privileged pods | kubesec, OPA |

---

*Version: 1.0.0*
*Last Updated: 2026-01-28*
