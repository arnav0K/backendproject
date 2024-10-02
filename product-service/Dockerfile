# Use Node.js 16 or later
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies inside the Docker container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3002

# Start the app
CMD ["node", "src/index.js"]
