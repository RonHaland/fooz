ARG VERSION=latest
FROM ronhaland.azurecr.io/fooz/client.base:$VERSION

WORKDIR /usr/server/app

COPY ./ .

RUN npm run build
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
