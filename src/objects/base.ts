import * as PIXI from "pixi.js";
import * as p2 from "p2-es";

export abstract class BaseObject {
  abstract body: p2.Body;
  abstract args(): any;
}

export abstract class BaseComponent {
  get name() {
    return this.constructor.name;
  }
}

export abstract class BaseRender {
  abstract container: PIXI.Container;
  abstract components: BaseComponent[];

  static async load(): Promise<void> {} // To be overriden

  component<T extends abstract new (...args: any) => any>(component: T) {
    const c = this.components.find((c) => c.name === component.name);
    if (!c) throw new Error(`Unable to find component ${component.name}`);
    return c as InstanceType<T> | undefined;
  }
}
