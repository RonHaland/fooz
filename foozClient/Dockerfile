FROM node:25-alpine AS base

WORKDIR /usr/server/app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install


ARG VERSION=latest
FROM base AS builder

WORKDIR /usr/server/app

COPY ./ .

RUN npm run build

FROM base AS runner

WORKDIR /usr/server/app

COPY --from=builder /usr/server/app/build ./build

CMD ["npm", "run", "start"]
