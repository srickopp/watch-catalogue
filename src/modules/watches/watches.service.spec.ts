import { Test, TestingModule } from "@nestjs/testing";
import { WatchesService } from "./watches.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { Watch } from "../../models/entities/watch.entity";

const mockWatchRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
  softDelete: jest.fn(),
  exists: jest.fn(),
});

describe("WatchesService", () => {
  let service: WatchesService;
  let repository: Repository<Watch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchesService,
        {
          provide: getRepositoryToken(Watch),
          useFactory: mockWatchRepository,
        },
      ],
    }).compile();

    service = module.get<WatchesService>(WatchesService);
    repository = module.get<Repository<Watch>>(getRepositoryToken(Watch));
  });

  describe("createWatchCatalogue", () => {
    it("should create a new watch", async () => {
      const watchDto = {
        name: "Rolex",
        reference_number: "12345",
        brand: "Rolex",
      };

      (repository.save as jest.Mock).mockResolvedValue(watchDto);
      (repository.exists as jest.Mock).mockResolvedValue(false);

      const result = await service.createWatchCatalogue(watchDto as any);

      expect(result).toEqual(watchDto);
      expect(repository.save).toHaveBeenCalledWith(watchDto);
    });

    it("should throw an error if reference number exists", async () => {
      const watchDto = {
        name: "Rolex",
        reference_number: "12345",
        brand: "Rolex",
      };

      (repository.exists as jest.Mock).mockResolvedValueOnce(true);

      await expect(
        service.createWatchCatalogue(watchDto as any)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("updateWatchCatalogue", () => {
    it("should update the watch if valid", async () => {
      const watchId = 1;
      const updateDto = {
        name: "Omega",
        reference_number: "54321",
        brand: "Omega",
      };

      const existingWatch = {
        id: watchId,
        name: "Rolex",
        reference_number: "12345",
        brand: "Rolex",
      };

      (repository.findOne as jest.Mock).mockResolvedValue(existingWatch);
      (repository.update as jest.Mock).mockResolvedValue(undefined);
      (repository.findOne as jest.Mock).mockResolvedValue({
        id: watchId,
        ...updateDto,
      });

      const result = await service.updateWatchCatalogue(
        watchId,
        updateDto as any
      );

      expect(result).toEqual({ id: watchId, ...updateDto });
    });

    it("should throw an error if reference number already exists", async () => {
      const watchId = 1;
      const updateDto = {
        name: "Omega",
        reference_number: "54321",
        brand: "Omega",
      };

      (repository.findOne as jest.Mock).mockResolvedValue({ id: 2 });
      (repository.exists as jest.Mock).mockResolvedValue(true);

      await expect(
        service.updateWatchCatalogue(watchId, updateDto as any)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("getWatchesList", () => {
    it("should return a paginated list of watches", async () => {
      const filter = "Rolex";
      const brand = "Rolex";
      const query = { page: 1, limit: 10 };

      const qb: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[{ id: 1, name: "Rolex" }], 1]),
        select: jest.fn().mockReturnThis(),
      };

      (repository.createQueryBuilder as jest.Mock).mockReturnValue(qb);

      const result = await service.getWatchesList(filter, brand, query);

      expect(result).toEqual({
        data: [{ id: 1, name: "Rolex" }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe("getWatchDetails", () => {
    it("should return the watch if found", async () => {
      const watchId = 1;
      const watch = { id: watchId, name: "Rolex" };

      (repository.findOne as jest.Mock).mockResolvedValue(watch);

      const result = await service.getWatchDetails(watchId);

      expect(result).toEqual(watch);
    });

    it("should throw a NotFoundException if watch not found", async () => {
      const watchId = 1;

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getWatchDetails(watchId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("deleteWatch", () => {
    it("should delete the watch if found", async () => {
      const watchId = 1;
      const watch = { id: watchId, name: "Rolex" };

      (repository.findOne as jest.Mock).mockResolvedValue(watch);

      await service.deleteWatch(watchId);

      expect(repository.softDelete).toHaveBeenCalledWith({ id: watchId });
    });

    it("should throw a NotFoundException if watch not found", async () => {
      const watchId = 1;

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteWatch(watchId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
