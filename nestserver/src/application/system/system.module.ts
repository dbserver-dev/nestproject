import { Module } from '@nestjs/common';
import { UsermgrModule } from './usermgr/usermgr.module';

@Module({
  imports: [UsermgrModule]
})
export class SystemModule {}
