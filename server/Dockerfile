FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

CMD ["node", "src/app.js"]