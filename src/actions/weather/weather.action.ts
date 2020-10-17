import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import * as querystring from "querystring";
import { Fetcher } from "fetcher-ts";
import * as E from "@effect-ts/core/Classic/Either";
import { Weather, WeatherRaw } from "../../models/weather";
import { ConsoleModule, info } from "../../logger/logger";

const OPEN_WEATHER_ENDPOINT = "http://api.openweathermap.org/data/2.5/weather";

export const weatherAction = pipe(
  T.environment<{ openWeatherToken: string }>(),
  T.chain(({ openWeatherToken }) => {
    const params = querystring.stringify({
      units: "metric",
      lang: "ru",
      q: "Moscow",
      appid: openWeatherToken,
    });
    const url = `${OPEN_WEATHER_ENDPOINT}?${params}`;

    const fetcher = new Fetcher<WeatherResponses, E.Either<string, WeatherRaw>>(
      url
    );

    return pipe(
      T.fromPromise(() =>
        fetcher
          .handle(200, E.right, Weather)
          .handle(404, () => E.left("Not found"))
          .discardRest(() => E.left("Loading data error"))
          .run()
      )
    );
  }),

  T.chain(([data]) => T.fromEither(() => data)),
  T.map((c) => {
    const temp = Math.ceil(c.main.temp);
    console.log(`Today in ${c.name} ${c.weather[0].description} ${temp}°C`);
  })
);

type WeatherResponses =
  | {
      code: 200;
      payload: WeatherRaw;
    }
  | { code: 404 | 500; payload: Error };
