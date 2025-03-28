import { Test, TestingModule } from '@nestjs/testing';
import { UsermgrService } from './usermgr.service';

describe('UsermgrService', () => {
  let service: UsermgrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsermgrService],
    }).compile();

    service = module.get<UsermgrService>(UsermgrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
