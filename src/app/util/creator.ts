type Data<T> = {
  data: T;
  destroy: () => void;
};

type PID = string | number;

export class Creator<Args extends any[], T> {
  creating: string[] = [];
  dataMap: Partial<Record<string, Data<T>>> = {};

  get created() {
    return [...Object.keys(this.dataMap), ...this.creating];
  }

  constructor(
    private handleCreate: (id: string, ...args: Args) => Promise<Data<T>>,
  ) {}

  create(pid: PID, ...args: Args) {
    const id = pid.toString();
    if (this.created.includes(id)) return;
    this.creating.push(id);
    this.handleCreate(id, ...args).then((d) => {
      this.dataMap[id] = d;
      this.creating = this.creating.filter((c) => c !== id);
    });
  }

  remove(pid: PID) {
    const id = pid.toString();
    this.creating = this.creating.filter((d) => d !== id);
    const d = this.dataMap[id];
    if (!d) return;
    d.destroy();
    delete this.dataMap[id];
  }

  get(pid: PID) {
    const id = pid.toString();
    const d = this.dataMap[id];
    return d ? d.data : null;
  }
}
