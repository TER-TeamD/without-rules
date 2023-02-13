import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/models/player.dart';

import '../../constants.dart';

class CardBack extends StatelessWidget {

  final Player player;

  const CardBack({super.key, required this.player});

  @override
  Widget build(BuildContext context) {

    return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              PROD ? 'assets/assets/images/avatars/${player.avatar}.png' : 'images/avatars/${player.avatar}.png',
              width: 60.0,
            ),
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Text(
                player.username != null ? "${player.username}" : "",
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: ID_ON_CARD_WHEN_INIT_COLOR,
                ),
              ),
            )
          ],
        )
    );
  }
}
