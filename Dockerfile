# ARG BUILD_FROM
# FROM $BUILD_FROM

FROM node:14-slim

COPY ["./dist", "./package.json", "/workspace/"]
WORKDIR /workspace
VOLUME /workspace/data
RUN yarn add coolkit-open-api coolkit-ws --registry http://172.16.9.22:4873/ \
    yarn --production
EXPOSE 3000
CMD npm start