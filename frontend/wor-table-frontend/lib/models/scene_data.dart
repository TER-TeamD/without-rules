import 'package:worfrontend/models/transform.dart';

import '../components/stacks.dart';

class SceneData {
  final List<StackViewInstance> stacks;
  final Map<String, AppTransform> decks;

  SceneData(this.stacks, this.decks);
}