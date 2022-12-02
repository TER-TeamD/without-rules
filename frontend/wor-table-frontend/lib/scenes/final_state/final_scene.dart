import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';

class FinalScene extends StatelessWidget {
  final Results results;

  const FinalScene({super.key, required this.results});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(results.results
          .map((r) => r.isWinner
              ? "${r.idPlayer} is winner !"
              : "${r.idPlayer} is looser...")
          .join("\n")),
    );
  }
}
