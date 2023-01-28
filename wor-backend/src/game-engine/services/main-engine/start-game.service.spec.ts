import { Test, TestingModule } from '@nestjs/testing';
import { StartGameService } from './start-game.service';
import {InjectModel, MongooseModule} from "@nestjs/mongoose";
import {Game, GameDocument, GameSchema} from "../../schema/game.schema";
import {Model} from "mongoose";

describe('StartGameService', () => {
  let service: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
      providers: [StartGameService],
    }).compile();

    service = module.get<StartGameService>(StartGameService);
  });

  it('Generate a new game', async () => {

    const game: Game = await service.generateNewGame();

    const gamesInDB: Game[] = await service.gameModel.find({});
    expect(gamesInDB.length).toEqual(1);

    await service.__deleteOtherGames();
  })

  it('Start a new game', async () => {

    await service.__deleteOtherGames();

    const game1: Game = await service.__createNewGame();
    const game2: Game = await service.__createNewGame();

    const gamesInDB: Game[] = await service.gameModel.find({});
    expect(gamesInDB.length).toEqual(2);

    await service.__deleteOtherGames();
    const gamesEmptyInDB: Game[] = await service.gameModel.find({});
    expect(gamesEmptyInDB.length).toEqual(0);
  })

  it('Verify that all games are deleted', async () => {

    await service.__deleteOtherGames();
    const gamesInDB: Game[] = await service.gameModel.find({});
    expect(gamesInDB.length).toEqual(0);
  });


});
