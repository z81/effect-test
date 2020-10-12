import * as Effect from "@effect-ts/core/Effect";
import { flow, pipe } from "@effect-ts/core/Function";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as Either from "@effect-ts/core/Classic/Either";
import * as D from "io-ts/Decoder";
import { Config, ConfigRaw } from "./models/config";

export const readConfig = pipe(
  Effect.environment<{ env: string; configPath: string }>(),
  Effect.chain(({ env, configPath }) =>
    readFile(path.join(configPath, `${env}.json`))
  ),
  Effect.map(flow(JSON.parse, Config.decode, Either.mapLeft(D.draw))),
  Effect.absolve,
  Effect.map((config) => config as ConfigRaw) // type union bug
);

export const readFile = (fileName: string) =>
  Effect.fromPromise(() => promisify(fs.readFile)(fileName, "utf8"));
