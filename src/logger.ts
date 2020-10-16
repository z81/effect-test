import { pipe } from "@effect-ts/system/Function";
import { has } from "@effect-ts/system/Has";
import * as T from "@effect-ts/core/Effect";
import * as colors from "colors";
import { format } from "date-fns";

enum LogLevels {
  "log" = "log",
  "info" = "info",
  "error" = "error",
  "warn" = "warn",
  "debug" = "debug",
}

export type LogLevelTypes = keyof typeof LogLevels;

export const logLevels = Object.keys(LogLevels) as LogLevelTypes[];

const consoleColors: { [k in LogLevelTypes]: (msg: string) => string } = {
  log: colors.white,
  info: colors.blue,
  error: colors.red,
  warn: colors.yellow,
  debug: colors.gray,
};

type ConsoleLogFunctions = {
  [k in LogLevelTypes]: (message: string) => T.UIO<void>;
};
export type ConsoleModule = ConsoleLogFunctions & {
  logLevel: LogLevelTypes;
  timeFormat: string;
  useColors: boolean;
};

export const ConsoleModule = has<ConsoleModule>();

export const {
  log,
  error,
  debug,
  info,
  logLevel,
  timeFormat,
  useColors,
} = T.deriveLifted(ConsoleModule)(
  logLevels,
  [],
  ["logLevel", "timeFormat", "useColors"]
);

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

export const logService = {
  ...Object.fromEntries(logLevels.map((type) => [type, makeLogger(type)])),
} as ConsoleLogFunctions;
