variable "name" {
  description = "Name of the RDS instance."
  type        = string
  default     = "austa-rds"
}

variable "engine" {
  description = "Database engine type (e.g., postgres, mysql)."
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Version of the database engine."
  type        = string
  default     = "14"
}

variable "instance_class" {
  description = "Instance class for the RDS instance (e.g., db.m5.large)."
  type        = string
  default     = "db.m5.large"
}

variable "allocated_storage" {
  description = "Allocated storage size in GB."
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Name of the initial database to create."
  type        = string
  default     = "austa"
}

variable "db_username" {
  description = "Username for the database administrator."
  type        = string
  default     = "austa_admin"
}

variable "db_password" {
  description = "Password for the database administrator."
  type        = string
  sensitive   = true
}

variable "vpc_id" {
  description = "VPC ID where the RDS instance will be created."
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the RDS instance."
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for the RDS instance."
  type        = list(string)
}

variable "multi_az" {
  description = "Enable multi-AZ deployment for high availability."
  type        = bool
  default     = true
}

variable "publicly_accessible" {
  description = "Whether the RDS instance is publicly accessible."
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Number of days to retain backups."
  type        = number
  default     = 7
}

variable "maintenance_window" {
  description = "Preferred maintenance window (e.g., Sun:05:00-Sun:09:00)."
  type        = string
  default     = "Sun:05:00-Sun:09:00"
}

variable "apply_immediately" {
  description = "Whether to apply changes immediately or during the maintenance window."
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection to prevent accidental deletion."
  type        = bool
  default     = true
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights for monitoring database performance."
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Retention period for Performance Insights data (in days)."
  type        = number
  default     = 7
}

variable "tags" {
  description = "Tags to apply to the RDS instance."
  type        = map(string)
  default = {
    Environment = "dev"
    Terraform   = "true"
  }
}