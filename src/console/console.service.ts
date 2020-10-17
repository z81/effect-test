import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/system/Function";
import * as colors from "colors";
import { format } from "date-fns";

import type { ConsoleModule, LogLevelTypes } from "./console.module";
import { logLevel, logLevels, timeFormat, useColors } from "./console.module";

const consoleColors: { [k in LogLevelTypes]: (msg: string) => string } = {
  log: colors.white,
  info: colors.blue,
  error: colors.red,
  warn: colors.yellow,
  debug: colors.gray,
};

const consoleWriter = (message: string, type: LogLevelTypes) =>
  T.effectTotal(() => console[type](message));

const makeLogger = (type: LogLevelTypes) => (message: string) =>
  pipe(
    T.struct({
      logLevel: T.accessM(() => logLevel),
      timeFormat: T.accessM(() => timeFormat),
      useColors: T.accessM(() => useColors),
    }),
    T.chain(({ logLevel, timeFormat, useColors }) => {
      if (logLevels.indexOf(type) < logLevels.indexOf(logLevel)) {
        return T.effectTotal(() => {});
      }

      const text = `${format(new Date(), timeFormat)}: ${message}`;
      const coloredText = useColors ? consoleColors[type](text) : text;
      return consoleWriter(coloredText, type);
    })
  );

const logServiceDefaults = {
  logLevel: "error",
  timeFormat: "dd.MM.yyyy HH:mm:ss",
  useColors: true,
};

export const logService = {
  ...Object.fromEntries(logLevels.map((type) => [type, makeLogger(type)])),
  ...logServiceDefaults,
} as ConsoleModule;
