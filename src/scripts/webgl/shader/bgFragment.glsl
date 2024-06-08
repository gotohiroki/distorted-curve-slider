uniform float uTime;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec3 vPos;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  float diff = (rand(vUv) - 0.5) * 0.1;

  color.r += diff;
  color.g += diff;
  color.b += diff;

	gl_FragColor = color;


  // gl_FragColor.xyz = vec3( rand( vUv * uTime ) );
  // gl_FragColor.xyz = diff;

	
  // gl_FragColor = vec4(diff.r, diff.g, diff.b, 1.0);
}
