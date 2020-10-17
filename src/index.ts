import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/system/Function";
import * as path from "path";

import { weatherActionService } from "./actions/weather/weather";
import { exec, WeatherActionModule } from "./actions/weather/weather.module";
import { ConsoleModule, logService } from "./console/console";
import { readConfig } from "./readConfig";

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
      }),
      T.provideService(ConsoleModule)({
        ...logService,
        ...config,
      })
    )
  )
);

const cancel = pipe(
  program,
  T.provideService(ConsoleModule)(logService),
  T.runMain
);

process.on("SIGTERM", cancel);
process.on("SIGINT", cancel);
