import {Stream} from "xstream";
import { div } from "@cycle/dom";
import { Sources, Sinks } from "./drivers";

interface MousePosition {
  x: number;
  y: number;
}

export default function main({ DOM }: Sources): Sinks {
  const mouseMove$: Stream<MousePosition> = DOM.select("document")
    .events("mousemove")
    .map((event) => {
      return { x: event.pageX, y: event.pageY };
    });

  return {
    DOM: mouseMove$.map((counter) => div(JSON.stringify(counter))),
  };
}
