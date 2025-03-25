import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import dotenv from 'dotenv'; // ✅ dotenv 패키지 추가

//dotenv.config(); // ✅ .env 파일 로드

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 80; // ✅ .env 파일의 PORT 값 사용

  // 전역 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 DTO 클래스로 변환
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 있으면 에러 발생
    }),
  );

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error('❌ SESSION_SECRET is not defined in .env file');
  }
  app.use(
    session({
      secret: sessionSecret, // ✅ 환경변수에서 불러오기
      resave: false, // 세션에 변경사항이 없어도 매 요청마다 세션을 저장할지 여부  false면 세션에 변화가 있을 때만 저장됨
      saveUninitialized: false, // 새로 생성된 세션인데, 아직 아무 값도 설정되지 않았을 때 저장할지 여부 false: 세션에 실제 값이 들어오기 전까진 저장하지 않음
      cookie: { maxAge: 60 * 60 * 1000 }, // 세션 쿠키의 만료 시간 (밀리초 단위) 설정 1시간
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform is recomended configuration for avoind issues with arrays of files transformations
    }),
  );

  /*
  cookie  관련 Option
  maxAge	쿠키 유효 시간 (ms)
  secure	HTTPS에서만 전송
  httpOnly	JS로 쿠키 접근 금지 (XSS 보호)

  cookie: {
  maxAge: 60 * 60 * 1000,  // 1시간
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  }
  */

  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
