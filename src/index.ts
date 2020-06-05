import { run } from "@cycle/run";
import main from "./app";
import { drivers } from "./drivers";
import {withState} from "@cycle/state";

run(withState(main), drivers);
