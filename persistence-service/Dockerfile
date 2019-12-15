FROM node

WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 3000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD wait && node server.js
