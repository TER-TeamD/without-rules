import 'package:flutter/widgets.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/services/error_manager.dart';

class ErrorHandler extends StatefulWidget {
  final ErrorManager errorManager;
  final Widget child;

  const ErrorHandler({Key? key, required this.errorManager, required this.child }) : super(key: key);

  @override
  State<ErrorHandler> createState() => _ErrorHandlerState();
}

class _ErrorHandlerState extends State<ErrorHandler> {
  AppError? error;

  @override
  void initState() {
    super.initState();
    widget.errorManager.onError.listen((error) {
      setState(() {
        this.error = error;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if(error == null) {
      return widget.child;
    } else {
      return Stack(children: [
        widget.child,
        Center(child: Text(error!.screenMessage()))
      ]);
    }
  }
}
