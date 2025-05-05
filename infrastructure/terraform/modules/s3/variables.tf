variable "bucket_name" {
  type        = string
  description = "Name of the S3 bucket to create"
}

variable "environment" {
  type        = string
  description = "Environment name for resource naming and tagging"
  default     = "dev"
}

variable "acl" {
  type        = string
  description = "Access control list for the bucket"
  default     = "private"
}

variable "versioning_enabled" {
  type        = bool
  description = "Whether to enable versioning for the bucket"
  default     = true
}

variable "encryption_enabled" {
  type        = bool
  description = "Whether to enable default encryption for the bucket"
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to the bucket"
  default     = {
    Project     = "AUSTA SuperApp"
    ManagedBy   = "Terraform"
  }
}

variable "replication_enabled" {
  type        = bool
  description = "Whether to enable cross-region replication for disaster recovery"
  default     = false
}

variable "replication_destination" {
  type        = string
  description = "Destination bucket ARN for replication"
  default     = ""
}

variable "lifecycle_rules" {
  description = "List of lifecycle rules for the S3 bucket"
  type = list(object({
    id      = optional(string)
    prefix  = optional(string)
    enabled = bool
    expiration = optional(object({
      days                         = optional(number)
      date                         = optional(string)
      expired_object_delete_marker = optional(bool)
    }))
    transitions = optional(list(object({
      days          = optional(number)
      date          = optional(string)
      storage_class = string
    })))
    noncurrent_version_expiration = optional(object({
      days = number
    }))
    noncurrent_version_transitions = optional(list(object({
      days          = number
      storage_class = string
    })))
    abort_incomplete_multipart_upload_days = optional(number)
  }))
  default = []
}