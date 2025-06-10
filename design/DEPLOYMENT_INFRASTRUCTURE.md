# Deployment and Infrastructure Design

> **Infrastructure Foundation**: Based on AWS healthcare best practices with 130+ HIPAA-eligible services, implementing infrastructure as code with Terraform, and designed for 99.95% availability supporting 100K concurrent users.

## 1. Cloud Infrastructure Architecture

### 1.1 Multi-Region AWS Architecture

```yaml
Primary Region: sa-east-1 (São Paulo)
  Availability Zones: 3 (sa-east-1a, sa-east-1b, sa-east-1c)
  
  Network Architecture:
    VPC:
      CIDR: 10.0.0.0/16
      
    Public Subnets (ALB, NAT Gateway):
      - 10.0.1.0/24 (AZ-1a)
      - 10.0.2.0/24 (AZ-1b)
      - 10.0.3.0/24 (AZ-1c)
      
    Private Subnets (EKS Nodes):
      - 10.0.10.0/23 (AZ-1a) - Health Journey
      - 10.0.12.0/23 (AZ-1b) - Care Journey
      - 10.0.14.0/23 (AZ-1c) - Plan Journey
      - 10.0.16.0/23 (Multi-AZ) - Gamification
      
    Database Subnets (RDS, ElastiCache):
      - 10.0.20.0/24 (AZ-1a)
      - 10.0.21.0/24 (AZ-1b)
      - 10.0.22.0/24 (AZ-1c)

Disaster Recovery Region: us-east-1 (N. Virginia)
  - Passive standby configuration
  - Cross-region replication for critical data
  - Automated failover capability
```

### 1.2 Kubernetes Cluster Design

```yaml
EKS Cluster Configuration:
  Version: 1.28
  
  Node Groups:
    health-journey-nodes:
      Instance Types: [c5.xlarge, c5.2xlarge]
      Min Size: 2
      Max Size: 20
      Desired Size: 4
      Labels:
        journey: health
        workload: api
      Taints:
        - key: journey
          value: health
          effect: NoSchedule
          
    care-journey-nodes:
      Instance Types: [c5.xlarge, c5.2xlarge]
      Min Size: 3
      Max Size: 30
      Desired Size: 6
      Labels:
        journey: care
        workload: api
        
    plan-journey-nodes:
      Instance Types: [c5.large, c5.xlarge]
      Min Size: 2
      Max Size: 15
      Desired Size: 3
      Labels:
        journey: plan
        workload: api
        
    gamification-nodes:
      Instance Types: [c5.2xlarge, c5.4xlarge]
      Min Size: 5
      Max Size: 25
      Desired Size: 8
      Labels:
        workload: compute-intensive
      Taints:
        - key: workload
          value: gamification
          effect: NoSchedule
          
    shared-services-nodes:
      Instance Types: [t3.large, t3.xlarge]
      Min Size: 3
      Max Size: 10
      Desired Size: 5
      Labels:
        workload: shared

  Add-ons:
    - aws-ebs-csi-driver
    - aws-efs-csi-driver
    - cluster-autoscaler
    - metrics-server
    - aws-load-balancer-controller
```

### 1.3 Data Layer Infrastructure

```yaml
PostgreSQL (RDS):
  Primary Instance:
    Engine: PostgreSQL 14.9
    Instance Class: db.r6g.2xlarge
    Storage: 1TB GP3 (20,000 IOPS)
    Multi-AZ: true
    Backup Retention: 30 days
    
  Read Replicas:
    Count: 3
    Instance Class: db.r6g.xlarge
    Cross-AZ Distribution: true
    
  Parameter Groups:
    max_connections: 5000
    shared_buffers: 16GB
    effective_cache_size: 48GB
    work_mem: 64MB
    
TimescaleDB:
  Instance Class: db.m6g.2xlarge
  Storage: 2TB GP3
  Compression: After 30 days
  Retention: 1 year
  
Redis Cluster (ElastiCache):
  Node Type: cache.r6g.xlarge
  Nodes: 6 (3 primary, 3 replica)
  Sharding: Enabled
  Automatic Failover: true
  Backup: Daily snapshots
  
S3 Storage:
  Buckets:
    - austa-health-documents (encrypted, versioned)
    - austa-health-images (lifecycle policies)
    - austa-health-backups (cross-region replication)
    - austa-health-logs (lifecycle to Glacier)
    
Kafka (Amazon MSK):
  Version: 2.8.1
  Instance Type: kafka.m5.large
  Brokers: 6 (2 per AZ)
  Storage: 1TB per broker
  Replication Factor: 3
  Auto Scaling: Enabled
```

## 2. Container Deployment Architecture

### 2.1 Microservice Deployment Patterns

```yaml
# Health Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-service
  namespace: austa-health
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: health-service
  template:
    metadata:
      labels:
        app: health-service
        journey: health
        version: stable
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3002"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: health-service
      nodeSelector:
        journey: health
      tolerations:
      - key: journey
        operator: Equal
        value: health
        effect: NoSchedule
      containers:
      - name: health-service
        image: austa-health/health-service:1.0.0
        ports:
        - containerPort: 3002
          name: http
          protocol: TCP
        - containerPort: 9090
          name: metrics
          protocol: TCP
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: health-service-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: health-service-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3002
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3002
          initialDelaySeconds: 20
          periodSeconds: 5
          timeoutSeconds: 3
          successThreshold: 1
          failureThreshold: 3
        volumeMounts:
        - name: app-config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: app-config
        configMap:
          name: health-service-config
---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: health-service-hpa
  namespace: austa-health
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: health-service
  minReplicas: 3
  maxReplicas: 30
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
      - type: Pods
        value: 4
        periodSeconds: 60
```

### 2.2 Service Mesh Configuration

```yaml
# Istio Virtual Service for Canary Deployment
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: health-service-vs
  namespace: austa-health
spec:
  hosts:
  - health-service
  http:
  - match:
    - headers:
        x-version:
          exact: canary
    route:
    - destination:
        host: health-service
        subset: canary
      weight: 100
  - route:
    - destination:
        host: health-service
        subset: stable
      weight: 95
    - destination:
        host: health-service
        subset: canary
      weight: 5
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
      retryOn: gateway-error,reset,connect-failure,refused-stream
```

## 3. CI/CD Pipeline Architecture

### 3.1 GitOps Workflow

```yaml
# ArgoCD Application Definition
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: austa-health-platform
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/austa-health/platform
    targetRevision: main
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: austa-health
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - Validate=true
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 3.2 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth, health, care, plan, gamification, notification]
    steps:
    - uses: actions/checkout@v3
    
    - name: Run tests
      run: |
        cd services/${{ matrix.service }}
        npm test -- --coverage
        
    - name: Security scan
      run: |
        trivy fs --severity HIGH,CRITICAL .
        
  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [auth, health, care, plan, gamification, notification]
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE }}
        aws-region: sa-east-1
        
    - name: Login to ECR
      uses: aws-actions/amazon-ecr-login@v1
      
    - name: Build and push image
      run: |
        docker build -t ${{ matrix.service }} services/${{ matrix.service }}
        docker tag ${{ matrix.service }}:latest $ECR_REGISTRY/${{ matrix.service }}:$GITHUB_SHA
        docker push $ECR_REGISTRY/${{ matrix.service }}:$GITHUB_SHA
        
    - name: Update manifests
      run: |
        cd k8s/services/${{ matrix.service }}
        kustomize edit set image ${{ matrix.service }}=$ECR_REGISTRY/${{ matrix.service }}:$GITHUB_SHA
        
    - name: Commit changes
      run: |
        git config user.name github-actions
        git config user.email github-actions@github.com
        git add .
        git commit -m "Deploy ${{ matrix.service }}:$GITHUB_SHA"
        git push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Wait for ArgoCD sync
      run: |
        argocd app wait austa-health-platform \
          --sync \
          --health \
          --timeout 600
          
    - name: Run smoke tests
      run: |
        ./scripts/smoke-tests.sh production
        
    - name: Check deployment health
      run: |
        kubectl get pods -n austa-health
        kubectl top pods -n austa-health
```

## 4. Infrastructure as Code

### 4.1 Terraform Module Structure

```hcl
# Main Infrastructure Module
module "network" {
  source = "./modules/network"
  
  vpc_cidr = "10.0.0.0/16"
  azs      = data.aws_availability_zones.available.names
  
  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]
  
  private_subnets = [
    "10.0.10.0/23",
    "10.0.12.0/23",
    "10.0.14.0/23",
    "10.0.16.0/23"
  ]
  
  database_subnets = [
    "10.0.20.0/24",
    "10.0.21.0/24",
    "10.0.22.0/24"
  ]
  
  enable_nat_gateway = true
  single_nat_gateway = false
  enable_vpn_gateway = true
  
  tags = local.common_tags
}

module "eks" {
  source = "./modules/eks"
  
  cluster_name    = "austa-health-${var.environment}"
  cluster_version = "1.28"
  
  vpc_id     = module.network.vpc_id
  subnet_ids = module.network.private_subnets
  
  node_groups = {
    health_journey = {
      desired_capacity = 4
      max_capacity     = 20
      min_capacity     = 2
      
      instance_types = ["c5.xlarge", "c5.2xlarge"]
      
      k8s_labels = {
        journey  = "health"
        workload = "api"
      }
      
      taints = [
        {
          key    = "journey"
          value  = "health"
          effect = "NO_SCHEDULE"
        }
      ]
    }
    
    care_journey = {
      desired_capacity = 6
      max_capacity     = 30
      min_capacity     = 3
      
      instance_types = ["c5.xlarge", "c5.2xlarge"]
      
      k8s_labels = {
        journey  = "care"
        workload = "api"
      }
    }
    
    gamification = {
      desired_capacity = 8
      max_capacity     = 25
      min_capacity     = 5
      
      instance_types = ["c5.2xlarge", "c5.4xlarge"]
      
      k8s_labels = {
        workload = "compute-intensive"
      }
      
      taints = [
        {
          key    = "workload"
          value  = "gamification"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }
  
  enable_irsa = true
  
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }
  
  tags = local.common_tags
}

module "rds" {
  source = "./modules/rds"
  
  identifier = "austa-health-${var.environment}"
  
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.r6g.2xlarge"
  
  allocated_storage     = 1000
  max_allocated_storage = 5000
  storage_encrypted     = true
  storage_type          = "gp3"
  iops                  = 20000
  
  database_name = "austa_health"
  username      = "austa_admin"
  
  vpc_security_group_ids = [module.rds_security_group.security_group_id]
  db_subnet_group_name   = module.network.database_subnet_group_name
  
  multi_az               = true
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  create_db_parameter_group = true
  parameter_group_name      = "austa-health-pg14"
  parameters = [
    {
      name  = "max_connections"
      value = "5000"
    },
    {
      name  = "shared_buffers"
      value = "{DBInstanceClassMemory/4}"
    }
  ]
  
  create_monitoring_role = true
  monitoring_interval    = 60
  
  tags = local.common_tags
}

module "redis" {
  source = "./modules/elasticache"
  
  cluster_id = "austa-health-${var.environment}"
  
  engine               = "redis"
  node_type            = "cache.r6g.xlarge"
  num_cache_nodes      = 6
  parameter_group_name = "default.redis7.cluster.on"
  port                 = 6379
  
  subnet_group_name = module.network.elasticache_subnet_group_name
  security_group_ids = [module.redis_security_group.security_group_id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_enabled         = true
  
  automatic_failover_enabled = true
  multi_az_enabled           = true
  
  snapshot_retention_limit = 7
  snapshot_window          = "03:00-04:00"
  
  tags = local.common_tags
}
```

### 4.2 Monitoring and Observability Infrastructure

```hcl
# Monitoring Stack
module "monitoring" {
  source = "./modules/monitoring"
  
  cluster_name = module.eks.cluster_name
  
  prometheus = {
    retention_days = 30
    storage_size   = "100Gi"
    replicas       = 2
  }
  
  grafana = {
    admin_password = var.grafana_admin_password
    persistence    = true
    storage_size   = "10Gi"
  }
  
  loki = {
    retention_days = 7
    storage_size   = "50Gi"
  }
  
  alerts = {
    slack_webhook = var.slack_webhook_url
    pagerduty_key = var.pagerduty_integration_key
  }
  
  dashboards = [
    "kubernetes-cluster",
    "nginx-ingress",
    "postgresql",
    "redis",
    "kafka",
    "application-metrics"
  ]
  
  tags = local.common_tags
}
```

## 5. Disaster Recovery and Backup

### 5.1 Backup Strategy

```yaml
Backup Configuration:
  Databases:
    PostgreSQL:
      - Automated backups: Daily
      - Backup retention: 30 days
      - Point-in-time recovery: Enabled
      - Cross-region backup copy: us-east-1
      - Manual snapshots: Before major updates
      
    Redis:
      - Automated snapshots: Every 6 hours
      - Retention: 7 days
      - Backup during low-traffic window
      
  Application Data:
    S3 Buckets:
      - Versioning: Enabled
      - Cross-region replication: us-east-1
      - Lifecycle policies:
        - IA after 30 days
        - Glacier after 90 days
        - Delete after 7 years
        
  Kubernetes:
    ETCD Backup:
      - Frequency: Every 4 hours
      - Retention: 7 days
      - Storage: S3 encrypted bucket
      
    Persistent Volumes:
      - Snapshot schedule: Daily
      - Retention: 14 days
      - Cross-AZ copies
```

### 5.2 Disaster Recovery Plan

```yaml
RTO/RPO Targets:
  Critical Services (Auth, Health):
    - RTO: 15 minutes
    - RPO: 5 minutes
    
  Standard Services (Care, Plan):
    - RTO: 1 hour
    - RPO: 15 minutes
    
  Non-Critical (Analytics, Reports):
    - RTO: 4 hours
    - RPO: 1 hour

DR Procedures:
  Region Failure:
    1. Detect failure (automated monitoring)
    2. Verify failure (manual confirmation)
    3. Initiate failover:
       - Update Route53 health checks
       - Promote RDS read replicas
       - Start services in DR region
       - Verify data consistency
    4. Notify stakeholders
    5. Monitor DR environment
    
  Data Recovery:
    1. Identify corruption/loss
    2. Stop affected services
    3. Restore from last known good backup
    4. Replay transactions from event store
    5. Verify data integrity
    6. Resume services
```

## 6. Security and Compliance Infrastructure

### 6.1 Security Services

```yaml
AWS Security Services:
  WAF:
    - OWASP Top 10 rule set
    - Rate limiting: 2000 req/5min per IP
    - Geo-blocking: Configurable
    - Custom rules for healthcare
    
  GuardDuty:
    - Threat detection: Enabled
    - S3 protection: Enabled
    - EKS audit logs: Monitored
    - Finding severity: Medium and above
    
  Security Hub:
    - Standards: AWS Foundational Security Best Practices
    - Compliance: HIPAA, SOC2
    - Automated remediation: Critical findings
    
  CloudTrail:
    - Multi-region: Enabled
    - Log encryption: KMS
    - Log validation: Enabled
    - Integration: SIEM
```

### 6.2 Network Security

```hcl
# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "austa-alb-"
  vpc_id      = module.network.vpc_id
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    Name = "austa-alb-sg"
  })
}

resource "aws_security_group" "eks_nodes" {
  name_prefix = "austa-eks-nodes-"
  vpc_id      = module.network.vpc_id
  
  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  ingress {
    from_port = 0
    to_port   = 65535
    protocol  = "tcp"
    self      = true
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    Name = "austa-eks-nodes-sg"
  })
}
```

## 7. Cost Optimization

### 7.1 Resource Optimization

```yaml
Cost Optimization Strategies:
  Compute:
    - Spot instances for non-critical workloads (30% cost saving)
    - Reserved instances for baseline capacity (40% saving)
    - Auto-scaling based on actual demand
    - Right-sizing recommendations monthly
    
  Storage:
    - S3 lifecycle policies
    - Intelligent tiering for infrequently accessed data
    - EBS GP3 instead of GP2 (20% saving)
    - Snapshot lifecycle management
    
  Database:
    - RDS reserved instances
    - Automated stop/start for non-production
    - Read replica auto-scaling
    - Query performance insights
    
  Network:
    - VPC endpoints for AWS services
    - CloudFront for static content
    - NAT instance for dev/test
    - Regional data transfer optimization

Monthly Budget Allocation:
  - Compute (EKS): 40% (~$20,000)
  - Database (RDS/Redis): 25% (~$12,500)
  - Storage (S3/EBS): 10% (~$5,000)
  - Network (ALB/CloudFront): 10% (~$5,000)
  - Monitoring/Security: 10% (~$5,000)
  - Backup/DR: 5% (~$2,500)
```

### 7.2 Monitoring and Alerts

```yaml
Cost Monitoring:
  AWS Budgets:
    - Monthly budget: $50,000
    - Alerts at: 50%, 80%, 90%, 100%
    - Forecast alerts: Enabled
    
  Cost Explorer:
    - Weekly reports by service
    - Tag-based cost allocation
    - Reserved instance utilization
    - Savings plan coverage
    
  Automated Actions:
    - Stop non-critical services at threshold
    - Scale down non-production environments
    - Alert finance team at 90%
    - Require approval for new resources
```

This comprehensive deployment and infrastructure design ensures the healthcare super app can scale efficiently, maintain high availability, and meet stringent security and compliance requirements while optimizing costs.