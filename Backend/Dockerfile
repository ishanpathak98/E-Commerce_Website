# Use Node.js LTS version
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install backend dependencies
RUN npm install --only=production

# Copy the rest of the backend code to the container
COPY . .

# Expose the port the app listens on (default is 8080 for Express)
EXPOSE 8080

# Run the backend server in production mode
CMD ["node", "index.js"]
