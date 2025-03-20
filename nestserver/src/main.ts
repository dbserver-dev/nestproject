import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import dotenv from 'dotenv'; // ✅ dotenv 패키지 추가

//dotenv.config(); // ✅ .env 파일 로드

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 80; // ✅ .env 파일의 PORT 값 사용
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
