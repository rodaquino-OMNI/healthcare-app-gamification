output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the MSK cluster"
  value       = aws_msk_cluster.main.arn
}

output "bootstrap_brokers" {
  description = "The connection string for the broker nodes (plaintext)"
  value       = aws_msk_cluster.main.bootstrap_brokers
}

output "bootstrap_brokers_tls" {
  description = "The TLS connection string for the broker nodes"
  value       = aws_msk_cluster.main.bootstrap_brokers_tls
}

output "zookeeper_connect_string" {
  description = "The connection string for the ZooKeeper nodes"
  value       = aws_msk_cluster.main.zookeeper_connect_string
}

output "security_group_id" {
  description = "The ID of the security group created for the MSK brokers"
  value       = aws_security_group.msk_broker.id
}

output "configuration_arn" {
  description = "The ARN of the MSK configuration"
  value       = aws_msk_configuration.main.arn
}

output "configuration_revision" {
  description = "The revision of the MSK configuration"
  value       = aws_msk_configuration.main.latest_revision
}

output "encryption_kms_key_arn" {
  description = "The ARN of the KMS key used for encryption"
  value       = aws_kms_key.msk.arn
}