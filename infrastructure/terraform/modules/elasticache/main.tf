# ElastiCache Redis replication group for high availability
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = var.cluster_name
  description          = "Redis replication group for AUSTA SuperApp"

  node_type            = var.node_type
  num_cache_clusters   = var.num_cache_nodes
  engine_version       = var.engine_version
  port                 = var.port
  parameter_group_name = var.parameter_group_name
  subnet_group_name    = var.subnet_group_name
  security_group_ids   = var.security_group_ids

  automatic_failover_enabled = var.multi_az_enabled
  multi_az_enabled           = var.multi_az_enabled

  at_rest_encryption_enabled = var.at_rest_encryption_enabled
  transit_encryption_enabled = var.transit_encryption_enabled

  maintenance_window       = var.maintenance_window
  snapshot_retention_limit = var.snapshot_retention_limit
  snapshot_window          = var.snapshot_window

  auto_minor_version_upgrade = var.auto_minor_version_upgrade
  apply_immediately          = var.apply_immediately

  tags = var.tags
}
