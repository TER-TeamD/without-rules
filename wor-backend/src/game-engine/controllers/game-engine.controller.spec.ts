import { Test, TestingModule } from '@nestjs/testing';
import { GameEngineController } from './game-engine.controller';

describe('GameEngineController', () => {
  let controller: GameEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameEngineController],
    }).compile();

    controller = module.get<GameEngineController>(GameEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
