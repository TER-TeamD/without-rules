import 'dart:convert';

import 'package:worfrontend/errors/app_error.dart';

class IncoherentActionForState extends AppError {
  final String stateName;
  final String action;

  const IncoherentActionForState(this.stateName, this.action);

  @override
  String screenMessage() {
    return "Incoherent action ($action) for the state + $stateName";
  }
}
