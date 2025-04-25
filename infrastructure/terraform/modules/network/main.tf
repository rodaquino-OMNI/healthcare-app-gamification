terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
  required_version = ">= 1.5"
}

# VPC
resource "aws_vpc" "austa_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "austa-vpc"
    Environment = var.environment
  }
}

# Public Subnets - Used for public-facing resources like load balancers
resource "aws_subnet" "public_subnets" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.austa_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.austa_vpc.cidr_block, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name        = "austa-public-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Private Application Subnets - Used for application servers and containers
resource "aws_subnet" "private_app_subnets" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.austa_vpc.id
  cidr_block        = cidrsubnet(aws_vpc.austa_vpc.cidr_block, 8, length(var.availability_zones) + count.index)
  availability_zone = var.availability_zones[count.index]
  
  tags = {
    Name        = "austa-private-app-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Private Data Subnets - Used for databases and other data stores
resource "aws_subnet" "private_data_subnets" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.austa_vpc.id
  cidr_block        = cidrsubnet(aws_vpc.austa_vpc.cidr_block, 8, (2 * length(var.availability_zones)) + count.index)
  availability_zone = var.availability_zones[count.index]
  
  tags = {
    Name        = "austa-private-data-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

# Internet Gateway - Allows communication between VPC and internet
resource "aws_internet_gateway" "austa_igw" {
  vpc_id = aws_vpc.austa_vpc.id
  
  tags = {
    Name        = "austa-igw"
    Environment = var.environment
  }
}

# Route Table for Public Subnets - Directs traffic to the internet gateway
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.austa_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.austa_igw.id
  }
  
  tags = {
    Name        = "austa-public-rt"
    Environment = var.environment
  }
}

# Associate Public Subnets with Public Route Table
resource "aws_route_table_association" "public_subnet_associations" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

# Security Group: Allow All Outbound - Default security group for outbound traffic
resource "aws_security_group" "allow_all_outbound" {
  name        = "allow_all_outbound"
  description = "Allow all outbound traffic"
  vpc_id      = aws_vpc.austa_vpc.id
  
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
  
  tags = {
    Name        = "allow_all_outbound"
    Environment = var.environment
  }
}

# Security Group: Allow SSH - For administrative access to instances
resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.austa_vpc.id
  
  ingress {
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
  
  tags = {
    Name        = "allow_ssh"
    Environment = var.environment
  }
}

# Variables
variable "environment" {
  type        = string
  description = "The environment name (e.g., dev, staging, prod)"
}

variable "availability_zones" {
  type        = list(string)
  description = "A list of availability zones to use in the region"
}

# Outputs
output "vpc_id" {
  value       = aws_vpc.austa_vpc.id
  description = "The ID of the VPC"
}

output "public_subnet_ids" {
  value       = aws_subnet.public_subnets.*.id
  description = "A list of IDs for the public subnets"
}

output "private_app_subnet_ids" {
  value       = aws_subnet.private_app_subnets.*.id
  description = "A list of IDs for the private application subnets"
}

output "private_data_subnet_ids" {
  value       = aws_subnet.private_data_subnets.*.id
  description = "A list of IDs for the private data subnets"
}

output "allow_all_outbound_sg_id" {
  value       = aws_security_group.allow_all_outbound.id
  description = "The ID of the security group allowing all outbound traffic"
}

output "allow_ssh_sg_id" {
  value       = aws_security_group.allow_ssh.id
  description = "The ID of the security group allowing SSH traffic"
}