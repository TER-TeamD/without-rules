import 'dart:developer';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/played.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/components/player_deck/states/wait_player.dart';
import 'package:worfrontend/models/table_player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

import '../services/network/models/card.dart';

class GameScene extends StatefulWidget {
  final GameSceneState guiState;

  const GameScene({super.key, required this.guiState});

  @override
  State<GameScene> createState() => guiState;
}

class GameSceneState extends State<GameScene> {
  List<StackCard> stacks;
  List<TablePlayer> players;

  Map<String, PlayerDeckState> deckStates;

  GameSceneState(this.stacks, this.players)
      : deckStates = <String, PlayerDeckState>{
          for (var element in players)
            element.id: element.player == null
                ? DeckNoPlayer()
                : DeckWaitPlayer(element.id)
        };

  setTurnStart() {
    deckStates = <String, PlayerDeckState>{
      for (var element in players)
        element.id: element.player == null ? DeckNoPlayer() : DeckPlaying()
    };
    if (mounted) setState(() => deckStates = deckStates);
  }

  setPlayerPlayed(String playerId) {
    log(playerId);
    setState(() {
      deckStates[playerId] = DeckWaitOtherPlayers();
    });
  }

  setPlayerPlayedCard(String playerId, Card card) {
    setState(() {
      deckStates[playerId] = DeckPlayed(card);
    });
  }

  unsetPlayerPlayed(String playerId) {
    setState(() {
      deckStates[playerId] = DeckPlaying();
    });
  }

  resetPlayerPlayed() {
    setState(() {
      deckStates = <String, PlayerDeckState>{
        for (var e in players)
          e.id: e.player == null ? DeckNoPlayer() : DeckPlaying()
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
        Decks(states: deckStates)
      ],
    );
  }
}
