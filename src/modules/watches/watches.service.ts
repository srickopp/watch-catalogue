import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Watch } from "src/models/entities/watch.entity";
import { Repository } from "typeorm";
import { CreateWatchCatalogDto } from "./dto/create-watch.dto";
import { UpdateWatchCatalogDto } from "./dto/update-watch.dto";

@Injectable()
export class WatchesService {
  constructor(
    @InjectRepository(Watch)
    private readonly watchRepo: Repository<Watch>
  ) {}

  async createWatchCatalogue(payload: CreateWatchCatalogDto) {
    try {
      await this.validate(payload);
      const watch = await this.watchRepo.save(payload);
      return watch;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateWatchCatalogue(watchId: number, payload: UpdateWatchCatalogDto) {
    try {
      if (payload.reference_number) {
        const exsitingWatch = await this.watchRepo.findOne({
          where: {
            reference_number: payload.reference_number,
          },
        });

        if (exsitingWatch && exsitingWatch.id != watchId) {
          throw new BadRequestException({
            message: "Reference number already exist",
          });
        }
      }

      await this.watchRepo.update(
        {
          id: watchId,
        },
        {
          ...payload,
        }
      );

      return await this.watchRepo.findOne({
        where: {
          id: watchId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getWatchesList(
    filter: string,
    brand: string,
    query: {
      page: number;
      limit: number;
    }
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const qbWatch = this.watchRepo
      .createQueryBuilder("watches")
      .select([
        "watches.id",
        "watches.name",
        "watches.reference_number",
        "watches.brand",
      ]);

    if (filter) {
      qbWatch.where(
        "watches.name LIKE :filter OR watches.reference_number LIKE :filter",
        {
          filter: `%${filter}%`,
        }
      );
    }

    if (brand) {
      qbWatch.andWhere("watches.brand ILIKE :brand", {
        brand: `%${brand}%`,
      });
    }

    // Apply sorting
    qbWatch.orderBy("watches.name", "DESC");

    // Apply pagination
    qbWatch.skip((page - 1) * limit).take(limit);

    // Execute the query and get the results
    const [data, total] = await qbWatch.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getWatchDetails(id: number) {
    const watch = await this.watchRepo.findOne({
      where: {
        id,
      },
    });
    if (!watch) {
      throw new NotFoundException({
        message: "Watch not found",
      });
    }
    return watch;
  }

  async deleteWatch(id: number) {
    try {
      const watch = await this.getWatchDetails(id);
      await this.watchRepo.softDelete({
        id,
      });

      return "SUCCESS";
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async validate(payload: CreateWatchCatalogDto) {
    const [isRefNumberExist, isNameExist] = await Promise.all([
      this.watchRepo.exists({
        where: {
          reference_number: payload.reference_number,
        },
      }),
      this.watchRepo.exists({
        where: {
          name: payload.name,
        },
      }),
    ]);

    if (isRefNumberExist) {
      throw new BadRequestException({
        message: "Reference number already exist",
      });
    }

    if (isNameExist) {
      throw new BadRequestException({
        message: "Name already exist",
      });
    }
  }
}
