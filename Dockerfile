# Build stage
FROM node:14 AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ ./
RUN yarn build

# Production stage
FROM node:14-alpine
ENV PORT=7777
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --production
COPY backend/ ./
COPY --from=build /app/frontend/build /app/frontend/build
EXPOSE $PORT
CMD ["node", "app.js"]