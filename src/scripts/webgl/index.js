import { Vector2 } from "three";

import { SetControls } from "./lib/SetControls";
import { SetGui } from "./lib/SetGui";

import { Stage } from "./Stage";
import { Plane } from "./Plane";

export class WebGL {
  constructor(body, params) {
    this.body = body;
    this.params = params;

    // module
    this.stage = null;
    this.plane = null;
    this.bg = null;

    // lib
    this.controls = null;

    this.time = 0;
    this.speed = 0;
    this.targetSpeed = 0;
    this.mouse = new Vector2();
    this.followMouse = new Vector2();
    this.prevMouse = new Vector2();
    this.paused = false;

    this.init();
  }

  init() {
    this.stage = new Stage("#webgl", this.params);
    this.plane = new Plane(this.body, this.stage, this.params);
    // this.bg = new Bg(this.body, this.stage, this.params);
    // this.controls = new SetControls(this.stage);
    this.onMouseMove();
    this.onUpdate();
  }

  onMouseMove() {
    this.body.addEventListener("pointermove", (event) => {
      this.plane.onPointerMove(event);
    });
  }

  onUpdate() {
    requestAnimationFrame(this.onUpdate.bind(this));
    this.time += 0.01;
    this.plane.onUpdate(this.time);
    // this.bg.onUpdate(this.time);
    // this.stage.onRenderer();
    // this.controls.update();
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.params.shorter = props.shorter;
    this.params.longer = props.longer;

    this.stage.onResize(props);
    this.plane.onResize(props);
  }
}
