import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class SetControls {
  constructor(stage) {
    this.controls = null;
    this.controls = new OrbitControls(stage.camera, stage.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.enabled = false;
    this.controls.dampingFactor = 0.2;
  }

  addGui() {
    const controls = GUI.addFolder("controls");
    controls.close();
    controls.addFolder(this.controls, "enabled").onChange((value) => {
      this.controls.enabled = value;
    });
  }

  disableDamping() {
    this.controls.enableDamping = false;
  }

  update() {
    if (this.controls != null) {
      this.controls.update();
    }
  }
}
