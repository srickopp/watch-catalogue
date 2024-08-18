import { Module } from "@nestjs/common";
import { WatchesService } from "./watches.service";
import { WatchesController } from "./watches.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Watch } from "src/models/entities/watch.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Watch])],
  providers: [WatchesService],
  controllers: [WatchesController],
})
export class WatchesModule {}
