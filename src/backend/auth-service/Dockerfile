FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY shared ./shared
COPY auth-service ./auth-service

RUN yarn install --frozen-lockfile
RUN npx prisma generate --schema=shared/prisma/schema.prisma || true
RUN yarn nest build auth-service

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist/auth-service ./dist

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "dist/main"]
