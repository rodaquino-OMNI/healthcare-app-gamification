# ElastiCache cluster resource
resource "aws_elasticache_cluster" "elasticache_cluster" {
  cluster_id         = var.cluster_name
  engine             = "redis"
  node_type          = var.node_type
  num_cache_nodes    = var.num_cache_nodes
  engine_version     = var.engine_version
  port               = var.port
  subnet_group_name  = var.subnet_group_name
  security_group_ids = var.security_group_ids

  tags = {
    Name = var.cluster_name
  }
}

# Variables are defined in variables.tf

# Outputs
output "cluster_address" {
  description = "The address of the ElastiCache cluster."
  value       = aws_elasticache_cluster.elasticache_cluster.cache_nodes[0].address
}

output "cluster_port" {
  description = "The port of the ElastiCache cluster."
  value       = aws_elasticache_cluster.elasticache_cluster.port
}