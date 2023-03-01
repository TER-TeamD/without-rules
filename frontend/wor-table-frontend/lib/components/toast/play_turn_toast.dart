import 'package:flutter/material.dart';
import 'toast.dart';

class PlayTurnToast extends StatelessWidget {
  const PlayTurnToast({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Toast(child: Row(
      mainAxisSize: MainAxisSize.min,
      children: const [
        Icon(Icons.smartphone, color: Colors.white),
        SizedBox(width: 10),
        Text("Time to play !", style: TextStyle(color: Colors.white, fontSize: 25)),
      ],
    ));
  }
}
