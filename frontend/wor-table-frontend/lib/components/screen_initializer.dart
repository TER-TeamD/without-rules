import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';

import '../services/screen_service.dart';

class ScreenInitializer extends StatelessWidget {
  final Widget child;

  const ScreenInitializer({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    GetIt.I.get<ScreenService>().setScreenSize(context);
    return child;
  }
}
