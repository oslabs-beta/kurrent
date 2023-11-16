FROM node:16.13-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files for npm install
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the port used by your application (assuming your app runs on port 3000)
EXPOSE 3000

# Specify the command to run on container start
CMD ["node", "./server/server.js"]