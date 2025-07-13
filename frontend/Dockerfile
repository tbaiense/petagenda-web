FROM node:24.3.0-alpine3.22 AS builder

RUN apk update && apk upgrade

WORKDIR /build

COPY src/ src/
COPY eslint.config.js .
COPY index.html .
COPY package.json .
COPY vite.config.js .

RUN apk add npm
RUN npm i
RUN npm run build

FROM nginx:1.29.0-alpine-slim

WORKDIR /etc/nginx/conf.d

RUN rm default.conf

COPY nginx/petagenda.conf .

WORKDIR /usr/share/nginx/html

COPY --from=builder /build/dist/ .



