FROM node:16.13.1-alpine
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 5000 3333 7654
CMD npm start