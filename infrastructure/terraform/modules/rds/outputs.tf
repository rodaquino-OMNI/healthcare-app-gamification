output "endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.rds_instance.endpoint
}

output "db_endpoint" {
  description = "The connection endpoint for the RDS instance (alias)"
  value       = aws_db_instance.rds_instance.endpoint
}

output "address" {
  description = "The hostname of the RDS instance"
  value       = aws_db_instance.rds_instance.address
}

output "port" {
  description = "The port on which the RDS instance accepts connections"
  value       = aws_db_instance.rds_instance.port
}

output "arn" {
  description = "The ARN (Amazon Resource Name) of the RDS instance"
  value       = aws_db_instance.rds_instance.arn
}

output "id" {
  description = "The RDS instance ID"
  value       = aws_db_instance.rds_instance.id
}

output "resource_id" {
  description = "The RDS resource ID"
  value       = aws_db_instance.rds_instance.resource_id
}

output "name" {
  description = "The database name"
  value       = aws_db_instance.rds_instance.db_name
}

output "db_name" {
  description = "The database name (alias)"
  value       = aws_db_instance.rds_instance.db_name
}

output "username" {
  description = "The master username for the database"
  value       = aws_db_instance.rds_instance.username
  sensitive   = true
}

output "db_username" {
  description = "The master username for the database (alias)"
  value       = aws_db_instance.rds_instance.username
  sensitive   = true
}

output "engine" {
  description = "The database engine used by the RDS instance"
  value       = aws_db_instance.rds_instance.engine
}

output "engine_version" {
  description = "The running version of the database engine"
  value       = aws_db_instance.rds_instance.engine_version
}

output "connection_string" {
  description = "PostgreSQL connection string for the database"
  value       = format("postgresql://%s:%s@%s:%s/%s", aws_db_instance.rds_instance.username, var.db_password, aws_db_instance.rds_instance.address, aws_db_instance.rds_instance.port, aws_db_instance.rds_instance.db_name)
  sensitive   = true
}

output "db_subnet_group_name" {
  description = "The name of the DB subnet group"
  value       = aws_db_subnet_group.rds_subnet_group.name
}

output "multi_az" {
  description = "Whether the RDS instance is multi-AZ"
  value       = aws_db_instance.rds_instance.multi_az
}

output "availability_zone" {
  description = "The availability zone of the RDS instance"
  value       = aws_db_instance.rds_instance.availability_zone
}

output "backup_retention_period" {
  description = "The backup retention period"
  value       = aws_db_instance.rds_instance.backup_retention_period
}
