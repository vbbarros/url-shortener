FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build
RUN chmod +x ./scripts/start.sh

EXPOSE 3000

CMD ["sh", "./scripts/start.sh"] 