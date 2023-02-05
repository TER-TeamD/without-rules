abstract class AppError {
  const AppError();

  String screenMessage();
}

class UnexpectedError extends AppError {
  final String message;

  UnexpectedError(this.message);

  @override
  String screenMessage() {
    return "Unexpected error: $message";
  }
}