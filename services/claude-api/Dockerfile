FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
HEALTHCHECK --interval=10s CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "start"]
