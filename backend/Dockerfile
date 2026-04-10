FROM node:18-alpine
WORKDIR /app

# Production only dependencies
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Ensure the credentials.json is in the expected path from your ENV
# GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./credentials.json

EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "index.js"]