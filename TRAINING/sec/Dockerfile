FROM mhart/alpine-node:8

STOPSIGNAL SIGINT
RUN apk add --no-cache dumb-init

LABEL name "demodemodemo"

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app

EXPOSE 80
CMD ["dumb-init", "npm", "start"]