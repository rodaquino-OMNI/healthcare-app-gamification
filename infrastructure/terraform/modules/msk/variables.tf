variable "cluster_name" {
  type        = string
  description = "The name of the MSK cluster."
  default     = "austa-msk-cluster"
}

variable "kafka_version" {
  type        = string
  description = "The version of Kafka to use for the MSK cluster."
  default     = "3.4.0"
}

variable "broker_count" {
  type        = number
  description = "The number of broker nodes in the MSK cluster."
  default     = 3
}

variable "broker_instance_type" {
  type        = string
  description = "The instance type to use for the broker nodes."
  default     = "kafka.m5.large"
}

variable "vpc_id" {
  type        = string
  description = "The VPC ID where the MSK cluster will be deployed."
}

variable "broker_subnet_ids" {
  type        = list(string)
  description = "A list of subnet IDs to place the broker nodes in."
}

variable "security_groups" {
  type        = list(string)
  description = "A list of security group IDs to associate with the broker nodes."
  default     = []
}

variable "project_name" {
  type        = string
  description = "The project name used for resource naming and tagging."
  default     = "austa"
}

variable "environment" {
  type        = string
  description = "The environment name (e.g., dev, staging, prod)."
  default     = "dev"
}

variable "ebs_volume_size" {
  type        = number
  description = "The size of the EBS volume for each broker node, in GiB."
  default     = 1000
}

variable "tags" {
  type        = map(string)
  description = "A map of tags to apply to the MSK cluster."
  default = {
    Project     = "AUSTA SuperApp"
    Environment = "dev"
  }
}
