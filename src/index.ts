import { pipe } from "@effect-ts/system/Function";
import { has } from "@effect-ts/system/Has";
import * as DSL from "@effect-ts/core/Prelude/DSL";
import * as path from "path";
import * as X from "@effect-ts/core/XPure";
import * as T from "@effect-ts/core/Effect";
import * as Exit from "@effect-ts/system/Exit";
import * as colors from "colors";
import { format } from "date-fns";
import {
  ConsoleModule,
  debug,
  error,
  log,
  logLevel,
  logService,
} from "./logger";
import { matchTag } from "@effect-ts/core/Utils";
import { flow } from "@effect-ts/core/Function";
import { readConfig } from "./readConfig";
import { weatherAction } from "./actions/weather/weather.action";

export const program = pipe(
  T.provide({
    env: "development",
    configPath: path.join(__dirname, "..", "environments"),
  })(readConfig),
  T.chain((config) => T.provideAll(config)(weatherAction)),
  T.andThen(error("error 1")),
  T.andThen(log("log 1")),
  T.andThen(debug("debug 1"))
);

const cancel = pipe(
  program,
  T.provideService(ConsoleModule)({
    ...logService,
    logLevel: "error",
    timeFormat: "dd.MM.yyyy HH:mm:ss",
    useColors: true,
  }),
  T.runMain
);

process.on("SIGTERM", cancel);
process.on("SIGINT", cancel);
