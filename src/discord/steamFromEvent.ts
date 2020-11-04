import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import * as S from "@effect-ts/system/Stream";
import type * as Discord from "discord.js";

export function steamFromEvent(
  eventName: "ready",
  client: Discord.Client
): S.Stream<unknown, never, Discord.Client>;

export function steamFromEvent(
  eventName: "message",
  client: Discord.Client
): S.Stream<unknown, never, Discord.Message>;

export function steamFromEvent(eventName: string, client: Discord.Client) {
  return S.effectAsync<unknown, never, unknown>((next) => {
    const handler = (...args: any[]): undefined =>
      void next(T.succeed(args.length === 0 ? [client] : args), () => {
        client.off(eventName, handler);
      });

    client.on(eventName, handler);
  });
}
