#!/bin/bash

# Start gamification engine service script
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${REPO_ROOT}/src/backend"
GAMIFICATION_DIR="${BACKEND_DIR}/gamification-engine"

echo "Starting gamification engine and dependencies..."

# Step 1: Start infrastructure services (PostgreSQL, Redis, Kafka, Zookeeper)
echo "Starting infrastructure services..."
docker-compose -f ${BACKEND_DIR}/docker-compose.yml up -d postgres redis kafka zookeeper
echo "Waiting for infrastructure services to initialize..."
sleep 10

# Step 2: Check if Prisma directory exists, if not create it
if [ ! -d "${GAMIFICATION_DIR}/prisma" ]; then
  echo "Creating Prisma schema directory..."
  mkdir -p "${GAMIFICATION_DIR}/prisma"
  
  # Create a basic schema.prisma file if it doesn't exist
  if [ ! -f "${GAMIFICATION_DIR}/prisma/schema.prisma" ]; then
    echo "Creating basic Prisma schema..."
    cat > "${GAMIFICATION_DIR}/prisma/schema.prisma" << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model GameProfile {
  id            String           @id @default(uuid())
  userId        String           @unique
  level         Int              @default(1)
  xp            Int              @default(0)
  achievements  UserAchievement[]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

model Achievement {
  id            String           @id @default(uuid())
  title         String
  description   String
  journey       String
  icon          String?
  xpReward      Int              @default(0)
  userAchievements UserAchievement[]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

model UserAchievement {
  id            String       @id @default(uuid())
  profileId     String
  achievementId String
  progress      Int          @default(0)
  unlocked      Boolean      @default(false)
  unlockedAt    DateTime?
  profile       GameProfile  @relation(fields: [profileId], references: [id])
  achievement   Achievement  @relation(fields: [achievementId], references: [id])
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@unique([profileId, achievementId])
}

model Rule {
  id            String       @id @default(uuid())
  name          String
  description   String?
  eventType     String
  journey       String
  condition     String
  actions       Json
  enabled       Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
EOF
  fi
fi

# Step 3: Set up environment variables
echo "Setting up environment variables..."
if [ ! -f "${GAMIFICATION_DIR}/.env" ]; then
  cat > "${GAMIFICATION_DIR}/.env" << EOF
DATABASE_URL=postgresql://austa:austa@localhost:5432/austa?schema=gamification
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
PORT=3005
LOG_LEVEL=debug
NODE_ENV=development
JWT_SECRET=development-jwt-secret
RULES_REFRESH_INTERVAL=60000
EOF
fi

# Step 4: Install dependencies if needed
echo "Checking and installing dependencies..."
cd "${GAMIFICATION_DIR}"
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Step 5: Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Step 6: Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name initial-setup --create-only
npx prisma migrate deploy

# Step 7: Seed the database with test data
echo "Seeding database with test achievements and user profiles..."
npx ts-node prisma/seed.ts || echo "Seeding might have failed or not implemented. Continuing..."

# Step 8: Start the gamification engine
echo "Starting gamification engine..."
npm run start:dev

echo "Gamification engine started successfully!"