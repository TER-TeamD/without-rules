import '../player_action.dart';

class SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction
    extends PlayerAction {
  final int stackNumber;

  SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction(this.stackNumber)
      : super(sendCardToStackAndAddCardToPlayerDiscard);

  SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction.fromJson(
      Map<String, dynamic> json)
      : this(json['stack_number']);

  @override
  toJson() => {
    'type': type,
    'stack_number': stackNumber,
  };
}