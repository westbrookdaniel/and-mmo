import * as p2 from "p2-es";
import { ServerReservedEventsMap } from "socket.io/dist/namespace";
import type {
  DefaultEventsMap,
  RemoveAcknowledgements,
  StrictEventEmitter,
} from "socket.io/dist/typed-events";

type IO = StrictEventEmitter<
  DefaultEventsMap,
  RemoveAcknowledgements<DefaultEventsMap>,
  ServerReservedEventsMap<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >
>;

export interface Data {
  id: string;
  color: string;
  width: number;
  height: number;
}

export function createWorld(io: IO) {
  const dataMap: Record<number, Data> = {};
  const updaters: Record<string, (d: number) => void> = {};

  const world = new p2.World({ gravity: [0, 0] });

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

    Object.values(updaters).forEach((u) => u(elapsed));

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

  io.on("connection", (socket) => {
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

    updaters[socket.id] = () => {
      const v = [0, 0];
      if (inputMap.left) v[0] -= 1;
      if (inputMap.right) v[0] += 1;
      if (inputMap.up) v[1] -= 1;
      if (inputMap.down) v[1] += 1;
      p2.vec2.multiply(v, v, [0.5, 0.5]);
      body.applyImpulse(v);
    };

    socket.on("disconnect", () => {
      destroy();
      delete updaters[socket.id];
    });
  });
}

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
