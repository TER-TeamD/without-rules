enum SocketMessageTypes { initiateGame, cardPlayedByUser, newActions, results }

SocketMessageTypes getSocketMessageType(String type) {
  switch (type) {
    case "INITIATE_GAME":
      return SocketMessageTypes.initiateGame;
    case "CARD_PLAYED_BY_USER":
      return SocketMessageTypes.cardPlayedByUser;
    case "NEW_ACTIONS":
      return SocketMessageTypes.newActions;
    case "RESULTS":
      return SocketMessageTypes.results;
  }
  throw "Message type not found.";
}
