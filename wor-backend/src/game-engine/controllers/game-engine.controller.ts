import {Body, Controller, Param, Post} from '@nestjs/common';
import {GameEngineService} from "../services/game-engine.service";
import {NewGameDto} from "../dto/new-game.dto";
import {ApiBody, ApiOkResponse, ApiParam} from "@nestjs/swagger";
import {StatusDto} from "../dto/status.dto";
import {Game, Player} from "../schema/game.schema";
import {PlayedCardDto} from "../dto/played-card.dto";

@Controller('game-engine')
export class GameEngineController {


    constructor(private readonly gameEngineService: GameEngineService) {}



    @Post('/create-game')
    @ApiOkResponse({ type: NewGameDto, description: 'We instanciate a new game and propose to some players to join' })
    public async createGame(): Promise<NewGameDto> {
        return this.gameEngineService.createNewGame();
    }

    @Post('/player/:id_player/join-game')
    @ApiOkResponse({ type: StatusDto, description: 'The player is ready to start the game' })
    public async playerWantToJoinAGame(@Param('id_player') idPlayer: string): Promise<Player> {
        return this.gameEngineService.playerWantToJoinAGame(idPlayer);
    }

    @Post('/start-game')
    @ApiOkResponse({ type: Game, description: 'The game is launched' })
    public async startGame(): Promise<Game> {
        return this.gameEngineService.startGame();
    }

    @Post('/player/:id_player/play-card')
    @ApiBody({type: PlayedCardDto})
    @ApiOkResponse({ type: StatusDto, description: 'The player played a card' })
    public async playerPlayedACard(@Param('id_player') idPlayer: string, @Body() body: PlayedCardDto): Promise<StatusDto> {
        return this.gameEngineService.playerPlayedACard(idPlayer, body);
    }


    @Post('/game/delete')
    @ApiOkResponse({ type: StatusDto })
    public async deleteGame(): Promise<StatusDto> {
        return this.gameEngineService.deleteGame();
    }



}
