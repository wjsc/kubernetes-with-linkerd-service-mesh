FROM node:10-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD [ "npm", "start" ]