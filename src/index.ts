import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/system/Function";
import * as O from "@effect-ts/system/Option";
import * as S from "@effect-ts/system/Stream";
import * as I from "@effect-ts/system/Stream/Sink";
import * as Discord from "discord.js";
import * as path from "path";

import { weatherActionService } from "./actions/weather/weather";
import { exec, WeatherActionModule } from "./actions/weather/weather.module";
import { ConsoleModule, logService } from "./console/console";
import { steamFromEvent } from "./discord/steamFromEvent";
import { readConfig } from "./readConfig";

const client = new Discord.Client();

export const program = pipe(
  T.provide({
    env: "development",
    configPath: path.join(__dirname, "..", "environments"),
  })(readConfig),
  T.tap(({ discordToken }) => T.effectTotal(() => client.login(discordToken))),
  T.forkDaemon,
  T.chain((config) =>
    T.forkAll([
      pipe(
        steamFromEvent("ready", client),
        S.run(
          I.foreach((a) =>
            T.effectTotal(() => {
              console.log(`Logged in as ${client!.user!.tag!}!`);
              return exec("Moscow");
            })
          )
        ),
        T.forkDaemon,
        T.chain((a) => {
          console.log(a);
          return exec("Moscow");
        }),
        T.forkDaemon,
        T.provideService(WeatherActionModule)({
          ...weatherActionService,
          ...config,
        }),
        T.provideService(ConsoleModule)({
          ...logService,
          ...config,
        })
      ),
    ])
  )
);

// const p = pipe(
//   steamFromEvent("message", client),
//   S.run(
//     I.foreach((a) =>
//       T.effectTotal(() => {
//         console.log(a, `Logged in as ${client!.user!.tag!}!`);
//         return 1;
//       })
//     )
//   ),
//   T.runMain
// );

// ----
const cancel = pipe(
  program,
  T.provideService(ConsoleModule)(logService),
  T.runMain
);

process.on("SIGTERM", cancel);
process.on("SIGINT", cancel);
