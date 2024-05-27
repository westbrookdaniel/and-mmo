import { BaseComponent } from "../base.js";

interface Options {
  fixed: boolean;
}

export class RenderOptions extends BaseComponent {
  constructor(public options: Options) {
    super();
  }
}
