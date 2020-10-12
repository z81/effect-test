import { flow, pipe } from "@effect-ts/core/Function";
import * as Effect from "@effect-ts/core/Effect";
import * as Exit from "@effect-ts/core/Effect/Exit";
import * as path from "path";
import { weatherAction } from "./actions/weather/weather.action";
import { readConfig } from "./readConfig";
import { ConfigRaw } from "./models/config";
import "./logger";

const main = pipe(
  readConfig,
  Effect.chain((config) => Effect.provideAll(config)(weatherAction))
);

const withEnv = Effect.provide({
  env: "development",
  configPath: path.join(__dirname, "..", "environments"),
});

// const logger = ({ logLevel }: Pick<ConfigRaw, "logLevel">) => <T>(message: T) =>
//   Effect.effectTotal(() => {
//     console.log(`${message} ${logLevel}`);
//   });

const cancel = Effect.runCancel(withEnv(main), Exit.mapError(console.error));

process.on("SIGTERM", () => Effect.run(cancel));
process.on("SIGINT", () => Effect.run(cancel));
