#!/bin/bash

# Start development infrastructure
echo "Starting development infrastructure..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if migrations exist, if not create the initial migration
MIGRATION_DIR="./prisma/migrations"
if [ ! -d "$MIGRATION_DIR" ] || [ -z "$(ls -A $MIGRATION_DIR)" ]; then
  echo "No migrations found, creating initial migration..."
  npx prisma migrate dev --name init
else
  echo "Running existing migrations..."
  npx prisma migrate deploy
fi

# Seed the database
echo "Seeding the database..."
npx prisma db seed

# Start the application in development mode
echo "Starting gamification engine in development mode..."
npm run start:dev