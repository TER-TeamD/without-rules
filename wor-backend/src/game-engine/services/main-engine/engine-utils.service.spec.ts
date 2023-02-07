import { Test, TestingModule } from '@nestjs/testing';
import { EngineUtilsService } from './engine-utils.service';

describe('EnginUtilsService', () => {
  let service: EngineUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EngineUtilsService],
    }).compile();

    service = module.get<EngineUtilsService>(EngineUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
