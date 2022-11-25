import 'package:flutter/material.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/errors/too_much_player.dart';
import 'package:worfrontend/scenes/wait_player/wait_player_scene.dart';
import 'package:worfrontend/services/game_states/game_state.dart';

class WaitPlayerState extends GameState {
  final List<String> availableIds;
  final List<PlayerInitialisationTicket> borrowed;
  final BehaviorSubject<List<PlayerInitialisationTicket>> borrowedObservable =
      BehaviorSubject();

  WaitPlayerState(super.runtimeService, this.availableIds)
      : borrowed = List<PlayerInitialisationTicket>.empty(growable: true);

  setComplete() {}

  borrow(Offset position) {
    if (availableIds.isEmpty) {
      throw TooMuchPlayer();
    }
    var id = availableIds.removeAt(0);
    var ticket = PlayerInitialisationTicket(this, id, position);
    borrowed.add(ticket);
    borrowedObservable.add(borrowed);
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
