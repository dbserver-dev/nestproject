import { Module } from '@nestjs/common';
import { CommprocController } from './commproc.controller';
import { CommprocService } from './commproc.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CommprocController],
  providers: [CommprocService],
})
export class CommprocModule {}
