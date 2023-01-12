import 'package:worfrontend/services/network/models/card.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

enum GameAnimations {
  pushOnTop,
  pushAndPop
}

class GameAnimation {
  final GameAnimations type;

  GameAnimation(this.type);
}

class PushOnTopAnimationData extends GameAnimation {
  final GameCard card;
  final StackCard stack;
  final String playerId;

  PushOnTopAnimationData(this.card, this.stack, this.playerId, super.type);
}
