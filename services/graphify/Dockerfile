FROM python:3.11-slim

WORKDIR /app

# Install graphifyy and dependencies
RUN pip install --no-cache-dir graphifyy

# Copy Node.js service wrapper
COPY package*.json ./
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm ci --only=production

COPY src ./src

ENV NODE_ENV=production
ENV PORT=7000
ENV OUTPUT_DIR=/nemoclaw/graphify-out

EXPOSE 7000

CMD ["node", "src/index.js"]
