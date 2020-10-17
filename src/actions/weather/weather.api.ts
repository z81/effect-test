import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import * as querystring from "querystring";
import { Fetcher } from "fetcher-ts";
import * as E from "@effect-ts/core/Classic/Either";
import { Weather, WeatherRaw } from "../../models/weather";

export const OPEN_WEATHER_ENDPOINT =
  "http://api.openweathermap.org/data/2.5/weather";

export const weatherSearch = (city: string, openWeatherToken: string) => {
  const params = querystring.stringify({
    units: "metric",
    lang: "ru",
    q: city,
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
};

export type WeatherResponses =
  | {
      code: 200;
      payload: WeatherRaw;
    }
  | { code: 404 | 500; payload: Error };
