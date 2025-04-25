# AWS Region - South America (São Paulo) for Brazilian deployment
aws_region = "sa-east-1"

# Environment naming
environment = "staging"
project_name = "austa"

# Network configuration
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]

# Database configuration
database_name = "austa"
database_username = "austa_admin"
database_password = "SENSITIVE_VALUE_MANAGED_BY_AWS_SECRETS_MANAGER"
database_instance_class = "db.m5.large"

# Redis configuration
redis_node_type = "cache.m5.large"
redis_num_cache_nodes = 3

# Kafka configuration
kafka_brokers = 3

# Availability zones
availability_zones = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]

# EKS configuration
eks_cluster_name = "austa-staging-eks"
eks_cluster_version = "1.25"
eks_node_group_instance_types = {
  default = ["t3.large"]
  health = ["t3.large"]
  care = ["t3.large"]
  plan = ["t3.large"]
  gamification = ["c5.large"]
}

# Journey-specific node groups
journey_node_groups = {
  health = {
    desired_size = 2
    min_size = 2
    max_size = 5
  }
  care = {
    desired_size = 3
    min_size = 2
    max_size = 6
  }
  plan = {
    desired_size = 2
    min_size = 2
    max_size = 4
  }
  gamification = {
    desired_size = 2
    min_size = 2
    max_size = 5
  }
}

# RDS PostgreSQL configuration
rds_instance_class = "db.m5.large"
rds_allocated_storage = 50
rds_engine_version = "14.7"
rds_multi_az = true
rds_backup_retention_period = 7

# ElastiCache Redis configuration
elasticache_node_type = "cache.m5.large"
elasticache_engine_version = "7.0"
elasticache_num_cache_nodes = 3

# MSK Kafka configuration
msk_instance_type = "kafka.m5.large"
msk_broker_count = 3
msk_kafka_version = "3.2.1"

# S3 bucket names
s3_bucket_names = {
  documents = "austa-staging-documents"
  media = "austa-staging-media"
  logs = "austa-staging-logs"
  backups = "austa-staging-backups"
}

# Security features
enable_waf = true
enable_cloudfront = true
enable_cross_region_replication = false

# Resource tagging
tags = {
  Environment = "staging"
  Project = "austa-superapp"
  ManagedBy = "Terraform"
  Application = "AUSTA SuperApp"
}