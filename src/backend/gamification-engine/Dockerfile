FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY shared ./shared
COPY gamification-engine ./gamification-engine

RUN yarn install --frozen-lockfile
RUN npx prisma generate --schema=shared/prisma/schema.prisma || true
RUN npx prisma generate --schema=gamification-engine/prisma/schema.prisma || true
RUN yarn nest build gamification-engine

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist/gamification-engine ./dist

USER node

EXPOSE 3005

CMD ["node", "dist/main"]
