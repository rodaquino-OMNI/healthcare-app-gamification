variable "cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
  default     = "austa-eks-cluster"
}

variable "cluster_version" {
  type        = string
  description = "Kubernetes version for the EKS cluster"
  default     = "1.25"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID for the EKS cluster"
  default     = ""
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for the EKS cluster"
  default     = []
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs for the EKS cluster"
  default     = []
}

variable "map_roles" {
  type = list(object({
    rolearn  = string
    username = string
    groups   = list(string)
  }))
  description = "IAM roles to map to Kubernetes users and groups"
  default     = []
}

variable "map_users" {
  type = list(object({
    userarn  = string
    username = string
    groups   = list(string)
  }))
  description = "IAM users to map to Kubernetes users and groups"
  default     = []
}

variable "cluster_addons" {
  type = map(object({
    configuration_values = string
    resolve_conflicts    = string
    version              = string
  }))
  description = "EKS addons to install"
  default     = {}
}

variable "oidc_providers" {
  type = list(object({
    client_id_list            = list(string)
    iam_role_arn              = string
    issuer_url                = string
    namespace_service_account = string
  }))
  description = "OIDC providers to configure for the cluster"
  default     = []
}

variable "node_group_ami_family" {
  type        = string
  description = "The AMI family for the worker nodes"
  default     = "AmazonLinux2"
}

variable "node_group_instance_types" {
  type        = list(string)
  description = "The instance types for the worker nodes"
  default     = ["t3.medium"]
}

variable "node_group_desired_size" {
  type        = number
  description = "The desired number of worker nodes"
  default     = 1
}

variable "node_group_max_size" {
  type        = number
  description = "The maximum number of worker nodes"
  default     = 3
}

variable "node_group_min_size" {
  type        = number
  description = "The minimum number of worker nodes"
  default     = 1
}

variable "fargate_profiles" {
  type = list(object({
    name = string
    selectors = list(object({
      namespace = string
      labels    = map(string)
    }))
  }))
  description = "Fargate profiles to create"
  default     = []
}