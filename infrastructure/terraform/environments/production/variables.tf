# Variables for AUSTA SuperApp production environment infrastructure

# General configuration
variable "aws_region" {
  type        = string
  description = "AWS region for the production environment"
  default     = "sa-east-1"
}

variable "environment" {
  type        = string
  description = "Name of the environment"
  default     = "production"
}

variable "component" {
  type        = string
  description = "Name of the component being deployed"
  default     = "austa-superapp"
}

variable "prefix" {
  type        = string
  description = "Prefix for all resources in this environment"
  default     = "austa"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default = {
    Environment = "production"
    Component   = "austa-superapp"
    ManagedBy   = "Terraform"
    Application = "AUSTA SuperApp"
  }
}

# Networking configuration
variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for private subnets"
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "List of availability zones to use"
  default     = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]
}

# EKS cluster configuration
variable "eks_version" {
  type        = string
  description = "Kubernetes version for the EKS cluster"
  default     = "1.25"
}

variable "eks_instance_type" {
  type        = string
  description = "Instance type for the EKS worker nodes"
  default     = "m5.large"
}

variable "eks_desired_capacity" {
  type        = number
  description = "Desired number of worker nodes in the EKS cluster"
  default     = 3
}

variable "eks_min_size" {
  type        = number
  description = "Minimum number of worker nodes in the EKS cluster"
  default     = 3
}

variable "eks_max_size" {
  type        = number
  description = "Maximum number of worker nodes in the EKS cluster"
  default     = 20
}

# RDS database configuration
variable "rds_instance_type" {
  type        = string
  description = "Instance type for the RDS database"
  default     = "db.m5.2xlarge"
}

variable "rds_allocated_storage" {
  type        = number
  description = "Allocated storage for the RDS database in GB"
  default     = 100
}

variable "rds_engine_version" {
  type        = string
  description = "PostgreSQL engine version for the RDS database"
  default     = "14.7"
}

variable "rds_multi_az" {
  type        = bool
  description = "Enable multi-AZ deployment for the RDS database"
  default     = true
}

variable "rds_backup_retention_period" {
  type        = number
  description = "Number of days to retain RDS backups"
  default     = 30
}

variable "rds_deletion_protection" {
  type        = bool
  description = "Enable deletion protection for the RDS database"
  default     = true
}

variable "rds_performance_insights_enabled" {
  type        = bool
  description = "Enable Performance Insights for the RDS database"
  default     = true
}

variable "rds_performance_insights_retention_period" {
  type        = number
  description = "Retention period for Performance Insights data in days"
  default     = 30
}

# ElastiCache Redis configuration
variable "elasticache_node_type" {
  type        = string
  description = "Node type for the ElastiCache Redis cluster"
  default     = "cache.m5.2xlarge"
}

variable "elasticache_num_cache_nodes" {
  type        = number
  description = "Number of cache nodes in the ElastiCache Redis cluster"
  default     = 3
}

variable "elasticache_engine_version" {
  type        = string
  description = "Redis engine version for the ElastiCache cluster"
  default     = "7.0"
}

variable "elasticache_automatic_failover_enabled" {
  type        = bool
  description = "Enable automatic failover for the ElastiCache Redis cluster"
  default     = true
}

# MSK Kafka configuration
variable "msk_instance_type" {
  type        = string
  description = "Instance type for the MSK Kafka brokers"
  default     = "kafka.m5.2xlarge"
}

variable "msk_broker_count" {
  type        = number
  description = "Number of broker nodes in the MSK Kafka cluster"
  default     = 3
}

variable "msk_kafka_version" {
  type        = string
  description = "Kafka version for the MSK cluster"
  default     = "3.2.1"
}

# S3 storage configuration
variable "s3_versioning_enabled" {
  type        = bool
  description = "Enable versioning for the S3 bucket"
  default     = true
}

variable "s3_encryption_enabled" {
  type        = bool
  description = "Enable server-side encryption for the S3 bucket"
  default     = true
}

# Sensitive configuration
variable "db_username" {
  type        = string
  description = "Username for the RDS database administrator"
  default     = "dbadmin"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "Password for the RDS database administrator"
  sensitive   = true
}