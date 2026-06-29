FROM node:22-slim AS build

WORKDIR /app

ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_MAPBOX_ACCESS_TOKEN
ARG VITE_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]