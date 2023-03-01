# Checking if the territoriality oriented rules are applied instinctivelly in a distributed interface conception
## Introduction
This project have for goal to validate if the territorial oriented conception rules for distributed interfaces are applied instinctivelly, we developped many version of the project, one without even knowing the rules and another one with the rules to check which one is applied naturally.<br>
The project is composed of two parts : a backend and 2 frontends. The backend is composed of a game server and a database. One frontend is running the table game and the other one is running the phone game. The two frontends are communicating with the game server to get the game state and to send the player actions using websockets.<br>
The server is developed in [NestJS](https://nestjs.com/) and the frontends are developed in [Flutter](https://flutter.dev/) and [Angular](https://angular.io/). The database is a [MongoDB](https://www.mongodb.com).<br>

## Adapting for your production environment

1. Change the hostname in the config file of the different frontend service :
    1. for the flutter app : in the ``lib/constant.dart``, 
        - ``HOSTNAME``: Hostname of the game server
        - ``PROD``: Variable to set the frontend in production mode
        - ``VERSIONS_HOSTNAMES``: Can contain the hostname of each available version of the phone frontend
        - ``SUPPORTED_VERSION``: Contain the supported version of the app
        - ``VERSION``: The default version to use for the phone frontend
    2. for the web app : in the ``src/config.js``,
        - ``HOSTNAME``: Hostname of the game server
        - ``PROD``: Variable to set the frontend in production mode

<u>Remarque :</u> In order to select a specific version of the phone frontend, you can add the ``v1`` parameter in the url. For example, if you want to use the version 1 of the phone frontend, you can use the url ``http://localhost:8080/v1`` it will use the hostname with the index 0 in the ``VERSIONS_HOSTNAMES`` variable, the version 2 the index 1, etc.
The version number must be an integer and be registered in the set ``SUPPORTED_VERSION``.

## Get started

### Production mode

``./prod-launcher.sh`` (after you choose what you want to do)

### Development mode
1. Run the backend : ``./dev-launcher.sh`` (after you choose what you want to do)
2. Run the frontends in dev-mod:
    1. For the flutter app (need the flutter sdk), in the flutter app directory : ``flutter pub get`` then ``flutter run``
    2. For the web app, in the angular app directory : ``npm install`` then ``ng serve``

When the table frontend is launched, a new game is automatically created.
