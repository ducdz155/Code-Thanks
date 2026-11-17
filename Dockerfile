FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=8088
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 8088

CMD ["node", "server.js"]
