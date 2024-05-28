export abstract class BaseComponent {
  get name() {
    return this.constructor.name;
  }
}

export abstract class BaseEntity {
  abstract components: BaseComponent[];

  static async load(): Promise<void> {} // To be overriden

  component<T extends abstract new (...args: any) => any>(component: T) {
    const c = this.components.find((c) => c.name === component.name);
    if (!c) throw new Error(`Unable to find component ${component.name}`);
    return c as InstanceType<T> | undefined;
  }

  constructor(public id: string) {
    // TODO move this into a client only interaction component
    // console.log(obj.body.id);
    // socket.on("FOO", (componentName) => {
    //   const c = this.components.find((c) => c.name === componentName);
    //   if (!c) throw new Error(`Unable to find component ${componentName}`);
    //   // TODO how does the server interact with components?
    //   // could I use something like https://github.com/GoogleChromeLabs/comlink
    // });
  }

  update() {}
}
