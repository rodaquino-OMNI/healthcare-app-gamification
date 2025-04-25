# General configuration for AUSTA SuperApp production environment
aws_region = "sa-east-1"
environment = "production"
prefix = "austa"
component = "austa-superapp"
tags = {
  Environment = "production"
  Project     = "austa-superapp"
  ManagedBy   = "Terraform"
  Application = "AUSTA SuperApp"
  Compliance  = "LGPD"
}

# Networking configuration
vpc_cidr = "10.0.0.0/16"
availability_zones = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]

# EKS cluster configuration
eks_version = "1.25"
eks_instance_type = "m5.large" # Default instance type for general worker nodes
eks_desired_capacity = 5 # Base capacity before journey-specific scaling
eks_min_size = 3
eks_max_size = 30 # High max size to accommodate traffic spikes

# RDS database configuration
rds_instance_type = "db.m5.2xlarge"
rds_allocated_storage = 200
rds_engine_version = "14.7"
rds_multi_az = true
rds_backup_retention_period = 30
rds_deletion_protection = true
rds_performance_insights_enabled = true
rds_performance_insights_retention_period = 30

# ElastiCache Redis configuration
elasticache_node_type = "cache.m5.2xlarge"
elasticache_num_cache_nodes = 3
elasticache_engine_version = "7.0"
elasticache_automatic_failover_enabled = true

# MSK Kafka configuration
msk_instance_type = "kafka.m5.xlarge"
msk_broker_count = 6 # Higher broker count for production workloads
msk_kafka_version = "3.2.1"

# S3 storage configuration
s3_versioning_enabled = true
s3_encryption_enabled = true

# Journey-specific node groups will be managed through EKS module configuration
# Health Journey: min 3, desired 5, max 20 nodes of type m5.large
# Care Journey: min 5, desired 5, max 30 nodes of type m5.xlarge (higher capacity for telemedicine)
# Plan Journey: min 3, desired 3, max 15 nodes of type m5.large
# Gamification: min 3, desired 3, max 25 nodes of type c5.xlarge (compute optimized)

# IMPORTANT: Sensitive values should not be stored in this file
# The database password should be provided securely through AWS Secrets Manager
# or through secure environment variables during Terraform execution