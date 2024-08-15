import { Module } from '@nestjs/common';
import { WatchesService } from './watches.service';
import { WatchesController } from './watches.controller';

@Module({
  providers: [WatchesService],
  controllers: [WatchesController]
})
export class WatchesModule {}
