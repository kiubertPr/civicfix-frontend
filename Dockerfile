FROM node:22-slim AS build

WORKDIR /app

# 1. Declaras los argumentos que enviará GitHub Actions (añade tantos como necesites)
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_MAPBOX_ACCESS_TOKEN
ARG VITE_BACKEND_URL

# 2. Los pasas a variables de entorno para que el compilador de Vite los detecte
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# 3. Al ejecutarse este comando, Vite incrustará los valores reales en el build final
RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]