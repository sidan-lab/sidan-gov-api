# Install and build the yarn package as base

FROM node:20 as base

WORKDIR /base

COPY prisma ./

COPY package.json ./

# Generate yarn.lock if it does not exist
RUN if [ ! -f yarn.lock ]; then yarn install; fi

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

# Runner stage
FROM node:20 as runner

WORKDIR /usr/src/app

# Install PostgreSQL client
RUN apt-get install -y postgresql-client

COPY --from=base /base/build/src ./build/src
COPY --from=base /base/build/swaggerConfig.js ./build
COPY --from=base /base/package.json ./
COPY --from=base /base/yarn.lock ./
COPY --from=base /base/prisma ./prisma

RUN yarn install --frozen-lockfile --production
RUN npx prisma generate

EXPOSE 3002

CMD ["yarn", "start"]