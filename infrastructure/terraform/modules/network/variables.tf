variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC network that will contain all AUSTA SuperApp resources"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "A list of availability zones to use for subnet creation to ensure high availability across the AUSTA SuperApp infrastructure"
}

variable "environment" {
  type        = string
  description = "The environment name (e.g., dev, staging, prod) for resource tagging and separation"
  default     = "dev"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets, one per availability zone, for resources that need to be internet-facing like load balancers"
  default     = []
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private subnets, one per availability zone, for resources that should not be directly accessible from the internet such as application servers and databases"
  default     = []
}

variable "enable_nat_gateway" {
  type        = bool
  description = "Whether to create NAT gateways for private subnets to enable outbound internet access for private resources while maintaining network isolation"
  default     = true
}

variable "single_nat_gateway" {
  type        = bool
  description = "Whether to use a single NAT gateway for all private subnets (cost-saving but reduces availability) or one per availability zone (higher availability but increased cost)"
  default     = false
}

variable "tags" {
  type        = map(string)
  description = "Additional tags to apply to all resources for better organization, cost tracking, and journey-based resource management"
  default     = {}
}