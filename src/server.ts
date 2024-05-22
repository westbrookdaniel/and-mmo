import "dotenv/config";
import express from "express";
import path from "path";
import http from "http";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import * as p2 from "p2-es";
import morgan from "morgan";
import compression from "compression";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { PORT = 4000, NODE_ENV } = process.env;
const isDev = NODE_ENV !== "production";

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

const world = new p2.World({ gravity: [0, 0] });

interface Data {
  id: string;
  color: string;
  width: number;
  height: number;
}

const dataMap: Record<number, Data> = {};
const updates: Record<string, (d: number) => void> = {};

function create(data: Data, opts: p2.BodyOptions) {
  const body = new p2.Body(opts);
  const shape = new p2.Box({ width: data.width, height: data.height });
  body.addShape(shape);
  dataMap[body.id] = data;
  world.addBody(body);

  function destroy() {
    world.removeBody(body);
    delete dataMap[body.id];
  }

  return { destroy, body };
}

let then = performance.now();
const step = 1 / 60;
function tick() {
  const now = performance.now();
  const elapsed = now - then;

  Object.values(updates).forEach((u) => u(elapsed));

  world.step(step, elapsed, 10);

  then = now;

  const data = world.bodies.map((b) => [
    b.id,
    dataMap[b.id],
    b.position[0],
    b.position[1],
    b.angle,
  ]);
  io.emit("tick", data);
  setTimeout(() => tick(), step * 1000);
}
tick();

function stringToColour(str: string) {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
}

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  const { destroy, body } = create(
    {
      id: socket.id,
      height: 4,
      width: 4,
      color: stringToColour(socket.id),
    },
    {
      position: [20, 30],
      mass: 1,
      damping: 0.7,
      fixedRotation: false,
    },
  );

  let inputMap: any = {};
  socket.on("input", (map) => {
    inputMap = map;
  });

  updates[socket.id] = () => {
    const v = [0, 0];
    if (inputMap.left) v[0] -= 1;
    if (inputMap.right) v[0] += 1;
    if (inputMap.up) v[1] -= 1;
    if (inputMap.down) v[1] += 1;
    p2.vec2.multiply(v, v, [0.5, 0.5]);
    body.applyImpulse(v);
  };

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
    destroy();
    delete updates[socket.id];
  });
});

if (!isDev) {
  app.use(express.static("dist/app"));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
