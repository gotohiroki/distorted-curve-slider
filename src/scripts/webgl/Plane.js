import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DoubleSide, Mesh, PlaneGeometry, Raycaster, ShaderMaterial, TextureLoader, Vector2, Vector4 } from "three";
import { updateScroll, scrollOffset, currentScrollY } from "./Scroll";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import { PostProcessing } from "./PostProcessing";

export class Plane {
  constructor(body, stage, params) {
    this.body = body;
    this.stage = stage;
    this.params = params;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.canvas = this.stage.renderer.domElement;
    this.canvasRect = this.canvas.getBoundingClientRect();

    this.elements = [...document.querySelectorAll(".js-image")];
    this.noiseImage = "./assets/img/noise.png";
    this.os = [];

    this.raycaster = new Raycaster();
    this.pointer = new Vector2();

    this.scrollArea = document.querySelector("div[data-scroll]");

    this.pp = new PostProcessing(this.stage, this.params);

    this.init();
  }

  init() {
    this.setStyle();
    this.setObjects();
  }

  setStyle() {
    this.scrollArea.style.position = "fixed";
    this.scrollArea.style.width = "100%";
    this.scrollArea.style.top = this.scrollArea.style.left = 0;
    document.body.style.height = `${this.scrollArea.clientHeight}px`;
    // this.scrollable.style.overflow = "hidden";
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycast();
  }

  raycast() {
    this.raycaster.setFromCamera(this.pointer, this.stage.camera);
    const intersects = this.raycaster.intersectObjects(this.stage.scene.children);
    const intersect = intersects[0];
    // console.log(intersects.length);

    for (let i = 0; i < intersects.length; i++) {
      const obj = intersects[i].object;
      obj.material.uniforms.uMouse.value = intersects[i].uv;
    }
  }

  getPostion(rect, canvasRect) {
    const x = rect.left + rect.width / 2 - canvasRect.width / 2;
    const y = -rect.top - rect.height / 2 + canvasRect.height / 2;
    return { x, y };
  }

  getScroll(o, offset) {
    const { $el, mesh, rect } = o;
    const nextRect = $el.getBoundingClientRect();
    const { x, y } = this.getPostion(nextRect, this.canvasRect);
    // mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.set(nextRect.width / rect.width, nextRect.height / rect.height, 1);
    // mesh.material.uniforms.uMeshSize.value.x = rect.width;
    // mesh.material.uniforms.uMeshSize.value.y = rect.height;

    mesh.material.uniforms.uTime.value = offset * 0.2;
  }

  getResize(o, newCanvasRect) {
    const { $el, mesh, geometry, rect } = o;
    const nextRect = $el.getBoundingClientRect();
    const { x, y } = this.getPostion(nextRect, newCanvasRect);
    mesh.position.x = x;
    mesh.position.y = y;
    // mesh.scale(nextRect.width / rect.width, nextRect.height / rect.height, 1);
    mesh.scale.set(nextRect.width / rect.width, nextRect.height / rect.height, 1);
    // mesh.material.uniforms.uMeshSize.value.x = nextRect.width;
    // mesh.material.uniforms.uMeshSize.value.y = nextRect.height;
    o.rect = nextRect;
  }

  setObjects() {
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0, 0) },
        uHover: { value: 0 },
        uTexture: { value: 0 },
        // uTextureSize: { value: new Vector2(0, 0) },
        uNoise: { value: new TextureLoader().load(this.noiseImage) },
        uMeshSize: { value: new Vector2(0, 0) },
        uImageAspect: { value: 0 }, // 画像のアスペクト（naturalWidth は画像ファイルの元の幅）
        uPlaneAspect: { value: 0 }, // プレーンのアスペクト（clientWidth は要素の表示領域の幅）
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
      // side: DoubleSide,
    });

    this.elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      el.style.opacity = 0;

      // this.geometry = new PlaneGeometry(rect.width, rect.height, 32, 32);
      this.geometry = new PlaneGeometry(1, 1, 32, 32);

      const texture = new TextureLoader().load(el.src);
      texture.needsUpdate = true;

      const material = this.material.clone();

      el.addEventListener("pointermove", () => {
        gsap.to(material.uniforms.uHover, {
          value: 1,
          duration: 1,
        });
      });

      el.addEventListener("pointerout", () => {
        gsap.to(material.uniforms.uHover, {
          value: 0,
          duration: 1,
        });
      });

      material.uniforms.uTexture.value = texture;

      this.mesh = new Mesh(this.geometry, material);

      this.mesh.scale.x = rect.width;
      this.mesh.scale.y = rect.height;

      const { x, y } = this.getPostion(rect, this.canvasRect);
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = 10;

      material.uniforms.uImageAspect.value = el.naturalWidth / el.naturalHeight;
      material.uniforms.uPlaneAspect.value = rect.width / rect.height;

      const o = {
        mesh: this.mesh,
        geometry: this.geometry,
        material: material,
        rect: rect,
        $el: el,
      };

      this.stage.scene.add(this.mesh);
      this.os.push(o);
    });
  }

  onUpdate(time) {
    updateScroll();
    this.scrollArea.style.transform = `translate3d(0,${-currentScrollY}px,0)`;

    this.os.forEach((o) => {
      this.getScroll(o, scrollOffset);
      o.mesh.scale.x = o.rect.width;
      o.mesh.scale.y = o.rect.height;
    });

    this.pp.onUpdate(time);
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.params.shorter = props.shorter;
    this.params.longer = props.longer;

    const newCanvasRect = this.canvas.getBoundingClientRect();
    this.os.forEach((o) => this.getResize(o, newCanvasRect));

    document.body.style.height = `${this.scrollArea.clientHeight}px`;
  }
}
