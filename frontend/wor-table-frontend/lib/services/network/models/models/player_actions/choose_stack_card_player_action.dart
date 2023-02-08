import '../player_action.dart';

class ChooseStackCardPlayerAction extends PlayerAction {
  final int? choosenStackCardByPlayer;

  ChooseStackCardPlayerAction(this.choosenStackCardByPlayer)
      : super(chooseCardStack);

  ChooseStackCardPlayerAction.fromJson(Map<String, dynamic> json)
      : this(json['choosen_stack_card_by_player']);

  @override
  toJson() => {
    'type': type,
    'choosen_stack_card_by_player': choosenStackCardByPlayer,
  };
}