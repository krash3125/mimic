# Use the official Node.js 20 image as the base image
FROM node:20-bullseye

# Set the working directory inside the container to /app/backend
WORKDIR /app

# ENV
ENV NODE_ENV=production
ENV PORT=5000

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install app dependencies
RUN npm install --production=false

# Install Playwright dependencies
RUN npx playwright install chromium
RUN npx playwright install-deps

# Copy the rest of the backend code to the working directory
COPY backend/ ./

# Build the TypeScript files
RUN npm run build

# Expose the port on which your application will run (e.g., 5000)
EXPOSE 5000

# Define the command to start your application
CMD ["npm", "run", "start:dist"]
