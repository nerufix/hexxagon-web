FROM node:alpine as build-stage
WORKDIR /app
COPY . .
RUN npm i --force
RUN npm run build 

FROM nginx
VOLUME /var/log/nginx
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]