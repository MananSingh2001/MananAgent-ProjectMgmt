# Stage 1: Build the React client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npx vite build

# Stage 2: Run the Node.js server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./server/public

EXPOSE 8080
ENV PORT=8080
CMD ["node", "server/index.js"]
