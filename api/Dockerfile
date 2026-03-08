FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
