# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS builder
WORKDIR /app

ARG RAILWAY_SERVICE_ID

# Cache do npm (sem travar .cache dentro de node_modules)
COPY package*.json ./
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-/root/.npm,target=/root/.npm \
    npm ci --omit=dev

COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000
CMD ["npm", "start"]
