export interface KeymapEntry {
  alias: string;
  keys: string[];
}

const map = {};

export class KeyManager {
  private entries: KeymapEntry[] = [];
  mouse = { x: 0, y: 0 };
  map: Record<string, boolean> = new Proxy(map, {
    set(target, alias, pressed) {
      const success = Reflect.set(target, alias, pressed);
      socket.emit("input", map, alias, pressed);
      return success;
    },
  });

  private onKey(key: string, pressed: boolean) {
    this.entries.forEach((entry) => {
      if (entry.keys.includes(key)) {
        if (this.map[entry.alias] === pressed) return;
        this.map[entry.alias] = pressed;
      }
    });
  }

  set(entries: KeymapEntry[]) {
    if (this.entries.length === 0) {
      document.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      document.addEventListener("keydown", (e) => this.onKey(e.key, true));
      document.addEventListener("keyup", (e) => this.onKey(e.key, false));
    }
    this.entries.push(...entries);
  }
}
