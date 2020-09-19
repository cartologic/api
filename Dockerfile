# pull official base image
FROM node:12.14.1-alpine

# set working directory
WORKDIR /app
RUN mkdir /app/uploaded

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
# RUN npm install build-tools
RUN npm install yarn@1.22.4
RUN yarn install 

# add app
COPY . ./

EXPOSE 5000

# start app
CMD ["npm", "start"]
