# Provider Configuration
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = var.tags
  }
}

# Configure Terraform backend for state management
terraform {
  backend "s3" {
    bucket         = "austa-terraform-state-staging"
    key            = "staging/terraform.tfstate"
    region         = "sa-east-1"
    encrypt        = true
    dynamodb_table = "austa-terraform-lock-staging"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  required_version = ">= 1.0.0"
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
  
  environment         = var.environment
  availability_zones  = data.aws_availability_zones.available.names
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                = var.tags
}

# EKS cluster with journey-specific node groups
module "eks" {
  source = "../modules/eks"
  
  cluster_name        = "${var.project_name}-${var.environment}-eks"
  cluster_version     = var.eks_cluster_version
  vpc_id              = module.network.vpc_id
  subnet_ids          = module.network.private_app_subnet_ids
  security_group_ids  = [module.network.allow_all_outbound_sg_id]
  instance_type       = var.eks_node_group_instance_types["default"]
  desired_capacity    = var.journey_node_groups["health"].desired_size
  min_size            = var.journey_node_groups["health"].min_size
  max_size            = var.journey_node_groups["health"].max_size
  key_name            = "austa-key"
  tags                = var.tags
  oidc_providers      = []
}

# PostgreSQL RDS instance for persistent data storage
module "rds" {
  source = "../modules/rds"
  
  allocated_storage      = var.rds_allocated_storage
  engine                 = "postgres"
  engine_version         = var.rds_engine_version
  instance_class         = var.rds_instance_class
  db_name                = var.project_name
  db_username            = "austa"  # In production, use AWS Secrets Manager
  db_password            = "changeme"  # In production, use AWS Secrets Manager
  vpc_security_group_ids = [module.network.allow_all_outbound_sg_id]
  subnet_ids             = module.network.private_data_subnet_ids
  multi_az               = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention_period
  tags                   = var.tags
}

# Create subnet group for ElastiCache
resource "aws_elasticache_subnet_group" "default" {
  name        = "${var.project_name}-${var.environment}-redis-subnet"
  description = "Subnet group for ElastiCache cluster"
  subnet_ids  = module.network.private_app_subnet_ids
}

# Redis ElastiCache cluster for caching and real-time data
module "elasticache" {
  source = "../modules/elasticache"
  
  cluster_name       = "${var.project_name}-${var.environment}-redis"
  engine_version     = var.elasticache_engine_version
  node_type          = var.elasticache_node_type
  num_cache_nodes    = var.elasticache_num_cache_nodes
  subnet_group_name  = aws_elasticache_subnet_group.default.name
  security_group_names = [module.network.allow_all_outbound_sg_id]
  tags               = var.tags
}

# MSK (Managed Streaming for Kafka) for event streaming
module "msk" {
  source = "../modules/msk"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_app_subnet_ids
  msk_kafka_version  = var.msk_kafka_version
  msk_broker_count   = var.msk_broker_count
  msk_instance_type  = var.msk_instance_type
  tags               = var.tags
}

# S3 bucket for document storage
module "s3" {
  source = "../modules/s3"
  
  bucket_name         = var.s3_bucket_names["documents"]
  acl                 = "private"
  versioning_enabled  = true
  encryption_enabled  = true
  tags                = var.tags
  replication_enabled = var.enable_cross_region_replication
  replication_destination = "arn:aws:s3:::austa-documents-dr"
  lifecycle_rules     = []
  environment         = var.environment
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
  value       = module.elasticache.endpoint
}

output "msk_bootstrap_brokers" {
  description = "MSK Kafka bootstrap brokers"
  value       = module.msk.bootstrap_brokers
}

output "document_bucket_name" {
  description = "Name of the S3 bucket for documents"
  value       = module.s3.bucket_name
}