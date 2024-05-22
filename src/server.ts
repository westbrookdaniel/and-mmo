import "dotenv/config";
import express from "express";
import path from "path";
import http from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import morgan from "morgan";
import compression from "compression";
import { createWorld } from "./world";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PORT = 4000, NODE_ENV } = process.env;
const isDev = NODE_ENV === "dev";

const app = express();
const server = http.createServer(app);
app.use(compression());
app.use(morgan("dev"));

const io = new Server(server, {
  cors: isDev ? { origin: "http://localhost:5173" } : undefined,
});

app.get("/api/ping", async (_req, res) => {
  res.status(200).json({ message: "pong" });
});

createWorld(io);

if (!isDev) {
  app.use(express.static("dist/app"));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
