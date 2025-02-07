# Install and build the yarn package as base

FROM node:20 as base

WORKDIR /base

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY . .

RUN yarn build

# Runner stage

FROM node:20 as runner

WORKDIR /usr/src/app

# Copy Package Json
COPY package.json yarn.lock* ./

# Install Files
RUN yarn install

# Compile typescript
RUN yarn add -D typescript

# Copy Source Files
COPY . .

# Start
EXPOSE 3000

CMD ["yarn", "start"]
