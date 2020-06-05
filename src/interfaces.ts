export interface MousePosition {
  x: number;
  y: number;
}
export interface PositionsDictionary {
  [clientid: string]: MousePosition;
}
export interface AppState {
  clientId: string;
  positions: PositionsDictionary;
}
export interface WsMessage {
  type: string;
  data: unknown;
}
