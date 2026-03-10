# AUSTA SuperApp Infrastructure Outputs
# These outputs provide important information about the provisioned infrastructure 
# that may be needed by other systems or for documentation purposes.

# Network outputs
output "vpc_id" {
  value       = module.network.vpc_id
  description = "The ID of the VPC"
}

output "public_subnet_ids" {
  value       = module.network.public_subnet_ids
  description = "IDs of the public subnets"
}

output "private_subnet_ids" {
  value       = module.network.private_subnet_ids
  description = "IDs of the private subnets"
}

# EKS outputs
output "cluster_name" {
  value       = module.eks.cluster_name
  description = "Name of the EKS cluster"
}

output "cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Endpoint for EKS control plane"
}

output "cluster_security_group_id" {
  value       = module.eks.cluster_security_group_id
  description = "Security group ID attached to the EKS cluster"
}

output "worker_security_group_id" {
  value       = module.eks.worker_security_group_id
  description = "Security group ID attached to the worker nodes"
}

output "kubeconfig_path" {
  value       = module.eks.kubeconfig_path
  description = "Path to the generated kubeconfig file"
  sensitive   = true
}

# RDS outputs
output "db_endpoint" {
  value       = module.rds.endpoint
  description = "The connection endpoint for the RDS database"
}

output "db_name" {
  value       = module.rds.name
  description = "The name of the database"
}

output "db_username" {
  value       = module.rds.username
  description = "The master username for the database"
  sensitive   = true
}

# ElastiCache outputs
output "redis_endpoint" {
  value       = module.elasticache.cluster_address
  description = "The connection endpoint for the Redis cluster"
}

output "redis_port" {
  value       = module.elasticache.cluster_port
  description = "The port on which the Redis cluster accepts connections"
}

# MSK outputs
output "bootstrap_brokers" {
  value       = module.msk.bootstrap_brokers
  description = "Plaintext connection host:port pairs for Kafka brokers"
}

output "bootstrap_brokers_tls" {
  value       = module.msk.bootstrap_brokers_tls
  description = "TLS connection host:port pairs for Kafka brokers"
}

# S3 outputs
output "document_bucket_name" {
  value       = module.s3.bucket_name
  description = "Name of the S3 bucket for documents"
}

output "document_bucket_arn" {
  value       = module.s3.bucket_arn
  description = "ARN of the S3 bucket for documents"
}

# Monitoring outputs
output "cloudwatch_log_group" {
  value       = module.monitoring.log_group_name
  description = "Name of the CloudWatch log group for application logs"
}

output "alarm_topic_arn" {
  value       = module.monitoring.alarm_topic_arn
  description = "ARN of the SNS topic for CloudWatch alarms"
}

# WAF outputs
output "waf_web_acl_id" {
  value       = module.waf.web_acl_id
  description = "ID of the WAF WebACL"
}

output "waf_web_acl_arn" {
  value       = module.waf.web_acl_arn
  description = "ARN of the WAF WebACL"
}