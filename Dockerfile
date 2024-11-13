# Use an official Node.js image as a base
FROM node:20

# Create and set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .
COPY .env.docker .env.local


# Expose the port your application runs on
EXPOSE 3000

# Command to run the application
CMD npm run seed && npm run start
