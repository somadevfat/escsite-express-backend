FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverage Docker cache)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 18081

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]


