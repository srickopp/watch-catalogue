import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { WatchesService } from "./watches.service";
import { Watch } from "src/models/entities/watch.entity";
import { CreateWatchCatalogDto } from "./dto/create-watch.dto";
import { UpdateWatchCatalogDto } from "./dto/update-watch.dto";
import { ApiTags, ApiParam, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/jwt.guard";

@ApiBearerAuth()
@ApiTags("watches")
@Controller("watches")
export class WatchesController {
  constructor(private readonly watchesService: WatchesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createWatchCatalogue(
    @Body() createWatchDto: CreateWatchCatalogDto
  ): Promise<Watch> {
    return this.watchesService.createWatchCatalogue(createWatchDto);
  }

  @UseGuards(AuthGuard)
  @ApiParam({
    name: "id",
  })
  @Put(":id")
  async updateWatchCatalogue(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWatchDto: UpdateWatchCatalogDto
  ): Promise<Watch> {
    return this.watchesService.updateWatchCatalogue(id, updateWatchDto);
  }

  @ApiQuery({
    name: "filter",
    required: false,
    description: "Filter by watch name or reference number",
  })
  @ApiQuery({
    name: "brand",
    required: false,
    description: "Filter by brand name",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of records per page",
    type: Number,
  })
  @Get()
  async getWatchesList(
    @Query("filter") filter: string,
    @Query("brand") brand: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    return this.watchesService.getWatchesList(filter, brand, {
      page,
      limit,
    });
  }

  @ApiParam({
    name: "id",
  })
  @Get(":id")
  async getWatchDetails(@Param("id", ParseIntPipe) id: number): Promise<Watch> {
    return this.watchesService.getWatchDetails(id);
  }

  @UseGuards(AuthGuard)
  @ApiParam({
    name: "id",
  })
  @Delete(":id")
  async deleteWatch(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.watchesService.deleteWatch(id);
  }
}
