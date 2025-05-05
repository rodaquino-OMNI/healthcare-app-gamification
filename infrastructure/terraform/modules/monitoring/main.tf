# Monitoring module for AUSTA SuperApp
# This module configures CloudWatch monitoring and alerting for the application

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "log_retention" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}

variable "alarm_sns_topic" {
  description = "ARN of the SNS topic for alarms"
  type        = string
}

variable "journey_namespaces" {
  description = "List of journey namespaces to monitor"
  type        = list(string)
  default     = []
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/eks/${var.cluster_name}/app"
  retention_in_days = var.log_retention
}

output "log_group_name" {
  value       = aws_cloudwatch_log_group.app_logs.name
  description = "Name of the CloudWatch log group for application logs"
}

output "alarm_topic_arn" {
  value       = var.alarm_sns_topic
  description = "ARN of the SNS topic for CloudWatch alarms"
}
