import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "./server";

// Source du handler serverless. Le fichier déployé est `api/index.js`,
// un bundle CJS généré par `npm run build:api` (esbuild).
// Vercel déploie `api/index.js` tel quel, sans transpilation TS.

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
