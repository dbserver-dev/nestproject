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

  // 세션 설정
  // 기본 흐름
  //  1. **서버(NestJS)**가 express-session으로 세션 쿠키를 발급합니다.
  //  2. **클라이언트(Vue/React)**는 이 쿠키를 브라우저에 자동 저장합니다.
  //  3. 이후 axios 요청 시, 브라우저가 해당 쿠키를 자동으로 같이 전송합니다.
  //  4. 서버는 쿠키를 받아 세션을 복원하고, 사용자 상태를 유지합니다.
  //  5. 세션은 서버 메모리에 저장되므로, 서버를 재시작하면 세션 정보가 초기화됩니다.
  //  6. client ( Vue,react ) 에서 main.js 에서 axios.defaults.withCredentials = true; 설정해야함
  //  7. client 에서 axios 로 요청 시 저장도니 쿠키가 자동으로 전송됨
  //  8. client 저장
  //     저장 위치	    브라우저 내 Application > Cookies 탭
  //     쿠키 이름	    기본값: connect.sid (express-session 기본값)
  //     쿠키 값	      세션 ID (암호화됨)
  //     서버 세션      저장	세션 내용은 서버 메모리, Redis, DB 등에 저장 가능
  //  9. client 에서 전달 받은 세션 정보를 가지고, 서버에서 세션을 복원하면, 사용자 상태를 유지할 수 있습니다.
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
