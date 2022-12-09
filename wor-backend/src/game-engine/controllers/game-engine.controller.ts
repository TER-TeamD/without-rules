import {Body, Controller, Logger, Param, Post} from '@nestjs/common';
import {GameEngineService} from "../services/game-engine.service";
import {NewGameDto} from "../dto/new-game.dto";
import {ApiBody, ApiOkResponse, ApiParam} from "@nestjs/swagger";
import {StatusDto} from "../dto/status.dto";
import {Game, Player} from "../schema/game.schema";
import {PlayedCardDto} from "../dto/played-card.dto";

@Controller('game-engine')
export class GameEngineController {

    private logger: Logger = new Logger(GameEngineService.name);


    constructor(private readonly gameEngineService: GameEngineService) {}



    @Post('/create-game')
    @ApiOkResponse({ type: NewGameDto, description: 'We instanciate a new game and propose to some players to join' })
    public async createGame(): Promise<NewGameDto> {
        this.logger.log('Create new game');
        return this.gameEngineService.createNewGame();
    }

    @Post('/player/:id_player/join-game')
    @ApiOkResponse({ type: StatusDto, description: 'The player is ready to start the game' })
    public async playerWantToJoinAGame(@Param('id_player') idPlayer: string): Promise<Player> {
        this.logger.log(`Player ${idPlayer} join the game`);
        return this.gameEngineService.playerWantToJoinAGame(idPlayer);
    }

    @Post('/start-game')
    @ApiOkResponse({ type: Game, description: 'The game is launched' })
    public async startGame(): Promise<Game> {
        this.logger.log(`Start the game`);
        return this.gameEngineService.startGame();
    }

    @Post('/player/:id_player/play-card')
    @ApiBody({type: PlayedCardDto})
    @ApiOkResponse({ type: StatusDto, description: 'The player played a card' })
    public async playerPlayedACard(@Param('id_player') idPlayer: string, @Body() body: PlayedCardDto): Promise<StatusDto> {
        this.logger.log(`Player ${idPlayer} played the card ${body.card_value}`);
        return this.gameEngineService.playerPlayedACard(idPlayer, body);
    }


    @Post('/game/delete')
    @ApiOkResponse({ type: StatusDto })
    public async deleteGame(): Promise<StatusDto> {
        this.logger.log(`Delete the game`);
        return this.gameEngineService.deleteGame();
    }
}
