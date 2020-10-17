import type { Has } from "@effect-ts/core/Classic/Has";
import { has } from "@effect-ts/core/Classic/Has";
import * as T from "@effect-ts/core/Effect";

import type { ConsoleModule } from "../../console/console";

export type WeatherActionModule = {
  openWeatherToken: string;
  exec: (
    city: string
  ) => T.Effect<Has<WeatherActionModule> & Has<ConsoleModule>, unknown, void>;
};

export const WeatherActionModule = has<WeatherActionModule>();

export const { exec, openWeatherToken } = T.deriveLifted(WeatherActionModule)(
  ["exec"],
  [],
  ["openWeatherToken"]
);
