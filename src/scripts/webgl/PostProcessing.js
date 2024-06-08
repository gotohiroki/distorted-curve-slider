import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { MaskPass, ClearMaskPass } from "three/examples/jsm/postprocessing/MaskPass.js";
import { TexturePass } from "three/examples/jsm/postprocessing/TexturePass.js";

import vertexShader from "./shader/post/vertex.glsl";
import fragmentShader from "./shader/post/fragment.glsl";

export class PostProcessing {
  constructor(stage, params) {
    this.stage = stage;
    this.params = params;

    this.composer = null;
    this.customPass = null;

    this.setComposer();
  }

  setComposer() {
    this.composer = new EffectComposer(this.stage.renderer);
    this.renderPass = new RenderPass(this.stage.scene, this.stage.camera);
    this.composer.addPass(this.renderPass);

    const effect = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0.0 },
      },
      vertexShader: `
      varying vec2 vUv;

      void main() {
  
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
      }
      `,
      fragmentShader: `
      uniform float uTime;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;

      
      float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        // float time = uTime * 0.01;

        vec4 color = texture2D( tDiffuse, vUv );
        float diff = (rand(vUv + uTime)) * 0.1;

        color.r += diff;
        color.g += diff;
        color.b += diff;

        gl_FragColor = color;

      }
      `,
    };

    this.customPass = new ShaderPass(effect);
    this.customPass.renderToScreen = true;
    this.composer.addPass(this.customPass);
  }

  render() {
    if (this.composer != null) {
      this.composer.render(this.stage.scene, this.stage.camera);
    } else {
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
    }
  }

  onUpdate(time) {
    this.render();
    this.customPass.uniforms.uTime.value = time;
  }

  // onResize(props) {
  //   this.params.w = props.w;
  //   this.params.h = props.h;
  //   this.customPass.uniforms.resolution.value.y = this.params.h / this.params.w;
  // }
}
