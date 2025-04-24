# syntax=docker/dockerfile:1.4

# === STAGE 1: builder ===
FROM node:18-alpine AS builder
WORKDIR /app

# Copia só o package.json e package-lock.json primeiro (cache de dependências)
COPY package*.json ./

# Monta o cache do npm em /root/.npm e instala PROD + DEV deps
# (não montamos nada em node_modules/.cache, evitando o erro EBUSY)
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci

# Copia o resto do código
COPY . .

# Opcional: já roda migrações e seed aqui, se preferir
# RUN npm run migrate && npm run seed

# === STAGE 2: runtime ===
FROM node:18-alpine
WORKDIR /app

# Copia tudo do builder
COPY --from=builder /app . 

# Exponha a porta que seu app escuta (usualmente 3000)
EXPOSE 3000

# Comando padrão para iniciar
CMD ["npm", "start"]
