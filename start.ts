import express, { Request, Response } from "express";
import path from "path";
import { createApp } from "./server";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  const app = await createApp();

  // Production: serve the built SPA (standalone Node hosting, e.g. `npm start`).
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CSB Platform backend running on http://0.0.0.0:${PORT}`);
  });
}

start();
