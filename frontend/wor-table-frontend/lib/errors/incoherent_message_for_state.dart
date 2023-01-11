import 'package:worfrontend/errors/app_error.dart';

class UnexpectedState extends AppError {
  final String expected;
  final String received;

  const UnexpectedState(this.expected, this.received);

  @override
  String screenMessage() {
    return "Incoherent action ($received) for the state + $expected";
  }
}
