import { makeDOMDriver } from "@cycle/dom";
import xs, { Stream } from "xstream";
import { Reducer, StateSource } from "@cycle/state";
import {makeCanvasDriver} from "cycle-canvas";
import { WsMessage, AppState } from "./interfaces";

function makeWebsocketDriver(host: string) {
  const connection = new WebSocket(host);

  return (send$: Stream<string>) => {
    send$.addListener({
      next: (content: string) => {
        connection.send(content);
      },
    });

    return xs.create<WsMessage>({
      start: (listener) => {
        connection.onmessage = (event) => {
          const message: WsMessage = JSON.parse(event.data);
          listener.next(message);
        };
      },
      stop: () => {},
    });
  };
}

export const drivers = {
  DOM: makeDOMDriver("#app"),
  socket: makeWebsocketDriver("ws://localhost:8080"),
  canvas: makeCanvasDriver("#drawing-area")
};

export type Sinks = {
  [k in keyof typeof drivers]?: Parameters<typeof drivers[k]>[0];
} & { state: Stream<Reducer<AppState>> };
export type Sources = {
  [k in keyof typeof drivers]: ReturnType<typeof drivers[k]>;
} & { state: StateSource<AppState> };

export default drivers;
