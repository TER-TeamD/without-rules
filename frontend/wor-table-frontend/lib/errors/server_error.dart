import 'package:worfrontend/errors/app_error.dart';

class ServerError extends AppError {
  final int code;
  final String message;
  const ServerError(this.code, this.message);

  @override
  String screenMessage() {
    return "$code: $message";
  }
}
