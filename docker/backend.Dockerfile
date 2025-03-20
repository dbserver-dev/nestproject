# 1. Node 환경에서 NestJS 빌드
FROM node:18
WORKDIR /app

# 2. 패키지 설치
COPY nestserver/package.json nestserver/package-lock.json ./
RUN npm install

# 3. 소스 코드 복사 및 NestJS 빌드
COPY backend ./
RUN npm run build

# 4. NestJS 서버 실행
EXPOSE 80
CMD ["npm", "run", "start"]
