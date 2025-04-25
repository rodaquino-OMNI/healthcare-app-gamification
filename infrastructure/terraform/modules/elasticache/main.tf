# ElastiCache cluster resource
resource "aws_elasticache_cluster" "elasticache_cluster" {
  cluster_id           = var.cluster_name
  engine               = "redis"
  node_type            = var.node_type
  num_cache_nodes      = 1
  engine_version       = var.engine_version
  port                 = var.port
  subnet_group_name    = var.subnet_group_name
  security_group_names = var.security_group_names
  
  tags = {
    Name = var.cluster_name
  }
}

# Variables
variable "cluster_name" {
  description = "The name of the ElastiCache cluster."
  type        = string
}

variable "engine_version" {
  description = "The version of the Redis engine to use."
  type        = string
  default     = "7.0"
}

variable "node_type" {
  description = "The type of node to use for the ElastiCache cluster."
  type        = string
  default     = "cache.m5.large"
}

variable "port" {
  description = "The port number to use for the ElastiCache cluster."
  type        = number
  default     = 6379
}

variable "subnet_group_name" {
  description = "The name of the subnet group to use for the ElastiCache cluster."
  type        = string
}

variable "security_group_names" {
  description = "A list of security group names to associate with the ElastiCache cluster."
  type        = list(string)
}

# Outputs
output "cluster_address" {
  description = "The address of the ElastiCache cluster."
  value       = aws_elasticache_cluster.elasticache_cluster.cache_nodes.0.address
}

output "cluster_port" {
  description = "The port of the ElastiCache cluster."
  value       = aws_elasticache_cluster.elasticache_cluster.port
}