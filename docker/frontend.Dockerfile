# 1. Node 환경에서 React 빌드
FROM node:18 AS builder
WORKDIR /app
COPY paidleave/package.json paidleave/package-lock.json ./
RUN npm install
COPY paidleave ./
RUN npm run build

# 2. Nginx로 서빙
FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
