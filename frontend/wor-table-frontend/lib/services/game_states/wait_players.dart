import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/errors/too_much_player.dart';
import 'package:worfrontend/scenes/choose_card/choose_card_scene.dart';
import 'package:worfrontend/scenes/wait_player/wait_player_scene.dart';
import 'package:worfrontend/services/game_states/game_runtime_state.dart';
import 'package:worfrontend/services/game_states/game_state.dart';
import 'package:worfrontend/services/network/models/new_game_dto.dart';
import 'package:worfrontend/services/network/network_service.dart';
import 'package:worfrontend/services/table_service.dart';

class WaitPlayerState extends GameState {
  final NewGameDto createdGame;
  final List<String> availableIds;
  final List<PlayerInitialisationTicket> borrowed;
  final BehaviorSubject<List<PlayerInitialisationTicket>> borrowedObservable =
      BehaviorSubject();

  WaitPlayerState(super.runtimeService, this.createdGame)
      : borrowed = List<PlayerInitialisationTicket>.empty(growable: true),
        availableIds = createdGame.potentialPlayersId;

  setComplete() {
    GetIt.I.get<TableService>().startGame().then((value) =>
        runtimeService.changeState(GameRuntimeState(runtimeService, value)));
  }

  @override
  void onLoad() {
    print("Waiting for player :\n" + createdGame.potentialPlayersId.join("\n"));
  }

  borrow(Offset position) {
    if (availableIds.isEmpty) {
      throw TooMuchPlayer();
    }
    var id = availableIds.removeAt(0);
    var ticket = PlayerInitialisationTicket(this, id, position);
    borrowed.add(ticket);
    borrowedObservable.add(borrowed);
    GetIt.I.get<TableService>().setPlayerPosition(id, position);
    return ticket;
  }

  unborrow(PlayerInitialisationTicket ticket) {
    borrowed.remove(ticket);
    availableIds.add(ticket.id);
    borrowedObservable.add(borrowed);
  }

  @override
  Widget buildUI(BuildContext context) {
    return WaitPlayerScene(gameState: this);
  }
}

class PlayerInitialisationTicket {
  final WaitPlayerState _state;
  final String id;
  final Offset position;

  PlayerInitialisationTicket(this._state, this.id, this.position);

  release() {
    _state.unborrow(this);
  }
}
