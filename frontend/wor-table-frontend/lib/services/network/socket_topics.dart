const String newPlayerTopic = "table_new_player";
const String initialiseGameTopic = "table_cards_initialization";
const String gameInitialisationTopic = "player_initialization";

enum SocketTopics {newPlayerTopic,
  initiateGameTopic,gameInitialisationTopic
}

SocketTopics socketTopicsFromString(String socketTopic) {
  switch (socketTopic) {
    case newPlayerTopic:
      return SocketTopics.newPlayerTopic;
    case initialiseGameTopic:
      return SocketTopics.initiateGameTopic;
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
    default:
      throw Exception("Unknown topic: $socketTopic");
  }
}
