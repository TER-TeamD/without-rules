import 'package:worfrontend/components/decks.dart';

import '../components/stacks.dart';

class SceneData {
  final List<StackViewInstance> stacks;
  final Map<String, DeckTransform> decks;

  SceneData(this.stacks, this.decks);
}