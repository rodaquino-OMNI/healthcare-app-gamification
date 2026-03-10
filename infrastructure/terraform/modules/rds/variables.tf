# Required variables (no defaults — must be explicitly provided)

variable "engine" {
  description = "Database engine type (e.g., postgres, mysql)."
  type        = string
}

variable "engine_version" {
  description = "Version of the database engine."
  type        = string
}

variable "instance_class" {
  description = "Instance class for the RDS instance (e.g., db.m5.large)."
  type        = string
}

variable "allocated_storage" {
  description = "Allocated storage size in GB."
  type        = number
}

variable "db_name" {
  description = "Name of the initial database to create."
  type        = string
}

variable "db_username" {
  description = "Username for the database administrator."
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Password for the database administrator."
  type        = string
  sensitive   = true
}

variable "subnet_ids" {
  description = "List of subnet IDs for the DB subnet group."
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for the RDS instance."
  type        = list(string)
}

# Optional variables (with safe production defaults)

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

variable "performance_insights_kms_key_id" {
  description = "The KMS key ID to use for encrypting Performance Insights data."
  type        = string
  default     = ""
}

variable "storage_type" {
  description = "The storage type for the RDS instance (gp2, gp3, io1)."
  type        = string
  default     = "gp2"
}

variable "iops" {
  description = "Provisioned IOPS for the RDS instance (only for io1/gp3 storage)."
  type        = number
  default     = 0
}

variable "max_allocated_storage" {
  description = "Upper limit for storage autoscaling (0 disables autoscaling)."
  type        = number
  default     = 0
}
