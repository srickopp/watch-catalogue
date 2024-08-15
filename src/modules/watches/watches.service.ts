import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Watch } from "src/models/entities/watch.entity";
import { Repository } from "typeorm";

@Injectable()
export class WatchesService {
  constructor(
    @InjectRepository(Watch)
    private readonly watchRepo: Repository<Watch>
  ) {}
}
