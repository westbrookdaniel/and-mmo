import { BaseComponent } from "../base";
import * as p2 from "p2-es";

export class Body extends BaseComponent {
  body: p2.Body;

  constructor(public cb: () => p2.Body) {
    super();
    this.body = this.cb();
  }
}
