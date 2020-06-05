import xs, { Stream } from "xstream";
import { rect } from "cycle-canvas";
import { Sources, Sinks } from "./drivers";
import { AppState, MousePosition, PositionsDictionary } from "./interfaces";

const defaultState: AppState = { clientId: "", positions: {} };

export default function main({ DOM, socket, state }: Sources): Sinks {
  const selfPosition$: Stream<MousePosition> = DOM.select("document")
    .events("mousemove")
    .map((event) => {
      return { x: event.pageX, y: event.pageY };
    });

  const otherPositions$: Stream<PositionsDictionary> = socket
    .filter(({ type }) => type === "clients-update")
    .map((message) => message.data as PositionsDictionary);

  const initState$ = xs.of(() => defaultState);
  const updatePositions$ = xs
    .combine(selfPosition$, otherPositions$)
    .map(([selfPosition, otherPositions]) => {
      const allPositions = {
        ...otherPositions,
        self: selfPosition,
      };
      return (state: AppState): AppState => ({
        ...state,
        positions: allPositions,
      });
    });

  const updateClientId$ = socket
    .filter(({ type }) => type === "client-id")
    .map(({ data }) => data as string)
    .map((clientId) => (state: AppState): AppState => ({ ...state, clientId }));

  return {
    canvas: state.stream.map((state) => state.positions).map(renderPositions),
    socket: selfPosition$.map((positions) => JSON.stringify(positions)),
    state: xs.merge(initState$, updatePositions$, updateClientId$),
  };
}

function renderPositions(positions: PositionsDictionary) {
  const canvasInstructions = Object.entries(positions).map(
    ([clientId, position]) => {
      return rect({
        x: position.x,
        y: position.y,
        width: 10,
        height: 10,
        draw: [{ fill: "black" }],
      });
    }
  );
  return rect({}, canvasInstructions);
}
