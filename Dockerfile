# ── Étape 1 : build ──────────────────────────────────────────
# Vite lit .env.production (écrit par le workflow depuis le secret ENV_FILE)
# et inscrit les liens Woura et WhatsApp dans la page.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Étape 2 : fichiers statiques servis par nginx ────────────
FROM nginx:1.27-alpine-slim
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
