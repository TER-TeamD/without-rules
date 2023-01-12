const String newPlayerTopic = "table_new_player";
const String initialiseGameTopic = "table_cards_initialization";
const String gameInitialisationTopic = "player_initialization";
const String cardPlayedTopic = "CARD_PLAYED_BY_USER";
const String newActionsTopic = "NEW_ACTIONS";
const String nextRoundTopic = "NEXT_ROUND";

enum SocketTopics {
  newPlayerTopic,
  initiateGameTopic,
  gameInitialisationTopic,
  cardPlayedTopic,
  newActionsTopic,
  nextRoundTopic
}

SocketTopics socketTopicsFromString(String socketTopic) {
  switch (socketTopic) {
    case newPlayerTopic:
      return SocketTopics.newPlayerTopic;
    case initialiseGameTopic:
      return SocketTopics.initiateGameTopic;
    case cardPlayedTopic:
      return SocketTopics.cardPlayedTopic;
    case newActionsTopic:
      return SocketTopics.newActionsTopic;
    case nextRoundTopic:
      return SocketTopics.nextRoundTopic;
    default:
      throw Exception("Unknown topic: $socketTopic");
  }
}

String socketTopicsToString(SocketTopics socketTopic) {
  switch (socketTopic) {
    case SocketTopics.newPlayerTopic:
      return newPlayerTopic;
    case SocketTopics.initiateGameTopic:
      return initialiseGameTopic;
    case SocketTopics.gameInitialisationTopic:
      return gameInitialisationTopic;
    case SocketTopics.cardPlayedTopic:
      return cardPlayedTopic;
    case SocketTopics.newActionsTopic:
      return newActionsTopic;
    case SocketTopics.nextRoundTopic:
      return nextRoundTopic;
    default:
      throw Exception("Unknown topic: $socketTopic");
  }
}
