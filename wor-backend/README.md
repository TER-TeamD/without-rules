<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Interface
### ⬆️ Création du jeux
#### Event name: "TABLE_NEW_GAME"
#### Body
```ts
{}
```

### ⬆️ Player join game
#### Event name: "PLAYER_JOIN_GAME"
#### Body
```ts
{
  player_id: string;
}
```

### ⬆️ Start game
#### Event name: "TABLE_START_GAME"
#### Body
```ts
{}
```

### ⬆️ Player played card
#### Event name: "PLAYER_PLAYED_CARD"
#### Body
```ts
{
  player_id: string;
  card_value: number;
}
```

### ⬆️ All player played
#### Event name: "TABLE_ALL_PLAYER_PLAYED"
#### Body
```ts
{}
```

### ⬆️ Next round result action
#### Event name: "TABLE_NEXT_ROUND_RESULT_ACTION"
#### Body

```ts
{
  choosen_stack: number|null;
}
```

### ⬇️ Create new game (table)
#### Event name: "CREATE_NEW_GAME"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ Player logged in game (player)
#### Event name: "PLAYER_LOGGED_IN_GAME"
#### Body
```ts
{
  player: Player;
}
```

### ⬇️ Start game (table)
#### Event name: "START_GAME"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ Start game (player)
#### Event name: "START_GAME"
#### Body
```ts
{
  player: Player;
}
```

### ⬇️ Player played card (table)
#### Event name: "NEW_PLAYER_PLAYED_CARD"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ Card played (player)
#### Event name: "CARD_PLAYED"
#### Body
```ts
{
  player: Player;
}
```

### ⬇️ Flip card (table)
#### Event name: "FLIP_CARD_ORDER"
#### Body
```ts
{
  game: Game;
}
```


### ⬇️ New action (table)
#### Event name: "NEW_RESULT_ACTION"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ End game (table)
#### Event name: "END_GAME_RESULTS"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ End game (player)
#### Event name: "END_GAME_RESULTS"
#### Body
```ts
{
  player: Player;
}
```

### ⬇️ New round (table)
#### Event name: "NEW_ROUND"
#### Body
```ts
{
  game: Game;
}
```

### ⬇️ New round (player)
#### Event name: "NEW_ROUND"
#### Body
```ts
{
  player: Player;
}
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
