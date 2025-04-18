# 1. Node 환경에서 Vue/React 빌드
FROM node:20 AS builder
WORKDIR /app
COPY paidleave/package.json paidleave/package-lock.json ./
RUN npm install
COPY paidleave ./
RUN npm run build
EXPOSE 8088
CMD ["npm", "run", "serve"]

