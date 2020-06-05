import { makeDOMDriver } from "@cycle/dom";
export const drivers = {
  DOM: makeDOMDriver("#app"),
};
export type Sinks = {
  [k in keyof typeof drivers]?: Parameters<typeof drivers[k]>[0];
};
export type Sources = {
  [k in keyof typeof drivers]: ReturnType<typeof drivers[k]>;
};
export default drivers;
