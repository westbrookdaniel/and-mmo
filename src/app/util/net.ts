import { Objects, Renders } from "../../objects";
import * as p2 from "p2-es";
import { physicsCreator } from "../onPhysicsTick";

export function emitForData(ev: string, data: any): any {
  return new Promise((res) => {
    socket.emit(ev, data, (d: any) => res(d));
  });
}

export async function getObjectForBody(bodyId: string) {
  const data = await emitForData("getObject", bodyId);
  const O = Objects.find((o) => o.name === data.name);
  if (!data || !O) throw new Error("Something went wrong");
  const obj = new O(data.args);
  obj.body.id = parseInt(bodyId);
  return obj;
}

export function getRenderForBody(bodyId: string) {
  const obj = physicsCreator.get(bodyId);
  if (!obj) throw new Error("Something went wrong");
  const R = Renders.find(
    (o) =>
      o.name.replace("Render", "") ===
      obj.constructor.name.replace("Object", ""),
  );
  if (!R) throw new Error("Something went wrong");
  return new R(obj);
}

export function applyBodyDiff(body: p2.Body, bodyDiff: any) {
  Object.entries(bodyDiff).forEach(([key, val]) => {
    (body as any)[key] = val;
  });
}
