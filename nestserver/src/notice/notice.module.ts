import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { DatabaseModule } from 'src/database/database.module'; // ✅ DatabaseModule 추가

@Module({
  imports: [DatabaseModule], // ✅ MySQL Connection Module 등록
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
