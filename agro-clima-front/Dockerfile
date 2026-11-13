# Estágio 1: Build do Angular
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Servidor Web Nginx
FROM nginx:alpine

# Copia os arquivos gerados pelo build do Angular
COPY --from=builder /app/dist/agro-clima-front/browser /usr/share/nginx/html

# Configura o template do Nginx com suporte a proxy reverso e variáveis de ambiente
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copia script para geração dinâmica do env.js em runtime caso API_URL seja definida
COPY 40-generate-env.sh /docker-entrypoint.d/40-generate-env.sh
RUN chmod +x /docker-entrypoint.d/40-generate-env.sh

# Variáveis padrão para o proxy reverso e filtro do envsubst
ENV BACKEND_HOST=backend \
    BACKEND_PORT=8080 \
    NGINX_ENVSUBST_FILTER="BACKEND_"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
