import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/models/transform.dart';
import 'package:worfrontend/services/network/models/game_card.dart';

class AddCardAndGetStackContent extends StatefulWidget {
  final String id;
  final SceneData sceneData;
  final int stackNumber;
  final GameCard card;
  final String playerId;
  final void Function()? onDone;

  const AddCardAndGetStackContent(
      {Key? key,
      required this.id,
      required this.sceneData,
      required this.stackNumber,
      required this.card,
      required this.playerId,
      this.onDone})
      : super(key: key);

  @override
  State<AddCardAndGetStackContent> createState() =>
      _AddCardAndGetStackContentState(id);
}

class _AddCardAndGetStackContentState extends State<AddCardAndGetStackContent>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final String id;

  _AddCardAndGetStackContentState(this.id);

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: Duration(milliseconds: 8000));
    _controller.reset();
    _controller.forward(from: 0);

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        widget.onDone?.call();
      }
    });
  }

  @override
  void didUpdateWidget(covariant AddCardAndGetStackContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.id != widget.id) {
      _controller.reset();
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget animatedCard(AppTransform transform, GameCard card) {
    return Transform.translate(
        offset: transform.position,
        child: Transform.rotate(
            angle: transform.rotation,
            child: CardComponent(card: card, isStackHead: false)));
  }

  Iterable<Widget> drawStackElements(
      StackViewInstance stack,
      AppTransform deckTransform,
      AppTransform startTransform,
      Interval interval) {
    return stack
        .getCards()
        .where((card) => card.card.value != widget.card.value)
        .map((card) {
      var tween = TweenSequence([
        if (stack.stack.stackCards.isNotEmpty)
          TweenSequenceItem(
              tween: Tween<AppTransform>(
                  begin: AppTransform(card.getPosition(), 0),
                  end: startTransform),
              weight: 1),
        TweenSequenceItem(
            tween:
                Tween<AppTransform>(begin: startTransform, end: deckTransform),
            weight: 1)
      ]).animate(CurvedAnimation(parent: _controller, curve: interval));

      return animatedCard(tween.value, card.card);
    });
  }

  @override
  Widget build(BuildContext context) {
    var cardToStack = const Interval(0, 0.25);
    var stackToDiscard = const Interval(0.25, 0.75);
    var cardToStackHead = const Interval(0.75, 1);

    return AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          var cards = widget.sceneData.stacks[widget.stackNumber];
          var stack = widget.sceneData.stacks[widget.stackNumber];
          var deckTransform = widget.sceneData.decks[widget.playerId]! -
              const AppTransform(CardComponent.size, 0.0) * 0.5;
          var rightTransform = AppTransform(
              widget.sceneData.stacks[widget.stackNumber]
                  .followingCardHolderPosition(included: false),
              0);
          var firstTransform = AppTransform(
              widget.sceneData.stacks[widget.stackNumber].getPosition(0), 0);
          var lastCardTween = TweenSequence([
            TweenSequenceItem(
                tween: Tween<AppTransform>(
                    begin: AppTransform(
                        deckTransform.position, deckTransform.rotation),
                    end: rightTransform),
                weight: 1),
            TweenSequenceItem(
                tween: ConstantTween<AppTransform>(rightTransform), weight: 2),
            TweenSequenceItem(
                tween: Tween<AppTransform>(
                    begin: rightTransform, end: firstTransform),
                weight: 1)
          ]);

          return Stack(children: [
            ...drawStackElements(
                stack, deckTransform, firstTransform, stackToDiscard),
            animatedCard(lastCardTween.animate(_controller).value, widget.card),
          ]);
        });
  }
}
