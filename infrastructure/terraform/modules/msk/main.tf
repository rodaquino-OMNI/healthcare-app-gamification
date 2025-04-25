# Security group for MSK broker nodes
resource "aws_security_group" "msk_broker" {
  name        = "${var.project_name}-${var.environment}-msk-sg"
  description = "Security group for MSK broker nodes"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "Plaintext Kafka broker access"
  }

  ingress {
    from_port   = 9094
    to_port     = 9094
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "TLS Kafka broker access"
  }

  ingress {
    from_port   = 2181
    to_port     = 2181
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "ZooKeeper access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-msk-sg"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# KMS key for MSK encryption
resource "aws_kms_key" "msk" {
  description             = "KMS key for MSK encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
  tags = {
    Name        = "${var.project_name}-${var.environment}-msk-kms"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Alias for the KMS key
resource "aws_kms_alias" "msk" {
  name          = "alias/${var.project_name}-${var.environment}-msk-key"
  target_key_id = aws_kms_key.msk.key_id
}

# CloudWatch log group for MSK broker logs
resource "aws_cloudwatch_log_group" "msk_broker_logs" {
  name              = "/aws/msk/${var.project_name}-${var.environment}-msk"
  retention_in_days = 30
  tags = {
    Name        = "${var.project_name}-${var.environment}-msk-logs"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# MSK configuration for the cluster
resource "aws_msk_configuration" "main" {
  name           = "${var.project_name}-${var.environment}-msk-config"
  kafka_versions = [var.msk_kafka_version]
  server_properties = {
    "auto.create.topics.enable"      = "true"
    "default.replication.factor"     = "3"
    "min.insync.replicas"            = "2"
    "num.io.threads"                 = "8"
    "num.network.threads"            = "5"
    "num.partitions"                 = "6"
    "num.replica.fetchers"           = "2"
    "replica.lag.time.max.ms"        = "30000"
    "socket.receive.buffer.bytes"    = "102400"
    "socket.request.max.bytes"       = "104857600"
    "socket.send.buffer.bytes"       = "102400"
    "unclean.leader.election.enable" = "true"
    "zookeeper.session.timeout.ms"   = "18000"
  }
}

# MSK cluster for the AUSTA SuperApp
resource "aws_msk_cluster" "main" {
  cluster_name           = "${var.project_name}-${var.environment}-msk"
  kafka_version          = var.msk_kafka_version
  number_of_broker_nodes = var.msk_broker_count

  broker_node_group_info {
    instance_type   = var.msk_instance_type
    client_subnets  = var.private_subnet_ids
    security_groups = [aws_security_group.msk_broker.id]
    storage_info {
      ebs_storage_info {
        volume_size = 1000
      }
    }
  }

  encryption_info {
    encryption_at_rest_kms_key_arn = aws_kms_key.msk.arn
    encryption_in_transit {
      client_broker = "TLS_PLAINTEXT"
      in_cluster    = true
    }
  }

  configuration_info {
    arn      = aws_msk_configuration.main.arn
    revision = aws_msk_configuration.main.latest_revision
  }

  logging_info {
    broker_logs {
      cloudwatch_logs {
        enabled   = true
        log_group = aws_cloudwatch_log_group.msk_broker_logs.name
      }
    }
  }

  open_monitoring {
    prometheus {
      jmx_exporter {
        enabled_in_broker = true
      }
      node_exporter {
        enabled_in_broker = true
      }
    }
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-msk"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Outputs
output "cluster_arn" {
  description = "The ARN of the MSK cluster"
  value       = aws_msk_cluster.main.arn
}

output "bootstrap_brokers" {
  description = "The connection string to the broker nodes (plaintext)"
  value       = aws_msk_cluster.main.bootstrap_brokers
}

output "bootstrap_brokers_tls" {
  description = "The TLS connection string to the broker nodes"
  value       = aws_msk_cluster.main.bootstrap_brokers_tls
}

output "zookeeper_connect_string" {
  description = "The connection string to the ZooKeeper nodes"
  value       = aws_msk_cluster.main.zookeeper_connect_string
}

output "security_group_id" {
  description = "The ID of the security group created for the MSK brokers"
  value       = aws_security_group.msk_broker.id
}

output "kms_key_arn" {
  description = "The ARN of the KMS key used for encryption"
  value       = aws_kms_key.msk.arn
}