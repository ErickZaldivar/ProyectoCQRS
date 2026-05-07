FROM node:20-alpine

# Instalar supercronic (cron runner para contenedores)
RUN wget -q https://github.com/aptible/supercronic/releases/download/v0.2.29/supercronic-linux-amd64 \
    -O /usr/local/bin/supercronic \
    && chmod +x /usr/local/bin/supercronic

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Archivo que define el schedule
COPY crontab /app/crontab

CMD ["supercronic", "/app/crontab"]