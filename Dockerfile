# https://malcoded.com/posts/angular-docker/
ARG configuration=develop

FROM node:16.13-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run-script ng build -- --configuration=${configuration} --base-href /vocabulary/ --deploy-url /vocabulary/
RUN npm run-script ng build

# Stage 2
FROM nginx:1.21-alpine

COPY --from=node /usr/src/app/dist/vocabulary-front-end /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
