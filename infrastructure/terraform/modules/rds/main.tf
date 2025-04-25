terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Define a Terraform-compliant name for the RDS instance
locals {
  name = "${var.db_name}-rds"
}

# Create a DB subnet group
resource "aws_db_subnet_group" "rds_subnet_group" {
  name        = local.name
  description = "The description of the DB subnet group."
  subnet_ids  = var.subnet_ids
  
  tags = {
    Name = local.name
  }
}

# Create the RDS instance
resource "aws_db_instance" "rds_instance" {
  allocated_storage                   = var.allocated_storage
  apply_immediately                   = true
  db_subnet_group_name                = aws_db_subnet_group.rds_subnet_group.name
  engine                              = var.engine
  engine_version                      = var.engine_version
  instance_class                      = var.instance_class
  name                                = var.db_name
  username                            = var.db_username
  password                            = var.db_password
  skip_final_snapshot                 = true
  vpc_security_group_ids              = var.vpc_security_group_ids
  multi_az                            = var.multi_az
  storage_type                        = var.storage_type
  iops                                = var.iops
  max_allocated_storage               = var.max_allocated_storage
  backup_retention_period             = var.backup_retention_period
  deletion_protection                 = var.deletion_protection
  performance_insights_enabled        = var.performance_insights_enabled
  performance_insights_kms_key_id     = var.performance_insights_kms_key_id
  performance_insights_retention_period = var.performance_insights_retention_period
  publicly_accessible                 = var.publicly_accessible
  
  tags = {
    Name = local.name
  }
}

# Variable definitions
variable "allocated_storage" {
  description = "The amount of storage (in gigabytes) to allocate for the RDS instance."
  type        = number
}

variable "engine" {
  description = "The database engine to use for the RDS instance."
  type        = string
}

variable "engine_version" {
  description = "The version of the database engine to use."
  type        = string
}

variable "instance_class" {
  description = "The instance type to use for the RDS instance."
  type        = string
}

variable "db_name" {
  description = "The name of the database to create."
  type        = string
}

variable "db_username" {
  description = "The username for the database."
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The password for the database."
  type        = string
  sensitive   = true
}

variable "vpc_security_group_ids" {
  description = "A list of VPC security group IDs to associate with the RDS instance."
  type        = list(string)
}

variable "subnet_ids" {
  description = "A list of subnet IDs to associate with the RDS instance."
  type        = list(string)
}

variable "multi_az" {
  description = "Specifies if the RDS instance is multi-AZ."
  type        = bool
  default     = false
}

variable "storage_type" {
  description = "The storage type to use for the RDS instance."
  type        = string
  default     = "gp2"
}

variable "iops" {
  description = "The number of I/O operations per second (IOPS) that the database provisions."
  type        = number
  default     = 0
}

variable "max_allocated_storage" {
  description = "The maximum allocated storage for the RDS instance."
  type        = number
  default     = 0
}

variable "backup_retention_period" {
  description = "The number of days to retain backups for."
  type        = number
  default     = 7
}

variable "deletion_protection" {
  description = "Specifies whether to enable deletion protection for the RDS instance."
  type        = bool
  default     = false
}

variable "performance_insights_enabled" {
  description = "Specifies whether to enable Performance Insights for the RDS instance."
  type        = bool
  default     = false
}

variable "performance_insights_kms_key_id" {
  description = "The KMS key ID to use for encrypting Performance Insights data."
  type        = string
  default     = ""
}

variable "performance_insights_retention_period" {
  description = "The retention period for Performance Insights data, in days."
  type        = number
  default     = 7
}

variable "publicly_accessible" {
  description = "Specifies whether the RDS instance is publicly accessible."
  type        = bool
  default     = false
}

# Output values
output "address" {
  description = "The address of the RDS instance."
  value       = aws_db_instance.rds_instance.address
}

output "port" {
  description = "The port of the RDS instance."
  value       = aws_db_instance.rds_instance.port
}

output "arn" {
  description = "The ARN of the RDS instance."
  value       = aws_db_instance.rds_instance.arn
}