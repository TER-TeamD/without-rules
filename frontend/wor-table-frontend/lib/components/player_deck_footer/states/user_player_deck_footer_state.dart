

import 'package:flutter/material.dart';
import 'package:worfrontend/components/avatar.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';
import 'package:worfrontend/constants.dart';

class UserPlayerDeckFooterState extends PlayerDeckFooterState {

  final String avatar;
  final String username;

  const UserPlayerDeckFooterState({required this.avatar, required this.username});

  @override
  build(BuildContext context) {
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Avatar(avatar: avatar),
          Padding(
            padding: const EdgeInsets.fromLTRB(5.0, 0.0, 0.0, 0.0),
            child: Text(
              "$username",
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: ID_ON_CARD_WHEN_INIT_COLOR,
              ),
            ),
          )
        ],
      ),
    );
  }
}
