import { Test, TestingModule } from '@nestjs/testing';
import { RoundResultService } from './round-result.service';

describe('RoundResultService', () => {
  let service: RoundResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundResultService],
    }).compile();

    service = module.get<RoundResultService>(RoundResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
