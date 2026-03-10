# AWS General Configuration
variable "aws_region" {
  type        = string
  description = "AWS region for the staging environment"
  default     = "sa-east-1"
}

# Environment Naming
variable "environment" {
  type        = string
  description = "Name of the environment"
  default     = "staging"
}

variable "project_name" {
  type        = string
  description = "Name of the project used for resource naming"
  default     = "austa"
}

# Network Configuration
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

# Database Configuration
variable "database_name" {
  type        = string
  description = "Name of the PostgreSQL database"
  default     = "austa"
}

variable "database_username" {
  type        = string
  description = "Username for the PostgreSQL database"
  sensitive   = true
}

variable "database_password" {
  type        = string
  description = "Password for the PostgreSQL database"
  sensitive   = true
}

variable "database_instance_class" {
  type        = string
  description = "Instance class for the PostgreSQL database"
  default     = "db.m5.large"
}

# EKS Configuration
variable "eks_cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
  default     = "austa-staging-eks"
}

variable "eks_cluster_version" {
  type        = string
  description = "Kubernetes version for the EKS cluster"
  default     = "1.25"
}

variable "eks_node_group_instance_types" {
  type        = map(list(string))
  description = "Map of node group names to their instance types"
  default = {
    default      = ["t3.large"]
    health       = ["t3.large"]
    care         = ["t3.large"]
    plan         = ["t3.large"]
    gamification = ["c5.large"]
  }
}

variable "journey_node_groups" {
  type = map(object({
    desired_size = number
    min_size     = number
    max_size     = number
  }))
  description = "Journey-specific node group scaling configuration"
  default = {
    health = {
      desired_size = 2
      min_size     = 2
      max_size     = 5
    }
    care = {
      desired_size = 3
      min_size     = 2
      max_size     = 6
    }
    plan = {
      desired_size = 2
      min_size     = 2
      max_size     = 4
    }
    gamification = {
      desired_size = 2
      min_size     = 2
      max_size     = 5
    }
  }
}

# RDS PostgreSQL Configuration
variable "rds_instance_class" {
  type        = string
  description = "Instance class for the RDS database"
  default     = "db.m5.large"
}

variable "rds_allocated_storage" {
  type        = number
  description = "Allocated storage for the RDS database in GB"
  default     = 50
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
  default     = 7
}

# ElastiCache Redis Configuration
variable "elasticache_node_type" {
  type        = string
  description = "Node type for the ElastiCache Redis cluster"
  default     = "cache.m5.large"
}

variable "elasticache_engine_version" {
  type        = string
  description = "Redis engine version for the ElastiCache cluster"
  default     = "7.0"
}

variable "elasticache_num_cache_nodes" {
  type        = number
  description = "Number of cache nodes in the ElastiCache Redis cluster"
  default     = 3
}

# MSK Kafka Configuration
variable "msk_instance_type" {
  type        = string
  description = "Instance type for the MSK Kafka brokers"
  default     = "kafka.m5.large"
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

# S3 Configuration
variable "s3_bucket_names" {
  type        = map(string)
  description = "Map of S3 bucket purpose to bucket name"
  default = {
    documents = "austa-staging-documents"
    media     = "austa-staging-media"
    logs      = "austa-staging-logs"
    backups   = "austa-staging-backups"
  }
}

# Security Features
variable "enable_waf" {
  type        = bool
  description = "Enable WAF for the environment"
  default     = true
}

variable "enable_cloudfront" {
  type        = bool
  description = "Enable CloudFront distribution"
  default     = true
}

variable "enable_cross_region_replication" {
  type        = bool
  description = "Enable cross-region replication for S3 buckets"
  default     = false
}

# Redis Configuration (legacy variables from tfvars)
variable "redis_node_type" {
  type        = string
  description = "Instance type for the Redis cluster"
  default     = "cache.m5.large"
}

variable "redis_num_cache_nodes" {
  type        = number
  description = "Number of cache nodes in the Redis cluster"
  default     = 3
}

# Kafka Configuration (legacy variable from tfvars)
variable "kafka_brokers" {
  type        = number
  description = "Number of Kafka brokers"
  default     = 3
}

# Resource Tagging
variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default = {
    Environment = "staging"
    Project     = "austa-superapp"
    ManagedBy   = "Terraform"
    Application = "AUSTA SuperApp"
  }
}
