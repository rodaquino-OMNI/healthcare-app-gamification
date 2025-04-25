# AWS General Configuration
variable "aws_region" {
  type        = string
  description = "AWS region for the staging environment"
  default     = "sa-east-1"
}

# Environment Naming
variable "environment_name" {
  type        = string
  description = "Name of the environment"
  default     = "staging"
}

variable "component_name" {
  type        = string
  description = "Name of the component being deployed"
  default     = "austa-superapp"
}

variable "prefix" {
  type        = string
  description = "Prefix for all resources in this environment"
  default     = "austa-staging"
}

# Compute Resources
variable "instance_type" {
  type        = string
  description = "EC2 instance type for the staging environment"
  default     = "t3.medium"
}

variable "min_size" {
  type        = number
  description = "Minimum number of instances in the autoscaling group"
  default     = 2
}

variable "max_size" {
  type        = number
  description = "Maximum number of instances in the autoscaling group"
  default     = 5
}

variable "desired_capacity" {
  type        = number
  description = "Desired number of instances in the autoscaling group"
  default     = 2
}

variable "key_name" {
  type        = string
  description = "Name of the SSH key pair to use for instances"
  default     = "austa-key"
}

# Note: AMI IDs are specific to regions, ensure this is correct for sa-east-1
variable "ami_id" {
  type        = string
  description = "AMI ID for the instances"
  default     = "ami-0c55b96356c9b182a"
}

# Network Configuration
variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the public subnet"
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  type        = string
  description = "CIDR block for the private subnet"
  default     = "10.0.2.0/24"
}

# Database Configuration
# NOTE: For production environments, sensitive values like usernames and passwords
# should be managed using AWS Secrets Manager or similar secure methods
variable "db_username" {
  type        = string
  description = "Username for the database"
  default     = "admin"
}

variable "db_password" {
  type        = string
  description = "Password for the database"
  default     = "admin123"
  sensitive   = true
}

variable "db_instance_class" {
  type        = string
  description = "Database instance class"
  default     = "db.t3.medium"
}