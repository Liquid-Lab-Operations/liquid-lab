FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY scripts ./scripts

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["node", "src/index.js"]
