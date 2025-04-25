# AUSTA SuperApp Infrastructure Configuration
# This Terraform configuration provisions the core infrastructure components for the AUSTA SuperApp,
# including network, compute, database, caching, messaging, and storage resources.

terraform {
  required_version = ">= 1.5"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "austa-terraform-state"
    key            = "superapp/terraform.tfstate"
    region         = "sa-east-1"
    encrypt        = true
    dynamodb_table = "austa-terraform-locks"
  }
}

provider "aws" {
  region = "sa-east-1"
  
  default_tags {
    tags = {
      Project     = "AUSTA SuperApp"
      Environment = terraform.workspace
      ManagedBy   = "Terraform"
    }
  }
}

# Network module - Creates VPC, subnets, route tables, NAT gateways, etc.
module "network" {
  source = "./modules/network"
  
  vpc_cidr             = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  availability_zones   = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]
}

# EKS module - Creates Kubernetes cluster for containerized applications
module "eks" {
  source = "./modules/eks"
  
  cluster_name       = "austa-superapp-cluster"
  vpc_id             = module.network.vpc_id
  public_subnet_ids  = module.network.public_subnet_ids
  private_subnet_ids = module.network.private_subnet_ids
  
  # Journey-specific node groups
  node_groups = {
    journey_services = {
      name          = "journey-services"
      instance_type = "m5.large"
      min_size      = 3
      max_size      = 20
      desired_size  = 3
    },
    shared_services = {
      name          = "shared-services"
      instance_type = "m5.large"
      min_size      = 2
      max_size      = 10
      desired_size  = 2
    },
    gamification = {
      name          = "gamification"
      instance_type = "c5.xlarge"
      min_size      = 2
      max_size      = 15
      desired_size  = 2
    }
  }
}

# RDS module - Creates PostgreSQL database for primary data storage
module "rds" {
  source = "./modules/rds"
  
  db_name           = "austa_db"
  db_username       = "austa"
  db_password       = "ComplexPassword!" # Note: In production, use AWS Secrets Manager
  db_instance_class = "db.m5.2xlarge"
  engine_version    = "14.6"
  multi_az          = true
  storage_encrypted = true
  backup_retention  = 30
  
  vpc_id              = module.network.vpc_id
  private_subnet_ids  = module.network.private_subnet_ids
  security_group_ids  = [module.eks.worker_security_group_id]
}

# ElastiCache module - Creates Redis cluster for caching and real-time data
module "elasticache" {
  source = "./modules/elasticache"
  
  cluster_id         = "austa-redis"
  node_type          = "cache.m5.large"
  num_cache_nodes    = 3
  subnet_group_name  = module.network.cache_subnet_group_name
  security_group_ids = [module.eks.worker_security_group_id]
  parameter_group    = "default.redis7.cluster.on"
  engine_version     = "7.0"
}

# MSK module - Creates Kafka cluster for event streaming
module "msk" {
  source = "./modules/msk"
  
  cluster_name        = "austa-kafka"
  kafka_version       = "3.4.0"
  number_of_brokers   = 3
  broker_instance_type = "kafka.m5.large"
  
  vpc_id              = module.network.vpc_id
  private_subnet_ids  = module.network.private_subnet_ids
  security_group_ids  = [module.eks.worker_security_group_id]
  
  # Journey-specific topic configuration will be handled by applications
}

# S3 module - Creates buckets for document storage and other assets
module "s3" {
  source = "./modules/s3"
  
  bucket_name       = "austa-superapp-documents-${terraform.workspace}"
  acl               = "private"
  versioning        = true
  lifecycle_rules   = [{
    prefix   = "health/"
    enabled  = true
    expiration = {
      days = 2555  # ~7 years retention for health documents
    }
  }, {
    prefix   = "care/"
    enabled  = true
    expiration = {
      days = 730   # 2 years retention for care documents
    }
  }, {
    prefix   = "plan/"
    enabled  = true
    expiration = {
      days = 1825  # 5 years retention for plan documents
    }
  }]
  
  # Set up CORS for web access
  cors_rules = [{
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["https://*.austa.com.br"]
    max_age_seconds = 3000
  }]
  
  # Server-side encryption
  encryption = {
    sse_algorithm = "AES256"
  }
}

# Additional resources for monitoring, security, and compliance
module "monitoring" {
  source = "./modules/monitoring"
  
  cluster_name     = module.eks.cluster_name
  vpc_id           = module.network.vpc_id
  log_retention    = 90
  alarm_sns_topic  = "arn:aws:sns:sa-east-1:123456789012:austa-alarms"
  
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

# Outputs for use by other configurations or CI/CD processes
output "vpc_id" {
  value       = module.network.vpc_id
  description = "The ID of the VPC"
}

output "cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Endpoint for EKS cluster"
  sensitive   = false
}

output "database_endpoint" {
  value       = module.rds.db_endpoint
  description = "Endpoint for the PostgreSQL database"
  sensitive   = false
}

output "redis_endpoint" {
  value       = module.elasticache.redis_endpoint
  description = "Endpoint for the Redis cluster"
  sensitive   = false
}

output "kafka_brokers" {
  value       = module.msk.bootstrap_brokers
  description = "Kafka bootstrap brokers"
  sensitive   = false
}

output "document_bucket" {
  value       = module.s3.bucket_name
  description = "S3 bucket for document storage"
  sensitive   = false
}