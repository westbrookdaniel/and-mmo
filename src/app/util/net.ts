import { Objects } from "../../objects";
import * as p2 from "p2-es";
import { physicsCreator } from "../onPhysicsTick";
import { Body } from "../../components/body";

export function emitForData(ev: string, data: any): any {
  return new Promise((res) => {
    socket.emit(ev, data, (d: any) => res(d));
  });
}

// TODO combine getObject and getRender and creators

export async function getObjectForBody(bodyId: string) {
  const data = await emitForData("getObject", bodyId);
  const O = Objects.find((o) => o.name === data.name);
  if (!data || !O) throw new Error("Something went wrong");
  const obj = new O(data.id);
  obj.component(Body)!.body.id = parseInt(bodyId);
  return obj;
}

export function getRenderForBody(bodyId: string) {
  const obj = physicsCreator.get(bodyId);
  if (!obj) throw new Error("Something went wrong");
  return obj;
}

export function applyBodyDiff(body: p2.Body, bodyDiff: any) {
  Object.entries(bodyDiff).forEach(([key, val]) => {
    (body as any)[key] = val;
  });
}
