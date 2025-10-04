FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

ENV DB_HOST=host.docker.internal
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=
ENV DB_DATABASE=renta
ENV JWT_SECRET=

CMD ["npm", "run", "start:dev"]