

export enum ConnexionStatusEnum {
  USER_IS_LOGGED = "USER_IS_LOGGED",
  ANY_GAME_FOUND = "ANY_GAME_FOUND",
  USER_ID_DOES_NOT_EXIST = "USER_ID_DOES_NOT_EXIST"
}

export interface ConnexionStatusMessage {
  status: ConnexionStatusEnum;
  message: string;
}
