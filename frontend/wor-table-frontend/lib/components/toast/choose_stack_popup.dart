import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/avatar.dart';
import 'package:worfrontend/services/network/models/models/player.dart';

class ChooseStackToast extends StatelessWidget {
  final Player player;

  const ChooseStackToast({ Key? key, required this.player }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Avatar(avatar: player.avatar),
        const SizedBox(width: 10),
        Text("${player.username} please choose a stack !", style: const TextStyle(color: Colors.white, fontSize: 25)),
      ]);
  }
}
