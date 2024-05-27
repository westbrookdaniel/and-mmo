import * as PIXI from "pixi.js";
import * as p2 from "p2-es";

export abstract class BaseObject {
  abstract body: p2.Body;
  abstract id: string;
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

  constructor(obj: BaseObject) {
    console.log(obj.body.id);
    socket.on("FOO", (componentName) => {
      const c = this.components.find((c) => c.name === componentName);
      if (!c) throw new Error(`Unable to find component ${componentName}`);
      // TODO how does the server interact with components?
      // could I use something like https://github.com/GoogleChromeLabs/comlink
    });
  }
}
