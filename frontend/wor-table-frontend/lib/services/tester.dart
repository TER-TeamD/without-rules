import 'dart:convert';

import 'package:socket_io_client/socket_io_client.dart';
import 'package:worfrontend/services/network/models/game_card.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import 'game_controller.dart';
import 'logger.dart';

class MobileTester {
  final String id;
  final String hostname;
  late Socket socket;
  final GameController controller;
  final int latency;

  MobileTester(this.id, this.hostname, this.controller, {this.latency = 600}) {
    Logger.log("Starting tester $id");

    socket = io(
        hostname,
        { ...OptionBuilder()
            .enableForceNew()
            .enableForceNewConnection()
            .build(), 'auth': <String, dynamic>{'id': id, 'type': "PLAYER"}});

    Player? player = null;

    socket.onAny((topic, data) {
      Logger.log("Player $id received $topic: $data");

      if (data is Map<String, dynamic>) {
        if (data['player'] != null) {
          player = Player.fromJson(data['player']);
        }
      }

      if (player == null) return;

      Future.delayed(Duration(milliseconds: latency)).then((_) {
        switch (topic) {
          case "START_GAME":
          case "NEW_ROUND":
            playCard(player!.cards.first);
            break;
        }
      });
    });

    Future.delayed(Duration(milliseconds: latency)).then((value) {
      emit('PLAYER_JOIN_GAME', <String, dynamic>{'player_id': id});
    });

    controller.lastTopic$.listen((topic) {
      switch (topic) {
        case "NEW_RESULT_ACTION":
          var action = controller
              .game$.value.inGameProperty?.betweenRound?.currentPlayerAction;
          if (action == null) break;

          // Check if this specific player should choose
          if(!controller.doUserShouldChoose()) break;
          if (action.player.id != id) break;

          // Choose the first stack
          var stack = controller.game$.value.inGameProperty?.stacks.first;
          if (stack == null) break;
          chooseStackCard(stack);
          break;
      }
    });
  }

  void playCard(GameCard card) {
    Logger.log("Player $id played card ${card.value}");
    emit("PLAYER_PLAYED_CARD",
        <String, dynamic>{'player_id': id, 'card_value': card.value});
  }

  void chooseStackCard(StackCard stack) {
    Logger.log("Player $id chose stack card ${stack.stackNumber}");
    controller.chooseStack(stack.stackNumber);
  }

  emit(String topic, dynamic data) {
    Logger.log("Player $id emitted $topic: $data");
    socket.emit(topic, data);
  }
}
