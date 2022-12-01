import 'package:rxdart/subjects.dart';
import 'package:worfrontend/services/game_states/game_state.dart';

class GameRuntimeService {
  late GameState state;
  final BehaviorSubject<GameState> stateObservable = BehaviorSubject();

  GameRuntimeService();

  changeState(GameState state) {
    this.state = state;
    state.onLoad();
    stateObservable.add(state);
  }
}
