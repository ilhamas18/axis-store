FROM node:14-alpine3.14

WORKDIR /app
COPY . .

RUN rm -rf .git
RUN rm -rf Dockerfile

RUN npm install
RUN npm run build

EXPOSE 3001
CMD npm run start
