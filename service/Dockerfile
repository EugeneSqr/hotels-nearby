FROM node:10 AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

CMD ["npm", "start"]
