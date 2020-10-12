import * as io from "io-ts";

export const Weather = io.type({
  weather: io.array(
    io.type({
      main: io.string,
      description: io.string,
      icon: io.string,
    })
  ),
  visibility: io.number,
  wind: io.type({
    speed: io.number,
    deg: io.number,
  }),
  clouds: io.type({
    all: io.number,
  }),
  sys: io.type({
    id: io.number,
    sunrise: io.number,
    sunset: io.number,
  }),
  main: io.type({
    temp: io.number,
    humidity: io.number,
    pressure: io.number,
  }),
  name: io.string,
});

export type WeatherRaw = typeof Weather["_A"];
