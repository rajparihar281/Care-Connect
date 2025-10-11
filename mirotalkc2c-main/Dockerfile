# Use a lightweight Node.js image 
FROM node:22-alpine

# Set working directory
WORKDIR /src

# Set environment variables
ENV NODE_ENV="production"

# Copy package*.json and .env dependencies
COPY package*.json ./
COPY .env.template ./.env

# Install necessary system packages and dependencies
RUN apk add --no-cache \
    bash \
    vim \
    && npm ci --only=production --silent \
    && npm cache clean --force \
    && rm -rf /tmp/* /var/tmp/* /usr/share/doc/*

# Copy the application code
COPY frontend frontend
COPY backend backend

# Set default command to start the application
CMD ["npm", "start"]