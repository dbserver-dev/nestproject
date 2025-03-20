import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { DatabaseModule } from 'src/database/database.module'; // ✅ DatabaseModule 추가

@Module({
  imports: [DatabaseModule], // ✅ MySQL Connection Module 등록
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
