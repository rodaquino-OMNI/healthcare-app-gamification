# VPC
resource "aws_vpc" "austa_vpc" {
  cidr_block           = var.vpc_cidr
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
    cidr_blocks      = [var.vpc_cidr]
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

# NAT Gateway - Enables private subnets to reach the internet (for EKS image pulls, etc.)
resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.availability_zones)) : 0
  domain = "vpc"

  tags = {
    Name        = "austa-nat-eip-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.availability_zones)) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public_subnets[count.index].id

  tags = {
    Name        = "austa-nat-gw-${count.index + 1}"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.austa_igw]
}

# Route Table for Private Subnets - Directs traffic through NAT gateway
resource "aws_route_table" "private_route_table" {
  count  = var.enable_nat_gateway ? (var.single_nat_gateway ? 1 : length(var.availability_zones)) : 0
  vpc_id = aws_vpc.austa_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[var.single_nat_gateway ? 0 : count.index].id
  }

  tags = {
    Name        = "austa-private-rt-${count.index + 1}"
    Environment = var.environment
  }
}

# Associate Private App Subnets with Private Route Table
resource "aws_route_table_association" "private_app_subnet_associations" {
  count          = var.enable_nat_gateway ? length(var.availability_zones) : 0
  subnet_id      = aws_subnet.private_app_subnets[count.index].id
  route_table_id = aws_route_table.private_route_table[var.single_nat_gateway ? 0 : count.index].id
}

# Associate Private Data Subnets with Private Route Table
resource "aws_route_table_association" "private_data_subnet_associations" {
  count          = var.enable_nat_gateway ? length(var.availability_zones) : 0
  subnet_id      = aws_subnet.private_data_subnets[count.index].id
  route_table_id = aws_route_table.private_route_table[var.single_nat_gateway ? 0 : count.index].id
}

# ElastiCache subnet group - uses private data subnets
resource "aws_elasticache_subnet_group" "cache" {
  name       = "austa-cache-subnet-group-${var.environment}"
  subnet_ids = aws_subnet.private_data_subnets[*].id

  tags = {
    Name        = "austa-cache-subnet-group"
    Environment = var.environment
  }
}