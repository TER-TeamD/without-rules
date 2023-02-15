


import 'package:flutter/material.dart';
import 'package:worfrontend/components/avatar.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';
import 'package:worfrontend/constants.dart';

class UserAndCattleHeadsPlayerDeckFooterState extends PlayerDeckFooterState {

  final String avatar;
  final String username;
  final int? numberOfDiscardCard;

  const UserAndCattleHeadsPlayerDeckFooterState({required this.avatar, required this.username, required this.numberOfDiscardCard});

  List<List> generateCattleHeads(int? numberOfElements, int chunkSize) {
    numberOfElements ??= 0;

    List<dynamic> list = List.generate(numberOfElements, (index) => {});

    List<List<dynamic>> result = <List<dynamic>>[];
    int startIndex = 0;

    while (startIndex < list.length) {
      int endIndex = startIndex + chunkSize;
      endIndex = endIndex > list.length ? list.length : endIndex;
      result.add(list.sublist(startIndex, endIndex));
      startIndex += chunkSize;
    }


    return result;
  }

  @override
  build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ...generateCattleHeads(numberOfDiscardCard, 5).map((e) => Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ...e.map((r) => Padding(
                padding: const EdgeInsets.all(2.0),
                child: Container(
                  width: 8,
                  height: 3,
                  color: const Color.fromRGBO(229, 229, 229, 1.0),
                  child: const Text(""),
                ),
              ))
            ],
          )),
          Padding(
            padding: const EdgeInsets.fromLTRB(0.0, 4.0, 0, 0),
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
          ),
        ],
      ),
    );
  }
}
