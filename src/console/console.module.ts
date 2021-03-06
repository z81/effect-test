import * as T from "@effect-ts/core/Effect";
import * as H from "@effect-ts/core/Has";

export enum LogLevels {
  "log" = "log",
  "info" = "info",
  "error" = "error",
  "warn" = "warn",
  "debug" = "debug",
}

export type LogLevelTypes = keyof typeof LogLevels;

export const logLevels = Object.keys(LogLevels) as LogLevelTypes[];

export type ConsoleLogFunctions = {
  [k in LogLevelTypes]: (message: string) => T.UIO<void>;
};

export type ConsoleModule = ConsoleLogFunctions & {
  logLevel: LogLevelTypes;
  timeFormat: string;
  useColors: boolean;
};

export const ConsoleModule = H.tag<ConsoleModule>();

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
