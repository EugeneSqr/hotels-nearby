FROM node:carbon AS base
WORKDIR /usr/src/app

FROM base AS dependencies  
COPY package*.json ./
RUN npm install

FROM dependencies AS build  
COPY webpack.config.js ./
RUN npm run build

CMD ["npm", "start"]
