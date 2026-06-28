# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build

WORKDIR /app

# Instalar pnpm (corepack ya viene en Node 22)
RUN corepack enable && corepack prepare pnpm@11 --activate

# Copiar manifests primero (cacheo)
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build de Vite
RUN pnpm build


# ---------- RUNTIME STAGE ----------
FROM nginx:alpine

# Vite output -> /dist
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing (React Router)
RUN printf 'server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]