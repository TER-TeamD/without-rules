import {Controller, Post} from '@nestjs/common';
import {GameEngineService} from "../services/game-engine.service";

@Controller('game-engine')
export class GameEngineController {


    constructor(private readonly gameEngineService: GameEngineService) {}


    @Post('/start-game')
    public async startGame() {
        return {
            "status": "Game is launched"
        }
    }



}
