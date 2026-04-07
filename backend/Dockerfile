# Start from an official base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (improves layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of   source code
COPY . .

# Expose the port   app listens on
EXPOSE 8080

# Command to run when the container starts
CMD ["npm", "start"]
