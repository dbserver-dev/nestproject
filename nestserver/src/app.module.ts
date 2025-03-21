import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { DatabaseModule } from './database/database.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [DatabaseModule, LoginModule, NoticeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
