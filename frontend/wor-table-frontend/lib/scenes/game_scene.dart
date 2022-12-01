import 'dart:developer';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/player_deck.dart';
import 'package:worfrontend/models/table_player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

import '../services/network/models/card.dart';

class GameScene extends StatefulWidget {
  final GameSceneState guiState;

  const GameScene({super.key, required this.guiState});

  @override
  State<GameScene> createState() => guiState;
}

class PlayerTurn {
  final PlayerState state;
  final Card? playedCard;

  PlayerTurn({this.state = PlayerState.waiting, this.playedCard});
}

class GameSceneState extends State<GameScene> {
  List<StackCard> stacks;
  List<TablePlayer> players;

  Map<String, PlayerTurn> playerPlayed;

  GameSceneState(this.stacks, this.players)
      : playerPlayed = <String, PlayerTurn>{
          for (var element in players) element.player.id: PlayerTurn()
        };

  setTurnStart() {
    playerPlayed = <String, PlayerTurn>{
      for (var element in players)
        element.player.id: PlayerTurn(state: PlayerState.playing)
    };
    if (mounted) setState(() => playerPlayed = playerPlayed);
  }

  setPlayerPlayed(String playerId) {
    log(playerId);
    setState(() {
      playerPlayed[playerId] =
          PlayerTurn(state: PlayerState.waitingAfterPlaying);
    });
  }

  setPlayerPlayedCard(String playerId, Card card) {
    setState(() {
      playerPlayed[playerId] =
          PlayerTurn(state: PlayerState.revealCard, playedCard: card);
    });
  }

  unsetPlayerPlayed(String playerId) {
    setState(() {
      playerPlayed[playerId] = PlayerTurn();
    });
  }

  resetPlayerPlayed() {
    setState(() {
      playerPlayed = <String, PlayerTurn>{
        for (var e in players)
          e.player.id: PlayerTurn(state: PlayerState.playing)
      };
    });
  }

  setStacks(List<StackCard> newStacks) {
    setState(() {
      stacks = newStacks;
    });
  }

  @override
  Widget build(BuildContext context) {
    log(players.map((e) => e.position).join("\n"));
    return Stack(
      children: [
        Center(
            child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: stacks
                    .map((e) => Padding(
                        padding: const EdgeInsets.all(10),
                        child: CardComponent(card: e.stackHead)))
                    .toList())),
        ...players.map((e) {
          var result = playerPlayed[e.player.id]!;
          return Positioned(
              top: e.position.dy,
              left: e.position.dx,
              child: PlayerDeck(
                  state: result.state, playedCard: result.playedCard));
        })
      ],
    );
  }
}
