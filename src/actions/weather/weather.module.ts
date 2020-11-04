import * as T from "@effect-ts/core/Effect";
import * as H from "@effect-ts/core/Has";

import type { ConsoleModule } from "../../console/console";

export type WeatherActionModule = {
  openWeatherToken: string;
  exec: (
    city: string
  ) => T.Effect<
    H.Has<WeatherActionModule> & H.Has<ConsoleModule>,
    unknown,
    void
  >;
};

export const WeatherActionModule = H.tag<WeatherActionModule>();

export const { exec, openWeatherToken } = T.deriveLifted(WeatherActionModule)(
  ["exec"],
  [],
  ["openWeatherToken"]
);
