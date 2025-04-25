# AUSTA SuperApp Makefile - Central build and deployment automation

# Define shell and common commands
SHELL := /bin/bash
DOCKER_COMPOSE := docker-compose
DOCKER_COMPOSE_DEV := docker-compose -f docker-compose.dev.yml
TERRAFORM := terraform
KUBECTL := kubectl
NODE := node
NPM := npm
YARN := yarn

# Default target
.DEFAULT_GOAL := help

# Help command
.PHONY: help
help:
	@echo "=== AUSTA SuperApp Build Commands ==="
	@echo ""
	@echo "Development Commands:"
	@echo "  setup              - Initialize the development environment with all dependencies"
	@echo "  dev                - Start all services in development mode"
	@echo "  dev-backend        - Start only backend services in development mode"
	@echo "  dev-web            - Start web application in development mode"
	@echo "  dev-mobile         - Start mobile application in development mode"
	@echo ""
	@echo "Build Commands:"
	@echo "  build              - Build all components for production"
	@echo "  build-backend      - Build backend services for production"
	@echo "  build-web          - Build web application for production"
	@echo "  build-mobile       - Build mobile application for production"
	@echo ""
	@echo "Test Commands:"
	@echo "  test               - Run all tests across the project"
	@echo "  test-backend       - Run backend tests"
	@echo "  test-web           - Run web application tests"
	@echo "  test-mobile        - Run mobile application tests"
	@echo "  lint               - Run linting across all code"
	@echo "  format             - Format all code according to project standards"
	@echo ""
	@echo "Database Commands:"
	@echo "  db-migrate         - Run database migrations"
	@echo "  db-seed            - Seed database with initial data"
	@echo "  db-reset           - Reset database to clean state"
	@echo ""
	@echo "Deployment Commands:"
	@echo "  deploy-staging     - Deploy application to staging environment"
	@echo "  deploy-production  - Deploy application to production environment"
	@echo "  terraform-init     - Initialize Terraform for infrastructure management"
	@echo "  terraform-plan     - Generate Terraform execution plan"
	@echo "  terraform-apply    - Apply Terraform changes to infrastructure"
	@echo "  k8s-apply          - Apply Kubernetes manifests"
	@echo ""
	@echo "Utility Commands:"
	@echo "  clean              - Clean build artifacts and temporary files"
	@echo "  generate-api-docs  - Generate API documentation"

# Development setup command
.PHONY: setup
setup:
	@echo "Installing backend dependencies..."
	cd backend && $(YARN) install
	@echo "Installing web dependencies..."
	cd web && $(YARN) install
	@echo "Installing mobile dependencies..."
	cd mobile && $(YARN) install
	@echo "Initializing database..."
	$(MAKE) db-migrate
	$(MAKE) db-seed
	@echo "Setup complete! Use 'make dev' to start the development environment."

# Development commands
.PHONY: dev
dev:
	@echo "Starting development environment..."
	$(DOCKER_COMPOSE_DEV) up -d database redis kafka
	@echo "Starting backend services..."
	cd backend && $(YARN) dev &
	@echo "Starting web application..."
	cd web && $(YARN) dev &
	@echo "Development environment is now running. Press Ctrl+C to stop."
	wait

.PHONY: dev-backend
dev-backend:
	@echo "Starting backend services..."
	$(DOCKER_COMPOSE_DEV) up -d database redis kafka
	cd backend && $(YARN) dev
	
.PHONY: dev-web
dev-web:
	@echo "Starting web application in development mode..."
	cd web && $(YARN) dev
	
.PHONY: dev-mobile
dev-mobile:
	@echo "Starting mobile application in development mode..."
	cd mobile && $(YARN) start

# Build commands
.PHONY: build
build: build-backend build-web build-mobile
	@echo "Build complete for all components!"

.PHONY: build-backend
build-backend:
	@echo "Building backend services for production..."
	cd backend && $(YARN) build
	@echo "Creating Docker images for backend services..."
	$(DOCKER_COMPOSE) build auth-service health-service care-service plan-service gamification-engine

.PHONY: build-web
build-web:
	@echo "Building web application for production..."
	cd web && $(YARN) build
	@echo "Creating Docker image for web application..."
	$(DOCKER_COMPOSE) build web

.PHONY: build-mobile
build-mobile:
	@echo "Building mobile application for production..."
	cd mobile && $(YARN) build:android
	@echo "Building iOS app (requires macOS)..."
	if [ "$(shell uname)" = "Darwin" ]; then cd mobile && $(YARN) build:ios; else echo "Skipping iOS build on non-macOS system"; fi

# Test commands
.PHONY: test
test: test-backend test-web test-mobile
	@echo "All tests completed!"
	@echo "Generating combined test coverage report..."
	$(NODE) scripts/combine-coverage-reports.js

.PHONY: test-backend
test-backend:
	@echo "Running backend tests..."
	cd backend && $(YARN) test

.PHONY: test-web
test-web:
	@echo "Running web application tests..."
	cd web && $(YARN) test

.PHONY: test-mobile
test-mobile:
	@echo "Running mobile application tests..."
	cd mobile && $(YARN) test

# Linting and formatting
.PHONY: lint
lint:
	@echo "Linting backend code..."
	cd backend && $(YARN) lint
	@echo "Linting web code..."
	cd web && $(YARN) lint
	@echo "Linting mobile code..."
	cd mobile && $(YARN) lint

.PHONY: format
format:
	@echo "Formatting code with Prettier..."
	cd backend && $(YARN) format
	cd web && $(YARN) format
	cd mobile && $(YARN) format

# Database commands
.PHONY: db-migrate
db-migrate:
	@echo "Running database migrations..."
	cd backend/shared && $(YARN) prisma migrate deploy

.PHONY: db-seed
db-seed:
	@echo "Seeding database with initial data..."
	cd backend/shared && $(YARN) prisma db seed

.PHONY: db-reset
db-reset:
	@echo "Resetting database to clean state..."
	cd backend/shared && $(YARN) prisma migrate reset --force

# Deployment commands
.PHONY: deploy-staging
deploy-staging: build
	@echo "Deploying to staging environment..."
	@echo "Pushing Docker images to registry..."
	$(DOCKER_COMPOSE) push
	@echo "Applying infrastructure changes..."
	cd infrastructure/terraform && $(TERRAFORM) workspace select staging
	$(MAKE) terraform-apply
	@echo "Deploying services to Kubernetes..."
	$(KUBECTL) config use-context staging
	$(KUBECTL) apply -f infrastructure/kubernetes/staging
	@echo "Running database migrations..."
	$(KUBECTL) exec -it $$($(KUBECTL) get pod -l app=migration-tool -o jsonpath='{.items[0].metadata.name}') -- yarn prisma migrate deploy
	@echo "Verifying deployment health..."
	./scripts/verify-deployment.sh staging
	@echo "Staging deployment completed successfully!"

.PHONY: deploy-production
deploy-production: build
	@echo "Deploying to production environment..."
	@echo "ATTENTION: You are deploying to PRODUCTION. Press Enter to continue or Ctrl+C to abort."
	@read -p ""
	@echo "Pushing Docker images to registry..."
	$(DOCKER_COMPOSE) push
	@echo "Applying infrastructure changes..."
	cd infrastructure/terraform && $(TERRAFORM) workspace select production
	$(MAKE) terraform-apply
	@echo "Deploying services to Kubernetes..."
	$(KUBECTL) config use-context production
	$(KUBECTL) apply -f infrastructure/kubernetes/production
	@echo "Running database migrations..."
	$(KUBECTL) exec -it $$($(KUBECTL) get pod -l app=migration-tool -o jsonpath='{.items[0].metadata.name}') -- yarn prisma migrate deploy
	@echo "Verifying deployment health..."
	./scripts/verify-deployment.sh production
	@echo "Production deployment completed successfully!"

# Infrastructure commands
.PHONY: terraform-init
terraform-init:
	@echo "Initializing Terraform..."
	cd infrastructure/terraform && $(TERRAFORM) init

.PHONY: terraform-plan
terraform-plan:
	@echo "Generating Terraform plan..."
	cd infrastructure/terraform && $(TERRAFORM) plan

.PHONY: terraform-apply
terraform-apply:
	@echo "Applying Terraform changes..."
	cd infrastructure/terraform && $(TERRAFORM) apply

.PHONY: k8s-apply
k8s-apply:
	@echo "Applying Kubernetes manifests..."
	$(KUBECTL) apply -f infrastructure/kubernetes/namespaces
	$(KUBECTL) apply -f infrastructure/kubernetes/common
	$(KUBECTL) apply -f infrastructure/kubernetes/journeys/health
	$(KUBECTL) apply -f infrastructure/kubernetes/journeys/care
	$(KUBECTL) apply -f infrastructure/kubernetes/journeys/plan
	$(KUBECTL) apply -f infrastructure/kubernetes/journeys/gamification
	$(KUBECTL) apply -f infrastructure/kubernetes/network

# Utility commands
.PHONY: clean
clean:
	@echo "Cleaning project..."
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "build" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name "coverage" -type d -prune -exec rm -rf '{}' +
	find . -name ".next" -type d -prune -exec rm -rf '{}' +
	$(DOCKER_COMPOSE_DEV) down -v
	@echo "Project cleaned successfully!"

.PHONY: generate-api-docs
generate-api-docs:
	@echo "Generating API documentation..."
	cd backend && $(YARN) generate-docs
	@echo "API documentation generated at docs/api"