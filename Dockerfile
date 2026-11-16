FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "8080"]
