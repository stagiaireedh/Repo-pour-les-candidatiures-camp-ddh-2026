import { createApp } from "./server";

const PORT = Number(process.env.PORT) || 3000;

async function startDev() {
  const app = await createApp();

  // Vite dev middleware (HMR + SPA serving) — dev only.
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CSB Platform (dev) running on http://0.0.0.0:${PORT}`);
  });
}

startDev();
