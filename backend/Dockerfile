# Use the official Node.js image
FROM node:20.13.1

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Rebuild native modules for the target architecture
RUN npm rebuild bcrypt --build-from-source

# Install sequelize-cli globally
RUN npm install -g sequelize-cli@6.6.2

# Copy local code to the container image
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup
CMD ["node", "index.js"]
