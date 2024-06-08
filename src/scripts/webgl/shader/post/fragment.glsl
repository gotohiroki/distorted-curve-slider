uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform float scrollSpeed;
uniform float time;
// #include 'noise.glsl'
void main(){
  vec2 newUV = vUv;
  // float area = smoothstep(1.0, 0.8, vUv.y) * 2.0 - 1.0;
  float area = smoothstep(0.1, 0.7, vUv.y) * 2.0 - 1.0;
  // area = pow(area, 4.0);
  // float noise = 0.5 * (cnoise(vec3(vUv * 10.0, time / 5.0)) + 1.0);
  // float n = smoothstep(0.5, 0.51, noise + area);
  newUV.x -= (vUv.x - 0.5) * 0.1 * area * scrollSpeed;
  // newUV.y -= (vUv.y - 0.5) * 0.1 * area * scrollSpeed;
  gl_FragColor = texture2D( tDiffuse, newUV);
  // gl_FragColor = vec4(n, 0.0, 0.0, 1.0);
  // gl_FragColor = mix(vec4(1.0), texture2D( tDiffuse, newUV), n);
}