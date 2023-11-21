FROM node:20.9.0-slim

WORKDIR /app

# COPY /team/package.json /app/package.json

# RUN apt-get update && apt-get install -y curl && npm install -g nodemon && npm install
RUN apt-get update && apt-get install -y curl

# compose command フィールド -> Docker file CMD命令 -> ベースイメージのデフォルト命令という順で辿る

# CMD npm run dev

# compose down でメインプロセス殺すようにする.殺せてない
CMD ["npm", "run", "dev-ts"]