import * as T from "@effect-ts/core/Effect";
import { ConsoleModule } from "../../logger/logger";
import { Has, has } from "@effect-ts/core/Classic/Has";

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
