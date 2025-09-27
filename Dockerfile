# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install necessary packages
RUN apk add --no-cache \
    curl \
    bash \
    cronie \
    tzdata

# Set timezone
ENV TZ=UTC

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Create data directory
RUN mkdir -p /app/data

# Create logs directory
RUN mkdir -p /app/logs

# Copy and setup cron job
COPY crontab.txt /etc/cron.d/docker-tips-cron
RUN chmod 0644 /etc/cron.d/docker-tips-cron
RUN crontab /etc/cron.d/docker-tips-cron

# Create startup script
RUN bash -c 'cat > /app/start.sh << "EOF"
#!/bin/bash

RUN echo '#!/bin/bash' > /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'crond -f &' >> /app/start.sh && \
    echo 'sleep 2' >> /app/start.sh && \
    echo 'exec pnpm start' >> /app/start.sh

RUN chmod +x /app/start.sh

# Expose port 3030
EXPOSE 3030

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3030

# Create volume for data persistence
VOLUME ["/app/data"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3030/api/docker-tip || exit 1

# Start the application
CMD ["/app/start.sh"]
