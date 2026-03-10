output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.austa_vpc.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public_subnets[*].id
}

output "private_subnet_ids" {
  description = "List of private application subnet IDs"
  value       = aws_subnet.private_app_subnets[*].id
}

output "private_app_subnet_ids" {
  description = "List of private application subnet IDs (alias for private_subnet_ids)"
  value       = aws_subnet.private_app_subnets[*].id
}

output "private_data_subnet_ids" {
  description = "List of private data subnet IDs"
  value       = aws_subnet.private_data_subnets[*].id
}

output "security_group_id" {
  description = "The ID of the default outbound security group"
  value       = aws_security_group.allow_all_outbound.id
}

output "allow_all_outbound_sg_id" {
  description = "The ID of the security group allowing all outbound traffic"
  value       = aws_security_group.allow_all_outbound.id
}

output "allow_ssh_sg_id" {
  description = "The ID of the security group allowing SSH traffic"
  value       = aws_security_group.allow_ssh.id
}
