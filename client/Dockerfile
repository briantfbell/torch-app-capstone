FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app/

EXPOSE 5173

CMD ["npm", "start"]
