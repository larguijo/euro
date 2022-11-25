FROM node:alpine
WORKDIR /app

ENV PORT 3000

COPY ./package.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]