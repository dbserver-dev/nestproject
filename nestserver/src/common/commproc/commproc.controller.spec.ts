import { Test, TestingModule } from '@nestjs/testing';
import { CommprocController } from './commproc.controller';

describe('CommprocController', () => {
  let controller: CommprocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommprocController],
    }).compile();

    controller = module.get<CommprocController>(CommprocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
