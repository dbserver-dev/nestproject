import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { DatabaseModule } from './database/database.module';
import { NoticeModule } from './notice/notice.module';
import { CommonModule } from './common/common.module';
import { ApplicationModule } from './application/application.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 어디서든 process.env 사용 가능
      envFilePath: '.env', // ✅ 기본값이라 생략 가능
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 사용 가능하게
    }),
    DatabaseModule,
    LoginModule,
    NoticeModule,
    CommonModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
