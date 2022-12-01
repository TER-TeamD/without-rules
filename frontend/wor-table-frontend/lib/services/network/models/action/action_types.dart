enum ActionTypes { pushOnTop, clearPush }

ActionTypes getActionType(String type) {
  switch (type) {
    case "PUSH_ON_TOP":
      return ActionTypes.pushOnTop;
    case "CLEAR_PUSH":
      return ActionTypes.clearPush;
  }
  throw "Unknown action type.";
}
