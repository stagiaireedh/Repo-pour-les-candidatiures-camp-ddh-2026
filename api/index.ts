import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server";

// A single Express app instance is reused across warm invocations of this
// serverless function. The in-memory database lives in `server.ts`.
let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  // An Express application is itself a `(req, res)` request handler.
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
