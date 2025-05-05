#!/bin/bash
# Terraform Wrapper Script for AUSTA SuperApp
# This script sets up the necessary environment for Terraform operations
# including AWS credentials, backend configuration, and workspace selection.

# Display usage information
function show_help {
  echo "Usage: $0 [options] <terraform_command> [terraform_args]"
  echo ""
  echo "Options:"
  echo "  -e, --environment ENV     Set the environment (dev, staging, prod)"
  echo "  -p, --profile PROFILE     Use specific AWS profile from credentials file"
  echo "  -r, --region REGION       Set AWS region (default: sa-east-1)"
  echo "  -h, --help                Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 -e dev -p austa-dev plan"
  echo "  $0 -e prod -r sa-east-1 apply -auto-approve"
  echo ""
}

# Default values
ENVIRONMENT="dev"
AWS_REGION="sa-east-1"
AWS_PROFILE=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -p|--profile)
      AWS_PROFILE="$2"
      shift 2
      ;;
    -r|--region)
      AWS_REGION="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      break
      ;;
  esac
done

# Check if we have any Terraform commands
if [ $# -eq 0 ]; then
  echo "Error: No Terraform command specified"
  show_help
  exit 1
fi

# Set Terraform command and arguments
TERRAFORM_CMD=$1
shift
TERRAFORM_ARGS=$@

# Environment-based configuration
case $ENVIRONMENT in
  dev)
    # Development environment settings
    export TF_VAR_environment="dev"
    export TF_VAR_aws_region=${AWS_REGION}
    ;;
  staging)
    # Staging environment settings
    export TF_VAR_environment="staging"
    export TF_VAR_aws_region=${AWS_REGION}
    ;;
  prod)
    # Production environment settings
    export TF_VAR_environment="prod"
    export TF_VAR_aws_region=${AWS_REGION}
    ;;
  *)
    echo "Error: Unknown environment '$ENVIRONMENT'"
    show_help
    exit 1
    ;;
esac

# Set AWS environment variables if profile is specified
if [ -n "$AWS_PROFILE" ]; then
  export AWS_PROFILE=$AWS_PROFILE
  echo "Using AWS profile: $AWS_PROFILE"
else
  # Prompt for AWS credentials if not using a profile
  if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo -n "AWS Access Key ID: "
    read -s AWS_ACCESS_KEY_ID
    export AWS_ACCESS_KEY_ID
    echo ""
  fi
  
  if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo -n "AWS Secret Access Key: "
    read -s AWS_SECRET_ACCESS_KEY
    export AWS_SECRET_ACCESS_KEY
    echo ""
  fi
fi

# Configure AWS region
export AWS_REGION=${AWS_REGION}
export AWS_DEFAULT_REGION=${AWS_REGION}

# Display configuration
echo "----------------------------------------"
echo "Terraform Wrapper Configuration:"
echo "  Environment: $ENVIRONMENT"
echo "  AWS Region: $AWS_REGION"
if [ -n "$AWS_PROFILE" ]; then
  echo "  AWS Profile: $AWS_PROFILE"
else
  echo "  Using AWS credentials from environment variables"
fi
echo "  Terraform Command: $TERRAFORM_CMD $TERRAFORM_ARGS"
echo "----------------------------------------"

# Check if we need to initialize a new workspace
if [ "$TERRAFORM_CMD" != "workspace" ] && [ "$TERRAFORM_CMD" != "init" ]; then
  # Check if workspace exists and select it
  WORKSPACE_EXISTS=$(terraform workspace list | grep -c "$ENVIRONMENT" || true)
  if [ "$WORKSPACE_EXISTS" -eq 0 ]; then
    echo "Creating new workspace: $ENVIRONMENT"
    terraform workspace new $ENVIRONMENT
  else
    echo "Selecting workspace: $ENVIRONMENT"
    terraform workspace select $ENVIRONMENT
  fi
fi

# Execute Terraform command
echo "Running: terraform $TERRAFORM_CMD $TERRAFORM_ARGS"
terraform $TERRAFORM_CMD $TERRAFORM_ARGS

# Capture exit status
STATUS=$?
echo "Terraform $TERRAFORM_CMD completed with status: $STATUS"
exit $STATUS