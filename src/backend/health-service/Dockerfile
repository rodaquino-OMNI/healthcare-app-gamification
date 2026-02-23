FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY shared ./shared
COPY health-service ./health-service
COPY auth-service/src ./auth-service/src

RUN yarn install --frozen-lockfile
RUN npx prisma generate --schema=shared/prisma/schema.prisma || true
RUN yarn nest build health-service

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist/health-service ./dist

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://localhost:3002/health || exit 1

EXPOSE 3002

CMD ["node", "dist/main"]
