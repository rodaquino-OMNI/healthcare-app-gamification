variable "cluster_name" {
  description = "The name of the ElastiCache Redis cluster."
  type        = string
  default     = "austa-redis"
}

variable "engine" {
  description = "The name of the cache engine to be used for the cluster."
  type        = string
  default     = "redis"
}

variable "engine_version" {
  description = "The version number of the cache engine to be used for the cluster."
  type        = string
  default     = "7.0"
}

variable "node_type" {
  description = "The compute and memory capacity of the nodes in the cluster."
  type        = string
  default     = "cache.m5.large"
}

variable "num_cache_nodes" {
  description = "The number of cache nodes in the cluster."
  type        = number
  default     = 1
}

variable "port" {
  description = "The port number on which each of the cache nodes will accept connections."
  type        = number
  default     = 6379
}

variable "subnet_group_name" {
  description = "The name of the subnet group to be used for the cluster."
  type        = string
}

variable "security_group_ids" {
  description = "A list of security group IDs to associate with the cluster."
  type        = list(string)
}

variable "parameter_group_name" {
  description = "The name of the parameter group to associate with the cluster."
  type        = string
  default     = "default.redis7"
}

variable "maintenance_window" {
  description = "The weekly time range for system maintenance."
  type        = string
  default     = "sun:05:00-sun:09:00"
}

variable "snapshot_retention_limit" {
  description = "The number of days for which ElastiCache will retain automatic snapshots."
  type        = number
  default     = 7
}

variable "snapshot_window" {
  description = "The daily time range during which automated backups are created."
  type        = string
  default     = "03:00-05:00"
}

variable "apply_immediately" {
  description = "Whether any modifications are applied immediately or during the maintenance window."
  type        = bool
  default     = false
}

variable "auto_minor_version_upgrade" {
  description = "Whether to automatically upgrade to new minor versions during the maintenance window."
  type        = bool
  default     = true
}

variable "multi_az_enabled" {
  description = "Whether to enable Multi-AZ support for the cluster."
  type        = bool
  default     = true
}

variable "at_rest_encryption_enabled" {
  description = "Whether to enable encryption at rest."
  type        = bool
  default     = true
}

variable "transit_encryption_enabled" {
  description = "Whether to enable encryption in transit."
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to assign to the resource."
  type        = map(string)
  default = {
    Environment = "production"
    Terraform   = "true"
    Application = "AUSTA SuperApp"
  }
}