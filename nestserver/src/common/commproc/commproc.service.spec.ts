import { Test, TestingModule } from '@nestjs/testing';
import { CommprocService } from './commproc.service';

describe('CommprocService', () => {
  let service: CommprocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommprocService],
    }).compile();

    service = module.get<CommprocService>(CommprocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
