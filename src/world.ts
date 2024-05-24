import * as p2 from "p2-es";
import { ServerReservedEventsMap } from "socket.io/dist/namespace";
import type {
  DefaultEventsMap,
  RemoveAcknowledgements,
  StrictEventEmitter,
} from "socket.io/dist/typed-events";
import { Entities } from "./entities.js";
import { stringToColour } from "./util.js";

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

const defaultBodyOptions: Partial<p2.BodyOptions> = {
  mass: 1,
  damping: 0.7,
  fixedRotation: false,
};

export function createWorld(io: IO) {
  const world = new p2.World({ gravity: [0, 0] });
  const entities = new Entities(world);

  let then = performance.now();
  const step = 1 / 60;
  function tick() {
    const now = performance.now();
    const delta = now - then;
    entities.update(delta);
    world.step(step, delta, 10);
    then = now;
    setTimeout(() => tick(), step * 1000);
  }
  tick();

  function emiter() {
    const data = world.bodies.map((b) => [
      b.id,
      [b.position[0], b.position[1]],
      b.angle,
      [b.velocity[0], b.velocity[1]],
      b.angularVelocity,
    ]);
    io.emit("tick", data);
    setTimeout(() => emiter(), (1 / 30) * 1000);
  }
  emiter();

  io.on("connection", (socket) => {
    const { destroy, body } = entities.createBody(
      {
        id: socket.id,
        height: 4,
        width: 4,
        color: stringToColour(socket.id),
        bodyOptions: defaultBodyOptions,
      },
      [20, 30],
      0,
      [0, 0],
      0,
    );

    // TODO move this to interacting with the player class (see entities TODO)

    let inputMap: any = {};
    socket.on("input", (map) => {
      inputMap = map;
    });

    socket.on("data", (bodyId, res) => {
      res(entities.getData(bodyId));
    });

    entities.updaters[socket.id] = () => {
      const v = [0, 0];
      if (inputMap.left) v[0] -= 1;
      if (inputMap.right) v[0] += 1;
      if (inputMap.up) v[1] -= 1;
      if (inputMap.down) v[1] += 1;
      p2.vec2.normalize(v, v);
      p2.vec2.multiply(v, v, [0.3, 0.3]);
      body.applyImpulse(v);
    };

    socket.on("disconnect", () => {
      destroy();
      delete entities.updaters[socket.id];
    });
  });
}
