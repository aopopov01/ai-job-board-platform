FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json package.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Start in development mode (skip build)
CMD ["npm", "run", "dev"]