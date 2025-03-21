import { Module } from '@nestjs/common';
import { CommprocModule } from './commproc/commproc.module';

@Module({
  imports: [CommprocModule]
})
export class CommonModule {}
