import { run } from "@cycle/run";
import main from "./app";
import { drivers } from "./drivers";

run(main, drivers);
