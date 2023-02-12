import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class PlayTurnToast extends StatefulWidget {
  const PlayTurnToast({Key? key}) : super(key: key);

  @override
  State<PlayTurnToast> createState() => _PlayTurnToastState();
}

class _PlayTurnToastState extends State<PlayTurnToast> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 3000));
    _controller.forward(from: 0);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget content() {
    return Center(
      child: SizedBox(
        width: 300,
        height: 70,
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(5),
            color: Colors.black,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.smartphone, color: Colors.white),
              SizedBox(width: 10),
              const Text("Time to play !", style: TextStyle(color: Colors.white, fontSize: 25)),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(animation: _controller, builder: (context, child) {
      var opacityTween = TweenSequence<double>([
        TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 1),
        TweenSequenceItem(tween: ConstantTween(1), weight: 5),
        TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 2)
      ]).animate(_controller);
      return Container(
        alignment: Alignment.center,
        child: Opacity(opacity: opacityTween.value, child: Container(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(child: RotatedBox(quarterTurns: 2, child: content())),
              Expanded(child: content()),
            ],
          )
          ),
        ),
      );
    });
  }
}
