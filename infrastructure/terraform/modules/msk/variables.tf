variable "cluster_name" {
  type        = string
  description = "The name of the MSK cluster."
  default     = "austa-msk-cluster"
}

variable "kafka_version" {
  type        = string
  description = "The version of Kafka to use for the MSK cluster."
  default     = "3.2.0"
}

variable "number_of_broker_nodes" {
  type        = number
  description = "The number of broker nodes in the MSK cluster."
  default     = 3
}

variable "broker_instance_type" {
  type        = string
  description = "The instance type to use for the broker nodes."
  default     = "kafka.m5.large"
}

variable "client_subnets" {
  type        = list(string)
  description = "A list of subnet IDs to place the broker nodes in."
  default     = []
}

variable "security_group_id" {
  type        = string
  description = "The ID of the security group to associate with the broker nodes."
  default     = ""
}

variable "ebs_volume_size" {
  type        = number
  description = "The size of the EBS volume for each broker node, in GiB."
  default     = 100
}

variable "enhanced_monitoring" {
  type        = string
  description = "Specifies the level of monitoring for the MSK cluster. Valid values: DEFAULT, PER_BROKER, PER_TOPIC_PER_BROKER, PER_PARTITION_PER_BROKER."
  default     = "DEFAULT"
}

variable "open_monitoring" {
  type        = bool
  description = "Enable or disable open monitoring with Prometheus."
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "A map of tags to apply to the MSK cluster."
  default = {
    Project     = "AUSTA SuperApp"
    Environment = "dev"
  }
}