# Terraform configuration for AUSTA SuperApp production environment

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.5"

  backend "s3" {
    bucket         = "austa-terraform-state-production"
    key            = "production/terraform.tfstate"
    region         = "sa-east-1"
    encrypt        = true
    dynamodb_table = "austa-terraform-lock-production"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# Data sources - Get available AZs in the region
data "aws_availability_zones" "available" {
  state = "available"
  filter {
    name   = "region"
    values = [var.aws_region]
  }
}

# Network module - Creates VPC, subnets, route tables, Internet Gateway, NAT Gateway
module "network" {
  source = "../modules/network"

  environment          = var.environment
  availability_zones   = data.aws_availability_zones.available.names
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = var.tags
}

# EKS cluster with production-grade node groups
module "eks" {
  source = "../modules/eks"

  cluster_name              = "${var.prefix}-${var.environment}-eks"
  cluster_version           = var.eks_version
  vpc_id                    = module.network.vpc_id
  private_subnet_ids        = module.network.private_app_subnet_ids
  public_subnet_ids         = module.network.public_subnet_ids
  node_group_instance_types = [var.eks_instance_type]
  node_group_desired_size   = var.eks_desired_capacity
  node_group_min_size       = var.eks_min_size
  node_group_max_size       = var.eks_max_size
  oidc_providers            = []
}

# PostgreSQL RDS instance for persistent data storage
module "rds" {
  source = "../modules/rds"

  allocated_storage                     = var.rds_allocated_storage
  engine                                = "postgres"
  engine_version                        = var.rds_engine_version
  instance_class                        = var.rds_instance_type
  db_name                               = "${var.prefix}_prod"
  db_username                           = var.db_username
  db_password                           = var.db_password
  vpc_security_group_ids                = [module.network.allow_all_outbound_sg_id]
  subnet_ids                            = module.network.private_data_subnet_ids
  multi_az                              = var.rds_multi_az
  backup_retention_period               = var.rds_backup_retention_period
  deletion_protection                   = var.rds_deletion_protection
  performance_insights_enabled          = var.rds_performance_insights_enabled
  performance_insights_retention_period = var.rds_performance_insights_retention_period
}

# Create subnet group for ElastiCache
resource "aws_elasticache_subnet_group" "default" {
  name        = "${var.prefix}-${var.environment}-redis-subnet"
  description = "Subnet group for ElastiCache cluster"
  subnet_ids  = module.network.private_app_subnet_ids
}

# Redis ElastiCache cluster for caching and real-time data
module "elasticache" {
  source = "../modules/elasticache"

  cluster_name       = "${var.prefix}-${var.environment}-redis"
  engine_version     = var.elasticache_engine_version
  node_type          = var.elasticache_node_type
  subnet_group_name  = aws_elasticache_subnet_group.default.name
  security_group_ids = [module.network.allow_all_outbound_sg_id]
}

# MSK (Managed Streaming for Kafka) for event streaming
module "msk" {
  source = "../modules/msk"

  project_name         = var.prefix
  environment          = var.environment
  vpc_id               = module.network.vpc_id
  broker_subnet_ids    = module.network.private_app_subnet_ids
  kafka_version        = var.msk_kafka_version
  broker_count         = var.msk_broker_count
  broker_instance_type = var.msk_instance_type
}

# S3 bucket for document storage
module "s3" {
  source = "../modules/s3"

  bucket_name        = "${var.prefix}-documents"
  environment        = var.environment
  acl                = "private"
  versioning_enabled = var.s3_versioning_enabled
  encryption_enabled = var.s3_encryption_enabled
  tags               = var.tags
  lifecycle_rules    = []
}

# Monitoring module for production observability
module "monitoring" {
  source = "../modules/monitoring"

  cluster_name       = module.eks.cluster_name
  vpc_id             = module.network.vpc_id
  log_retention      = 90
  alarm_sns_topic    = "arn:aws:sns:sa-east-1:123456789012:austa-prod-alarms"
  journey_namespaces = ["health", "care", "plan", "gamification"]
}

# WAF module for production security
module "waf" {
  source = "../modules/waf"

  name  = "${var.prefix}-prod-waf"
  scope = "REGIONAL"

  managed_rule_groups = [
    "AWSManagedRulesCommonRuleSet",
    "AWSManagedRulesKnownBadInputsRuleSet",
    "AWSManagedRulesSQLiRuleSet"
  ]
}

# Output important resource identifiers for reference
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.network.vpc_id
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.endpoint
}

output "elasticache_endpoint" {
  description = "Endpoint of the ElastiCache cluster"
  value       = module.elasticache.cluster_address
}

output "msk_bootstrap_brokers" {
  description = "MSK Kafka bootstrap brokers"
  value       = module.msk.bootstrap_brokers
}

output "document_bucket_name" {
  description = "Name of the S3 bucket for documents"
  value       = module.s3.bucket_name
}
