# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS builder
WORKDIR /app

# Cache npm usando Service ID do Railway
COPY package*.json ./
RUN --mount=type=cache,id=s/f859f6ca-2bd2-46ad-8b94-01c57cbdf4c7-npm-cache,target=/root/.npm \
    npm ci --omit=dev

# Copia o restante do código
COPY . .

# Stage final de runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "start"]