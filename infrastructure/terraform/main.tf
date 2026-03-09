# AUSTA SuperApp Infrastructure Configuration
# This Terraform configuration provisions the core infrastructure components for the AUSTA SuperApp,
# including network, compute, database, caching, messaging, and storage resources.

# Network module - Creates VPC, subnets, route tables, NAT gateways, etc.
module "network" {
  source = "./modules/network"

  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = ["sa-east-1a", "sa-east-1b", "sa-east-1c"]
}

# EKS module - Creates Kubernetes cluster for containerized applications
# Note: Based on module inspection, this module doesn't use a node_groups parameter
# but instead creates predefined node groups internally
module "eks" {
  source = "./modules/eks"

  cluster_name       = "austa-superapp-cluster"
  vpc_id             = module.network.vpc_id
  public_subnet_ids  = module.network.public_subnet_ids
  private_subnet_ids = module.network.private_subnet_ids

  # Using the node_group_instance_types parameter instead of node_groups
  node_group_instance_types = ["m5.large", "c5.xlarge"]
  node_group_desired_size   = 3
  node_group_min_size       = 1
  node_group_max_size       = 20
}

# RDS module - Creates PostgreSQL database for primary data storage
module "rds" {
  source = "./modules/rds"

  db_name                 = var.database_name
  db_username             = var.database_username
  db_password             = var.database_password
  instance_class          = var.database_instance_class
  engine                  = "postgres"
  engine_version          = "14.6"
  allocated_storage       = 100
  multi_az                = true
  backup_retention_period = 30

  vpc_id             = module.network.vpc_id
  subnet_ids         = module.network.private_data_subnet_ids
  security_group_ids = [module.eks.worker_security_group_id]
}

# ElastiCache module - Creates Redis replication group for caching and real-time data
module "elasticache" {
  source = "./modules/elasticache"

  cluster_name         = "austa-redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = var.redis_num_cache_nodes
  subnet_group_name    = module.network.cache_subnet_group_name
  security_group_ids   = [module.eks.worker_security_group_id]
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
}

# MSK module - Creates Kafka cluster for event streaming
module "msk" {
  source = "./modules/msk"

  cluster_name           = "austa-kafka"
  kafka_version          = "3.4.0"
  number_of_broker_nodes = var.kafka_brokers
  broker_instance_type   = "kafka.m5.large"

  project_name   = var.project_name
  environment    = var.environment
  vpc_id         = module.network.vpc_id
  client_subnets = module.network.private_subnet_ids
}

# S3 module - Creates buckets for document storage and other assets
module "s3" {
  source = "./modules/s3"

  bucket_name        = "austa-superapp-documents"
  environment        = var.environment
  acl                = "private"
  versioning_enabled = true
  encryption_enabled = true

  lifecycle_rules = [{
    prefix  = "health/"
    enabled = true
    expiration = {
      days = 2555 # ~7 years retention for health documents
    }
    }, {
    prefix  = "care/"
    enabled = true
    expiration = {
      days = 730 # 2 years retention for care documents
    }
    }, {
    prefix  = "plan/"
    enabled = true
    expiration = {
      days = 1825 # 5 years retention for plan documents
    }
  }]
}

# Additional resources for monitoring, security, and compliance
module "monitoring" {
  source = "./modules/monitoring"

  cluster_name    = module.eks.cluster_name
  vpc_id          = module.network.vpc_id
  log_retention   = 90
  alarm_sns_topic = "arn:aws:sns:sa-east-1:123456789012:austa-alarms"

  # Journey-specific monitoring configuration
  journey_namespaces = ["health", "care", "plan", "gamification"]
}

module "waf" {
  source = "./modules/waf"

  name  = "austa-superapp-waf"
  scope = "REGIONAL"

  # Healthcare-specific rule sets
  managed_rule_groups = [
    "AWSManagedRulesCommonRuleSet",
    "AWSManagedRulesKnownBadInputsRuleSet",
    "AWSManagedRulesSQLiRuleSet"
  ]
}
