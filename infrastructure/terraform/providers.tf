terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
  required_version = ">= 1.5"
}

# Configure the AWS Provider for the primary region (Brazil)
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "AUSTA SuperApp"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Configure a secondary AWS Provider for disaster recovery in a different region
provider "aws" {
  alias  = "dr"
  region = "us-east-1"
  
  default_tags {
    tags = {
      Project     = "AUSTA SuperApp"
      Environment = "${var.environment}-dr"
      ManagedBy   = "Terraform"
    }
  }
}