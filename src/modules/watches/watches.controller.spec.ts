import { Test, TestingModule } from '@nestjs/testing';
import { WatchesController } from './watches.controller';

describe('WatchesController', () => {
  let controller: WatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchesController],
    }).compile();

    controller = module.get<WatchesController>(WatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
