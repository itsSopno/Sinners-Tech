FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies (needed for typescript build)
RUN npm install

# Copy the rest of the backend files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the server port
EXPOSE 10001

# Start the application
CMD ["npm", "start"]
