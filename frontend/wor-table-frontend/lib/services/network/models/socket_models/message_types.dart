enum SocketMessageTypes {
  initiateGame,
  cardPlayedByUser,
  newActions,
  results,
  nextRound,
  playerJoined
}

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
    case "NEXT_ROUND":
      return SocketMessageTypes.nextRound;
    case "PLAYER_JOINED":
      return SocketMessageTypes.playerJoined;
  }
  throw "Message type not found.";
}
