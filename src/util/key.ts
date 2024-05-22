export interface KeymapEntry {
  alias: string;
  keys: string[];
}

export class KeyManager {
  private entries: KeymapEntry[] = [];
  mouse = { x: 0, y: 0 };
  map: Record<string, boolean> = {};
  subs: { alias: string; cb: () => void }[] = [];

  private onKey(key: string, pressed: boolean) {
    this.entries.forEach((entry) => {
      if (entry.keys.includes(key)) {
        if (this.map[entry.alias] === pressed) return;

        if (pressed) {
          this.subs
            .filter((s) => s.alias === entry.alias)
            .forEach((s) => s.cb());
        }

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

  on(alias: string, cb: () => void) {
    // TODO unsub
    const entry = this.entries.find((e) => e.alias === alias);
    if (!entry) throw new Error("Entry does not exist");
    this.subs.push({ alias, cb });
  }
}
