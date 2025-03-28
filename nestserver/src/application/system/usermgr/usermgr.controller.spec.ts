import { Test, TestingModule } from '@nestjs/testing';
import { UsermgrController } from './usermgr.controller';

describe('UsermgrController', () => {
  let controller: UsermgrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsermgrController],
    }).compile();

    controller = module.get<UsermgrController>(UsermgrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
