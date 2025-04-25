# Cluster outputs
output "cluster_id" {
  description = "The ID of the EKS cluster"
  value       = aws_eks_cluster.this.id
}

output "cluster_name" {
  description = "The name of the EKS cluster"
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "The endpoint for the Kubernetes API server"
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_certificate_authority_data" {
  description = "The base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.this.certificate_authority[0].data
}

# OIDC Provider outputs
output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider for the EKS cluster"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "The URL of the OIDC Provider for the EKS cluster"
  value       = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

# Node group outputs
output "health_journey_node_group_id" {
  description = "The ID of the Health Journey node group"
  value       = aws_eks_node_group.health_journey.id
}

output "care_journey_node_group_id" {
  description = "The ID of the Care Journey node group"
  value       = aws_eks_node_group.care_journey.id
}

output "plan_journey_node_group_id" {
  description = "The ID of the Plan Journey node group"
  value       = aws_eks_node_group.plan_journey.id
}

output "gamification_node_group_id" {
  description = "The ID of the Gamification node group"
  value       = aws_eks_node_group.gamification.id
}

output "shared_services_node_group_id" {
  description = "The ID of the Shared Services node group"
  value       = aws_eks_node_group.shared_services.id
}

# Namespace outputs
output "journey_namespaces" {
  description = "Map of journey names to their Kubernetes namespace names"
  value = {
    health        = kubernetes_namespace.health_journey.metadata[0].name
    care          = kubernetes_namespace.care_journey.metadata[0].name
    plan          = kubernetes_namespace.plan_journey.metadata[0].name
    gamification  = kubernetes_namespace.gamification.metadata[0].name
  }
}

# Kubeconfig output
output "kubeconfig_path" {
  description = "The path to the generated kubeconfig file"
  value       = local_file.kubeconfig.filename
}

# Node group status output
output "node_groups_status" {
  description = "Map of node group names to their current status"
  value = {
    health_journey  = aws_eks_node_group.health_journey.status
    care_journey    = aws_eks_node_group.care_journey.status
    plan_journey    = aws_eks_node_group.plan_journey.status
    gamification    = aws_eks_node_group.gamification.status
    shared_services = aws_eks_node_group.shared_services.status
  }
}