varying vec2 vUv;
uniform float uTime;

float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;
  vec3 pos = position;

  vec2 uvCurve = uv;

  float x = 0.0;
  float y = sin(uvCurve.x * PI) * uTime;
  float z = 0.0;

  if( uTime > 0.0 ) {
    z = cos( uvCurve.y ) * uTime * -30.0;
  } else {  
    z = cos( uvCurve.y - 1.0 ) * uTime * 30.0;
  }
  

  vec3 curve = vec3(x, y, z);
  pos += curve * 0.005;

  pos /= 1.0 + 0.0010 * 0.075;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}