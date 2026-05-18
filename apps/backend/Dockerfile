FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/

RUN npm install --legacy-peer-deps

RUN npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx tsc -p tsconfig.json

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
