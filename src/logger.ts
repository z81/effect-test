import { NonEmptyArray } from "@effect-ts/core/Classic/NonEmptyArray";
import * as C from "fp-ts/lib/Console";
import * as D from "fp-ts/lib/Date";
import { chain, IO } from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/pipeable";
import * as L from "logging-ts/lib/IO";

export enum LogLevel {
  Info,
  Warning,
  Error,
  Debug,
}

export type LogLevelUnion = keyof typeof LogLevel;

interface Entry {
  message: string;
  time: Date;
  level: LogLevel;
}

const showEntry = ({ level, time, message }: Entry) =>
  `[${level}] ${time.toLocaleString()} ${message}`;

const debugLogger = L.filter(
  (entry: Entry) => C.log(showEntry(entry)),
  (e) => e.level >= LogLevel.Debug
);

const errorLogger = L.filter(
  (entry: Entry) => C.error(showEntry(entry)),
  (e) => e.level >= LogLevel.Error
);

const infoLogger = L.filter(
  (entry: Entry) => C.info(showEntry(entry)),
  (e) => e.level >= LogLevel.Info
);

const warnLogger = L.filter(
  (entry: Entry) => C.warn(showEntry(entry)),
  (e) => e.level >= LogLevel.Warning
);

const logger = L.getMonoid<Entry>().concat(
  debugLogger,
  errorLogger
  // infoLogger,
  // warnLogger
);

const info = (message: string) => (time: Date): IO<void> =>
  infoLogger({ message, time, level: LogLevel.Info });

const debug = (message: string) => (time: Date): IO<void> =>
  debugLogger({ message, time, level: LogLevel.Debug });

const program = pipe(
  D.create,
  chain(info("boot")),
  chain(() => D.create),
  chain(debug("Hello!"))
);

program();

export const LogLevels = Object.entries(LogLevel)
  .filter(([, value]) => typeof value === "number")
  .map(([key]) => key) as LogLevelUnion[];
