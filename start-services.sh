#!/bin/bash

# Start all services for AUSTA SuperApp
# This script starts development or scaled production services based on the input parameter

if [ "$1" == "production" ]; then
    echo "Starting production services (scaled)..."
    cd src/backend && docker-compose -f docker-compose.scale.yml up -d
    cd ../../src/web && yarn build
    echo "Production services started on scaled configuration."
    echo "API Gateway available at: http://localhost:3000"
elif [ "$1" == "development" ]; then
    echo "Starting development services..."
    cd src/backend && docker-compose up -d
    cd ../../src/web && yarn dev
    echo "Development services started."
    echo "API Gateway available at: http://localhost:3000"
else
    echo "Usage: ./start-services.sh [development|production]"
    echo "  development - Starts services in development mode"
    echo "  production  - Starts services in production mode (scaled)"
    exit 1
fi
