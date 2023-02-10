const String createNewGame = "CREATE_NEW_GAME";
const String gameCreated = "TABLE_NEW_GAME";
const String playerJoin = "TABLE_PLAYER_JOIN";
const String startGame = "START_GAME";
const String playerPlayedCard = "NEW_PLAYER_PLAYED_CARD";
const String flipCard = "FLIP_CARD_ORDER";
const String newAction = "NEW_RESULT_ACTION";
const String endGame = "END_GAME_RESULTS";
const String nextRound = "NEW_ROUND";

enum SocketTopics {
  createNewGame,
  playerJoin,
  startGame,
  playerPlayedCard,
  flipCard,
  newAction,
  endGame,
  nextRound,
}

SocketTopics socketTopicsFromString(String socketTopic) {
  switch (socketTopic) {
    case createNewGame:
      return SocketTopics.createNewGame;
    case playerJoin:
      return SocketTopics.playerJoin;
    case startGame:
      return SocketTopics.startGame;
    case playerPlayedCard:
      return SocketTopics.playerPlayedCard;
    case flipCard:
      return SocketTopics.flipCard;
    case newAction:
      return SocketTopics.newAction;
    case endGame:
      return SocketTopics.endGame;
    case nextRound:
      return SocketTopics.nextRound;
    default:
      throw Exception("Unknown socket topic: $socketTopic");
  }
}

String socketTopicsToString(SocketTopics socketTopic) {
  switch (socketTopic) {
    case SocketTopics.createNewGame:
      return createNewGame;
    case SocketTopics.playerJoin:
      return playerJoin;
    case SocketTopics.startGame:
      return startGame;
    case SocketTopics.playerPlayedCard:
      return playerPlayedCard;
    case SocketTopics.flipCard:
      return flipCard;
    case SocketTopics.newAction:
      return newAction;
    case SocketTopics.endGame:
      return endGame;
    case SocketTopics.nextRound:
      return nextRound;
    default:
      throw Exception("Unknown socket topic: $socketTopic");
  }
}
