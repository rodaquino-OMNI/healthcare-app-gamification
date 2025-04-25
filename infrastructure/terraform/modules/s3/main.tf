# AUSTA SuperApp S3 Module
# Implements secure S3 buckets with versioning, encryption, lifecycle rules, and
# cross-region replication for document storage and disaster recovery

# AWS Provider - should be configured in the root module
provider "aws" {
  # version ~> 5.0 - defined in calling module
}

# Main S3 bucket resource
resource "aws_s3_bucket" "main" {
  bucket        = "${var.bucket_name}-${var.environment}"
  acl           = var.acl
  tags          = var.tags
  force_destroy = false
}

# Bucket versioning configuration
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Disabled"
  }
}

# Server-side encryption configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  count  = var.encryption_enabled ? 1 : 0
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle rules for cost optimization
resource "aws_s3_bucket_lifecycle_configuration" "main" {
  count  = length(var.lifecycle_rules) > 0 ? 1 : 0
  bucket = aws_s3_bucket.main.id
  rule   = var.lifecycle_rules
}

# IAM role for S3 replication
resource "aws_iam_role" "replication" {
  count = var.replication_enabled ? 1 : 0
  name  = "${var.bucket_name}-replication-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# IAM policy for S3 replication
resource "aws_iam_policy" "replication" {
  count = var.replication_enabled ? 1 : 0
  name  = "${var.bucket_name}-replication-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetReplicationConfiguration",
          "s3:ListBucket"
        ]
        Resource = [aws_s3_bucket.main.arn]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObjectVersion",
          "s3:GetObjectVersionAcl"
        ]
        Resource = ["${aws_s3_bucket.main.arn}/*"]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ReplicateObject",
          "s3:ReplicateDelete"
        ]
        Resource = "${var.replication_destination}/*"
      }
    ]
  })
}

# Attach the replication policy to the role
resource "aws_iam_role_policy_attachment" "replication" {
  count      = var.replication_enabled ? 1 : 0
  role       = aws_iam_role.replication[0].name
  policy_arn = aws_iam_policy.replication[0].arn
}

# Configure cross-region replication for disaster recovery
resource "aws_s3_bucket_replication_configuration" "main" {
  count  = var.replication_enabled ? 1 : 0
  bucket = aws_s3_bucket.main.id
  role   = aws_iam_role.replication[0].arn

  rule {
    id     = "EntireBucketReplication"
    status = "Enabled"

    destination {
      bucket        = var.replication_destination
      storage_class = "STANDARD_IA" # Lower cost for DR data
    }
  }

  # Dependencies need to be met before enabling replication
  depends_on = [aws_s3_bucket_versioning.main]
}

# Block public access for security
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS configuration for web access from the application domain
resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["https://*.austa.com.br"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}