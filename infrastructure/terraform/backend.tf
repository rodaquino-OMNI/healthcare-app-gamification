# Configure Terraform backend for state storage and locking
terraform {
  # Using S3 for state storage with DynamoDB for state locking
  backend "s3" {
    bucket         = "austa-terraform-state"
    key            = "global/s3/terraform.tfstate"
    region         = "sa-east-1"
    dynamodb_table = "austa-terraform-locks"
    encrypt        = true
    # Encryption enabled for security of sensitive infrastructure data
  }
}