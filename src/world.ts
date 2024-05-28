import * as p2 from "p2-es";
import { ServerReservedEventsMap } from "socket.io/dist/namespace";
import type {
  DefaultEventsMap,
  RemoveAcknowledgements,
  StrictEventEmitter,
} from "socket.io/dist/typed-events";
import { Body } from "./components/body";
import { BodyDiff, Entities } from "./entities";
import { Player } from "./objects/player";

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
        // TODO experiment sending the inputs to cause physics sim instead of sending the sim
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

  // Player controller
  io.on("connection", (socket) => {
    const player = new Player(socket.id);

    const destroy = entities.addObject(player, {
      position: [20, 30],
    });

    let inputMap: any = {};
    socket.on("input", (map, alias, pressed) => {
      inputMap = map;

      if (alias === "action" && pressed) {
        console.log(alias, pressed);
        // TODO sprite changing on player
        // TODO swing a lil thing out in front? OR apply impulse?
      }
    });

    socket.on("getObject", (bodyId, res) => {
      const object = entities.getObject(bodyId);
      res({ name: object?.constructor.name, id: object?.id });
    });

    entities.add(socket.id, () => {
      const v = [0, 0];
      if (inputMap.left) v[0] -= 1;
      if (inputMap.right) v[0] += 1;
      if (inputMap.up) v[1] -= 1;
      if (inputMap.down) v[1] += 1;
      p2.vec2.normalize(v, v);
      p2.vec2.multiply(v, v, [0.3, 0.3]);
      player.component(Body)!.body.applyImpulse(v);
    });

    socket.on("disconnect", () => {
      destroy();
      entities.remove(socket.id);
    });
  });
}
