import { Module } from '@nestjs/common';
import { UsermgrController } from './usermgr.controller';
import { UsermgrService } from './usermgr.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UsermgrController],
  providers: [UsermgrService],
})
export class UsermgrModule {}
