import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';

import '../../services/network/models/socket_models/result.dart';

class FinalScene extends StatelessWidget {
  final List<Result> results;

  const FinalScene({super.key, required this.results});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(results
          .map((r) => r.isWinner
              ? "${r.idPlayer} is winner !"
              : "${r.idPlayer} is looser...")
          .join("\n")),
    );
  }
}
