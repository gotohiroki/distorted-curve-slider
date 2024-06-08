varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uImageAspect;
uniform float uPlaneAspect;

uniform vec2 uTextureSize;
uniform vec2 uMeshSize;

uniform float uTime;
uniform sampler2D uNoise;

#define PI 3.14159265359

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle),-sin(_angle),
              sin(_angle),cos(_angle));
}

void main() {
  vec2 ratio = vec2(
    min(uPlaneAspect / uImageAspect, 1.0),
    min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
  );

  vec2 fixedUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

  vec4 noise = texture2D(uNoise, fixedUv);
  vec2 offset = fixedUv + rotate2d(PI / 1.35) * vec2(noise.r, noise.g) * uTime * 0.005;
  vec4 texture = texture2D(uTexture, offset);
  gl_FragColor = vec4(texture);
}