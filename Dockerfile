FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env.docker .env.local


EXPOSE 3000

CMD npm run seed && npm run start
