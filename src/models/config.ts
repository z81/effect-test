import * as D from "io-ts/Decoder";
import { LogLevel, LogLevels } from "../logger";

export const Config = D.type({
  logging: D.boolean,
  logLevel: D.union(...(LogLevels.map((level) => D.literal(level)) as any)),
  openWeatherToken: D.string,
});

export type ConfigRaw<T = typeof Config> = T extends D.Decoder<unknown, infer Z>
  ? Z & { logLevel: LogLevel }
  : never;
