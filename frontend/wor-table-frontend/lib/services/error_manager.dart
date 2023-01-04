import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/errors/app_error.dart';

class ErrorManager {
  final Subject<AppError> onError = BehaviorSubject();
  AppError? error;

  void throwError(AppError error) {
    this.error = error;
    onError.add(error);
  }

  static AppError handle(AppError error) {
    GetIt.I.get<ErrorManager>().throwError(error);
    return error;
  }
}
