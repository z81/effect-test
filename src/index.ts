import { pipe } from "@effect-ts/system/Function";
import * as path from "path";
import * as T from "@effect-ts/core/Effect";
import { ConsoleModule, logService } from "./logger/logger";
import { readConfig } from "./readConfig";
import { exec, WeatherActionModule } from "./actions/weather/weather.module";
import { weatherActionService } from "./actions/weather/weather.action";

export const program = pipe(
  T.provide({
    env: "development",
    configPath: path.join(__dirname, "..", "environments"),
  })(readConfig),
  T.chain((config) =>
    pipe(
      exec("Moscow"),
      T.provideService(WeatherActionModule)({
        ...weatherActionService,
        ...config,
      })
    )
  )
);

const cancel = pipe(
  program,
  T.provideService(ConsoleModule)({
    ...logService,
    logLevel: "info",
    timeFormat: "dd.MM.yyyy HH:mm:ss",
    useColors: true,
  }),
  T.runMain
);

process.on("SIGTERM", cancel);
process.on("SIGINT", cancel);
