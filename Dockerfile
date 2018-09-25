# multi-stage build 

# stage 1 : use full node image to install node_modules
FROM node:8 AS build-ver

# Create app folder
RUN mkdir -p /var/app
WORKDIR /var/app

# Copy app files into app folder
COPY . /var/app

RUN ["yarn", "install", "--production"]

# stage 2 : copy all files to alpine-node to minimize image size
FROM node:8-alpine

# setting TimeZone for log time
RUN apk add --update tzdata && cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime && echo "Asia/Taipei" >  /etc/timezone && date && apk del tzdata

# Create app folder
RUN mkdir -p /var/app
WORKDIR /var/app

# Copy file from image0 to image1
COPY --from=build-ver /var/app /var/app

CMD ["node", "index"]

LABEL maintainer="jimliu<jim.liu@mitake.com.tw>" 