FROM node:17-slim
WORKDIR /app

COPY ["package.json", "./"]
# RUN apt-get -y update
# RUN apt-get install apt-file
# RUN apt-file update
RUN apt-get update && apt-get install -y vim nano
RUN npm config set legacy-peer-deps true
RUN npm install
# RUN  npm i mcxclient
RUN npm i react-app-rewired -g
RUN npm i knex -g
RUN npm un mysql && npm i mysql2
#RUN npm install --save react-scripts@3.3.0
COPY --chown=node:node . /app
USER root
#RUN yarn

#RUN yarn add knex -g
#COPY . /app
RUN chmod +x start.sh
CMD ./start.sh

EXPOSE 3000 3001