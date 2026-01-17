FROM node:latest
WORKDIR /app
COPY container/nodejs/package.json ./
RUN npm install
COPY container/nodejs/ ./
EXPOSE 3000
CMD ["node", "index.js"]
