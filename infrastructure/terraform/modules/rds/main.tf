# Define a Terraform-compliant name for the RDS instance
locals {
  name = "${var.db_name}-rds"
}

# Create a DB subnet group
resource "aws_db_subnet_group" "rds_subnet_group" {
  name        = local.name
  description = "The description of the DB subnet group."
  subnet_ids  = var.subnet_ids

  tags = {
    Name = local.name
  }
}

# Create the RDS instance
resource "aws_db_instance" "rds_instance" {
  allocated_storage                     = var.allocated_storage
  apply_immediately                     = true
  db_subnet_group_name                  = aws_db_subnet_group.rds_subnet_group.name
  engine                                = var.engine
  engine_version                        = var.engine_version
  instance_class                        = var.instance_class
  db_name                               = var.db_name
  username                              = var.db_username
  password                              = var.db_password
  skip_final_snapshot                   = true
  vpc_security_group_ids                = var.security_group_ids
  multi_az                              = var.multi_az
  backup_retention_period               = var.backup_retention_period
  deletion_protection                   = var.deletion_protection
  performance_insights_enabled          = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period
  publicly_accessible                   = var.publicly_accessible

  tags = {
    Name = local.name
  }
}
