import * as p2 from "p2-es";
import { ServerReservedEventsMap } from "socket.io/dist/namespace";
import type {
  DefaultEventsMap,
  RemoveAcknowledgements,
  StrictEventEmitter,
} from "socket.io/dist/typed-events";
import { BodyDiff, Entities } from "./entities.js";
import { PlayerObject } from "./objects/Player.js";
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
    const data = world.bodies.map((b) => {
      const bodyDiff: BodyDiff = {
        // TODO could optimise this by calculating this diff
        // from this from what changed since last tick
        // but we'd need add an endpoint for getting the full data
        // or add to current data one
        position: Array.from(b.position),
        angle: b.angle,
        velocity: Array.from(b.velocity),
        angularVelocity: b.angularVelocity,
      };
      return [b.id, bodyDiff];
    });
    io.emit("tick", data);
    setTimeout(() => emiter(), (1 / 30) * 1000);
  }
  emiter();

  io.on("connection", (socket) => {
    const player = new PlayerObject(socket.id, stringToColour(socket.id));

    const destroy = entities.addObject(player, {
      position: [20, 30],
    });

    // TODO move this to interacting with the player class (see entities TODO)

    let inputMap: any = {};
    socket.on("input", (map) => {
      inputMap = map;
    });

    socket.on("object", (bodyId, res) => {
      const object = entities.getObject(bodyId);
      res({ name: object?.type, args: object?.args() ?? [] });
    });

    entities.updaters[socket.id] = () => {
      const v = [0, 0];
      if (inputMap.left) v[0] -= 1;
      if (inputMap.right) v[0] += 1;
      if (inputMap.up) v[1] -= 1;
      if (inputMap.down) v[1] += 1;
      p2.vec2.normalize(v, v);
      p2.vec2.multiply(v, v, [0.3, 0.3]);
      player.body.applyImpulse(v);
    };

    socket.on("disconnect", () => {
      destroy();
      delete entities.updaters[socket.id];
    });
  });
}
