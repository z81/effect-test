import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { openWeatherToken, WeatherActionModule } from "./weather.module";
import { info } from "../../console/console";
import { weatherSearch } from "./weather.api";

export const weatherActionService: WeatherActionModule = {
  openWeatherToken: "",
  exec: (city: string) =>
    pipe(
      T.struct({
        openWeatherToken: T.accessM(() => openWeatherToken),
      }),
      T.chain(({ openWeatherToken }) => weatherSearch(city, openWeatherToken)),
      T.chain(([data]) => T.fromEither(() => data)),
      T.chain((c) => {
        const temp = Math.ceil(c.main.temp);
        return info(`Today in ${c.name} ${c.weather[0].description} ${temp}°C`);
      })
    ),
};
