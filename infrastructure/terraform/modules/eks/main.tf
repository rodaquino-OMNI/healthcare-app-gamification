# AWS and Kubernetes provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# Data sources
data "aws_region" "current" {}
data "aws_availability_zones" "available" {}
data "aws_caller_identity" "current" {}

#######################
# IAM Roles for EKS Cluster
#######################

# IAM role for the EKS cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.cluster_name}-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# Attach required policies to the EKS cluster role
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role_policy_attachment" "eks_service_policy" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
}

#######################
# Security Groups for EKS Cluster
#######################

# Security group for the EKS cluster
resource "aws_security_group" "eks_cluster_sg" {
  name        = "${var.cluster_name}-cluster-sg"
  description = "Security group for EKS cluster"
  vpc_id      = var.vpc_id

  tags = merge(var.map_roles, {
    Name = "${var.cluster_name}-cluster-sg"
  })
}

# Security group rule to allow API server access
resource "aws_security_group_rule" "eks_cluster_ingress" {
  security_group_id = aws_security_group.eks_cluster_sg.id
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow API server access"
}

# Security group rule to allow all outbound traffic from the cluster
resource "aws_security_group_rule" "eks_cluster_egress" {
  security_group_id = aws_security_group.eks_cluster_sg.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

#######################
# EKS Cluster
#######################

# Create the EKS cluster
resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = concat(var.private_subnet_ids, var.public_subnet_ids)
    security_group_ids      = [aws_security_group.eks_cluster_sg.id]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  # Add any cluster addons if specified
  dynamic "addon" {
    for_each = var.cluster_addons
    content {
      addon_name               = addon.key
      addon_version            = addon.value.version
      resolve_conflicts        = addon.value.resolve_conflicts
      configuration_values     = addon.value.configuration_values
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_service_policy
  ]
}

#######################
# IAM Roles for Node Groups
#######################

# IAM role for the EKS node groups
resource "aws_iam_role" "eks_node_role" {
  name = "${var.cluster_name}-node-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# Attach required policies to the node role
resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

#######################
# Security Groups for Node Groups
#######################

# Security group for the EKS worker nodes
resource "aws_security_group" "eks_nodes_sg" {
  name        = "${var.cluster_name}-nodes-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = var.vpc_id

  tags = merge(var.map_roles, {
    Name = "${var.cluster_name}-nodes-sg"
  })
}

# Security group rule to allow nodes to communicate with each other
resource "aws_security_group_rule" "nodes_internal_ingress" {
  security_group_id = aws_security_group.eks_nodes_sg.id
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  self              = true
  description       = "Allow nodes to communicate with each other"
}

# Security group rule to allow worker kubelets and pods to receive communication from the cluster control plane
resource "aws_security_group_rule" "nodes_cluster_ingress" {
  security_group_id        = aws_security_group.eks_nodes_sg.id
  type                     = "ingress"
  from_port                = 1025
  to_port                  = 65535
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_cluster_sg.id
  description              = "Allow worker Kubelets and pods to receive communication from the cluster control plane"
}

# Security group rule to allow pods running extension API servers on port 443 to receive communication from cluster control plane
resource "aws_security_group_rule" "nodes_cluster_https_ingress" {
  security_group_id        = aws_security_group.eks_nodes_sg.id
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.eks_cluster_sg.id
  description              = "Allow pods running extension API servers on port 443 to receive communication from cluster control plane"
}

# Security group rule to allow all outbound traffic from the nodes
resource "aws_security_group_rule" "nodes_egress" {
  security_group_id = aws_security_group.eks_nodes_sg.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

#######################
# EKS Node Groups
#######################

# Health Journey Node Group
resource "aws_eks_node_group" "health_journey" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "health-journey"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.node_group_instance_types

  scaling_config {
    desired_size = 3
    min_size     = 1
    max_size     = 20
  }

  labels = {
    journey = "health"
  }

  tags = merge(var.map_roles, {
    Name    = "${var.cluster_name}-health-journey"
    Journey = "health"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only
  ]
}

# Care Journey Node Group
resource "aws_eks_node_group" "care_journey" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "care-journey"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.node_group_instance_types

  scaling_config {
    desired_size = 5
    min_size     = 2
    max_size     = 30
  }

  labels = {
    journey = "care"
  }

  tags = merge(var.map_roles, {
    Name    = "${var.cluster_name}-care-journey"
    Journey = "care"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only
  ]
}

# Plan Journey Node Group
resource "aws_eks_node_group" "plan_journey" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "plan-journey"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.node_group_instance_types

  scaling_config {
    desired_size = 3
    min_size     = 1
    max_size     = 15
  }

  labels = {
    journey = "plan"
  }

  tags = merge(var.map_roles, {
    Name    = "${var.cluster_name}-plan-journey"
    Journey = "plan"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only
  ]
}

# Gamification Engine Node Group - Uses compute-optimized instances for event processing
resource "aws_eks_node_group" "gamification" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "gamification"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = ["c5.xlarge"] # Compute-optimized for event processing

  scaling_config {
    desired_size = 3
    min_size     = 1
    max_size     = 25
  }

  labels = {
    journey = "gamification"
  }

  tags = merge(var.map_roles, {
    Name    = "${var.cluster_name}-gamification"
    Journey = "gamification"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only
  ]
}

# Shared Services Node Group for monitoring, ingress controllers, etc.
resource "aws_eks_node_group" "shared_services" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "shared-services"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.node_group_instance_types

  scaling_config {
    desired_size = 3
    min_size     = 1
    max_size     = 10
  }

  labels = {
    service = "shared"
  }

  tags = merge(var.map_roles, {
    Name    = "${var.cluster_name}-shared-services"
    Service = "shared"
  })

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only
  ]
}

#######################
# Kubernetes Provider Configuration
#######################

# Configure the Kubernetes provider using the EKS cluster endpoint and certificate authority
provider "kubernetes" {
  host                   = aws_eks_cluster.this.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.this.certificate_authority[0].data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", aws_eks_cluster.this.name]
    command     = "aws"
  }
}

#######################
# Kubernetes Namespaces
#######################

# Create namespace for the Health Journey
resource "kubernetes_namespace" "health_journey" {
  metadata {
    name = "health-journey"
    labels = {
      journey = "health"
      name    = "health-journey"
    }
  }
}

# Create namespace for the Care Journey
resource "kubernetes_namespace" "care_journey" {
  metadata {
    name = "care-journey"
    labels = {
      journey = "care"
      name    = "care-journey"
    }
  }
}

# Create namespace for the Plan Journey
resource "kubernetes_namespace" "plan_journey" {
  metadata {
    name = "plan-journey"
    labels = {
      journey = "plan"
      name    = "plan-journey"
    }
  }
}

# Create namespace for the Gamification Engine
resource "kubernetes_namespace" "gamification" {
  metadata {
    name = "gamification"
    labels = {
      journey = "gamification"
      name    = "gamification"
    }
  }
}

# Create namespace for monitoring tools
resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
    labels = {
      service = "monitoring"
      name    = "monitoring"
    }
  }
}

# Create namespace for ingress controllers
resource "kubernetes_namespace" "ingress" {
  metadata {
    name = "ingress"
    labels = {
      service = "ingress"
      name    = "ingress"
    }
  }
}

#######################
# OIDC Provider Configuration for Service Account Integration
#######################

# Get the TLS certificate for the OIDC provider
data "tls_certificate" "eks" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

# Create the IAM OIDC Provider for the EKS cluster
resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

#######################
# Generate Kubeconfig
#######################

# Generate a kubeconfig file for the EKS cluster
resource "local_file" "kubeconfig" {
  content = templatefile("${path.module}/templates/kubeconfig.tpl", {
    cluster_name     = aws_eks_cluster.this.name
    cluster_endpoint = aws_eks_cluster.this.endpoint
    cluster_ca_data  = aws_eks_cluster.this.certificate_authority[0].data
    region           = data.aws_region.current.name
  })
  filename        = "${path.module}/kubeconfig"
  file_permission = "0600"
}