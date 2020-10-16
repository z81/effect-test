import * as T from "@effect-ts/core/Effect";
import { flow, pipe } from "@effect-ts/core/Function";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";
import * as Either from "@effect-ts/core/Classic/Either";
import * as D from "io-ts/Decoder";
import { Config, ConfigRaw } from "./models/config";

export const readConfig = pipe(
  T.environment<{ env: string; configPath: string }>(),
  T.chain(({ env, configPath }) =>
    readFile(path.join(configPath, `${env}.json`))
  ),
  T.map(flow(JSON.parse, Config.decode, Either.mapLeft(D.draw))),
  T.absolve,
  T.map((config) => config as ConfigRaw)
);

export const readFile = (fileName: string) =>
  T.fromPromise(() => promisify(fs.readFile)(fileName, "utf8"));
