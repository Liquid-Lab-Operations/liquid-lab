FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY src ./src

RUN mkdir -p /var/log && chmod 777 /var/log

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
