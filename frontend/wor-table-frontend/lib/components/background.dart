import 'dart:async';

import 'package:flutter/material.dart';
import 'package:worfrontend/constants.dart';
import 'package:worfrontend/services/game_controller.dart';

class Background extends StatefulWidget {
  final GameController controller;

  const Background({Key? key, required this.controller}) : super(key: key);

  @override
  State<Background> createState() => _BackgroundState();
}

class _BackgroundState extends State<Background>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool blink = false;
  StreamSubscription<bool>? _blinkSubscription;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(vsync: this, duration: const Duration(seconds: 1));
    _controller.addListener(() {
      if (_controller.isCompleted) {
        _controller.forward(from: 0);
      }
    });

    widget.controller.chronometer$.listen((event) {
      bool previous = blink;
      blink = false;

      if(_blinkSubscription != null) {
        _blinkSubscription!.cancel();
      }

      _blinkSubscription = event?.isAlert$.listen((value) {
        bool previous = blink;
        setState(() {
          blink = value;
        });

        if(blink != previous) {
          triggerBlinkChange();
        }
      });

      if(blink != previous) {
        triggerBlinkChange();
      }
    });

  }

  void triggerBlinkChange() {
    if(blink) {
      _controller.forward(from: 0);
    } else {
      _controller.stop();
      _controller.reset();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  final Color _alertColor = const Color(0xff814040);

  @override
  Widget build(BuildContext context) {
    var deco1 = const BoxDecoration(
        gradient: LinearGradient(
          colors: [BACKGROUND_TABLE_COLOR_1, BACKGROUND_TABLE_COLOR_2],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ));
    var deco2 = const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xff981e1e), Color(0xFF460B0B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ));

    return AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          var decoration = TweenSequence([
            TweenSequenceItem(
                tween: DecorationTween(begin: deco1, end: deco2),
                weight: 1),
            TweenSequenceItem(
                tween: DecorationTween(begin: deco2, end: deco1),
                weight: 1),
          ]).animate(_controller);
          return Container(
              decoration: decoration.value
          );
        },
        child: Container(
          decoration: const BoxDecoration(color: Colors.black),
        ));
  }
}
