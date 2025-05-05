# WAF module for AUSTA SuperApp
# This module configures AWS Web Application Firewall rules for healthcare applications

variable "name" {
  description = "Name for the WAF WebACL"
  type        = string
}

variable "scope" {
  description = "Scope of the WAF - REGIONAL or CLOUDFRONT"
  type        = string
  default     = "REGIONAL"
}

variable "managed_rule_groups" {
  description = "List of AWS managed rule groups to include"
  type        = list(string)
  default     = []
}

resource "aws_wafv2_web_acl" "main" {
  name  = var.name
  scope = var.scope
  
  default_action {
    allow {}
  }
  
  # This is a simplified placeholder for demonstration
  # In production, you would configure proper rules
  
  # Sample rule for demonstration
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = var.name
    sampled_requests_enabled   = true
  }
}

output "web_acl_id" {
  value       = aws_wafv2_web_acl.main.id
  description = "ID of the WAF WebACL"
}

output "web_acl_arn" {
  value       = aws_wafv2_web_acl.main.arn
  description = "ARN of the WAF WebACL"
}
