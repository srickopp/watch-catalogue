import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WatchesService } from "./watches.service";

@ApiTags("Watches")
@Controller("watches")
export class WatchesController {
  constructor(private readonly watchService: WatchesService) {}
}
