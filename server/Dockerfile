# Dockerfile for Express.js server

# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies for the server (including devDependencies for build)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript project directly using tsc
RUN npx tsc

# ---- Runner Stage ----
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies for the server
# Using --ignore-scripts can prevent potential issues with postinstall scripts not meant for this stage
RUN npm install --omit=dev --ignore-scripts

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Make port 3001 available
EXPOSE 3001

# Define environment variable
ENV NODE_ENV production

# Run the app
CMD ["node", "dist/index.js"]