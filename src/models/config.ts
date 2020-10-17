import * as D from "io-ts/Decoder";
import { logLevels, LogLevelTypes } from "../console/console";

const levels = logLevels.map((level) => D.literal(level)) as [
  D.Decoder<unknown, LogLevelTypes>
];

export const Config = D.type({
  logging: D.boolean,
  logLevel: D.union(...levels),
  openWeatherToken: D.string,
});

export type ConfigRaw<T = typeof Config> = T extends D.Decoder<unknown, infer Z>
  ? Z
  : never;
