# AUSTA SuperApp Infrastructure Configuration
# This Terraform configuration provisions the core infrastructure components for the AUSTA SuperApp,
# including network, compute, database, caching, messaging, and storage resources.

# Network module - Creates VPC, subnets, route tables, NAT gateways, etc.
module "network" {
  source = "./modules/network"

  vpc_cidr             = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  availability_zones   = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]
}

# EKS module - Creates Kubernetes cluster for containerized applications
# Note: Based on module inspection, this module doesn't use a node_groups parameter
# but instead creates predefined node groups internally
module "eks" {
  source = "./modules/eks"

  cluster_name       = "austa-superapp-cluster"
  vpc_id             = module.network.vpc_id
  public_subnet_ids  = module.network.public_subnet_ids
  private_subnet_ids = module.network.private_subnet_ids

  # Using the node_group_instance_types parameter instead of node_groups
  node_group_instance_types = ["m5.large", "c5.xlarge"]
  node_group_desired_size   = 3
  node_group_min_size       = 1
  node_group_max_size       = 20
}

# RDS module - Creates PostgreSQL database for primary data storage
module "rds" {
  source = "./modules/rds"

  # Corrected parameters based on the module's variables.tf
  name                    = "austa-db"
  db_name                 = "austa_db"
  db_username             = "austa"
  db_password             = "ComplexPassword!" # Note: In production, use AWS Secrets Manager
  instance_class          = "db.m5.2xlarge"
  engine                  = "postgres"
  engine_version          = "14.6"
  allocated_storage       = 100
  multi_az                = true
  backup_retention_period = 30

  vpc_id             = module.network.vpc_id
  subnet_ids         = module.network.private_subnet_ids
  security_group_ids = [module.eks.worker_security_group_id]
}

# ElastiCache module - Creates Redis cluster for caching and real-time data
module "elasticache" {
  source = "./modules/elasticache"

  cluster_name         = "austa-redis"
  node_type            = "cache.m5.large"
  num_cache_nodes      = 3
  subnet_group_name    = module.network.cache_subnet_group_name
  security_group_ids   = [module.eks.worker_security_group_id]
  parameter_group_name = "default.redis7.cluster.on"
  engine_version       = "7.0"
}

# MSK module - Creates Kafka cluster for event streaming
module "msk" {
  source = "./modules/msk"

  cluster_name         = "austa-kafka"
  kafka_version        = "3.4.0"
  broker_count         = 3
  broker_instance_type = "kafka.m5.large"

  vpc_id            = module.network.vpc_id
  broker_subnet_ids = module.network.private_subnet_ids
  security_groups   = [module.eks.worker_security_group_id]
}

# S3 module - Creates buckets for document storage and other assets
module "s3" {
  source = "./modules/s3"

  bucket_name = "austa-superapp-documents-${terraform.workspace}"
  acl         = "private"
  versioning  = true

  lifecycle_rules = [{
    prefix  = "health/"
    enabled = true
    expiration = {
      days = 2555 # ~7 years retention for health documents
    }
    }, {
    prefix  = "care/"
    enabled = true
    expiration = {
      days = 730 # 2 years retention for care documents
    }
    }, {
    prefix  = "plan/"
    enabled = true
    expiration = {
      days = 1825 # 5 years retention for plan documents
    }
  }]

  cors_rules = [{
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://*.austa.com.br"]
    max_age_seconds = 3000
  }]

  # Server-side encryption configuration
  encryption_enabled = true
  encryption_type    = "AES256"
}

# Additional resources for monitoring, security, and compliance
module "monitoring" {
  source = "./modules/monitoring"

  cluster_name    = module.eks.cluster_name
  vpc_id          = module.network.vpc_id
  log_retention   = 90
  alarm_sns_topic = "arn:aws:sns:sa-east-1:123456789012:austa-alarms"

  # Journey-specific monitoring configuration
  journey_namespaces = ["health", "care", "plan", "gamification"]
}

module "waf" {
  source = "./modules/waf"

  name  = "austa-superapp-waf"
  scope = "REGIONAL"

  # Healthcare-specific rule sets
  managed_rule_groups = [
    "AWSManagedRulesCommonRuleSet",
    "AWSManagedRulesKnownBadInputsRuleSet",
    "AWSManagedRulesSQLiRuleSet"
  ]
}