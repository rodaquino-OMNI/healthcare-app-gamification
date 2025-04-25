variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "sa-east-1"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., staging, production)"
}

variable "project_name" {
  type        = string
  description = "Name of the project"
}

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

variable "kafka_brokers" {
  type        = number
  description = "Number of Kafka brokers"
  default     = 3
}

variable "certificate_arn" {
  type        = string
  description = "ARN of the ACM certificate for the load balancer"
  default     = ""
}