import 'package:worfrontend/errors/app_error.dart';

class NetworkUninitialized implements AppError {
  @override
  String screenMessage() {
    return "Network uninitialized";
  }
}
