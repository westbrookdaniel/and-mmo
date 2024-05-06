export interface KeymapEntry {
  alias: string;
  keys: string[];
}

export class KeyManager {
  private entries: KeymapEntry[] = [];
  mouse = { x: 0, y: 0 };
  map = new Map<string, boolean>();

  constructor() {}

  private onKey(key: string, pressed: boolean) {
    this.entries.forEach((entry) => {
      if (entry.keys.includes(key)) this.map.set(entry.alias, pressed);
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

  on(alias: string, cb: () => void) {
    const entry = this.entries.find((e) => e.alias === alias);
    if (!entry) throw new Error("Entry does not exist");
    // TODO make this a wait for keydown then doesn't happen again until after keyup
    document.addEventListener("keydown", (e) => {
      if (entry.keys.includes(e.key)) cb();
    });
  }
}

export const key = new KeyManager();
