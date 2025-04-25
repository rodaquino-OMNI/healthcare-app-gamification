# Terraform configuration for AUSTA SuperApp production environment

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = "sa-east-1"
}

data "aws_availability_zones" "available" {
  state = "available"
}

variable "db_password" {
  type        = string
  description = "The password for the database"
}

module "network" {
  source             = "../modules/network"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = data.aws_availability_zones.available.names
}

module "eks" {
  source       = "../modules/eks"
  cluster_name = "austa-prod"
  vpc_id       = module.network.vpc_id
  subnet_ids   = module.network.private_subnet_ids
  desired_size = 3
  max_size     = 10
  min_size     = 3
}

module "rds" {
  source                 = "../modules/rds"
  db_name                = "austa_prod"
  db_username            = "dbadmin"
  db_password            = var.db_password
  vpc_security_group_ids = [module.network.db_security_group_id]
  subnet_ids             = module.network.private_subnet_ids
}

module "elasticache" {
  source             = "../modules/elasticache"
  cluster_name       = "austa-cache-prod"
  subnet_ids         = module.network.private_subnet_ids
  security_group_ids = [module.network.cache_security_group_id]
}

module "msk" {
  source             = "../modules/msk"
  cluster_name       = "austa-kafka-prod"
  subnet_ids         = module.network.private_subnet_ids
  security_group_ids = [module.network.kafka_security_group_id]
}

module "s3" {
  source      = "../modules/s3"
  bucket_name = "austa-documents-prod"
  acl         = "private"
}