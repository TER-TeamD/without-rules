import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:worfrontend/game_states/wait_players.dart';

class PlayerStandInit extends StatelessWidget {
  final PlayerInitialisationTicket ticket;

  const PlayerStandInit({super.key, required this.ticket});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 110,
      child: Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 161, 161, 161),
            borderRadius: BorderRadius.all(Radius.circular(10))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Column(
              children: [
                QrImage(
                  data: ticket.id,
                  size: 90,
                ),
                Text("Id: ${ticket.id}")
              ],
            ),
            Column(mainAxisSize: MainAxisSize.min, children: [
              const Text("Scan to log"),
              const Text("No player"),
              TextButton(
                  onPressed: () => ticket.release(),
                  child: const Text("Remove"))
            ]),
          ],
        ),
      ),
    );
  }
}
