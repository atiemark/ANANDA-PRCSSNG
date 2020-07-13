precision mediump float;

uniform vec2 iResolution;
uniform int iFrame;
uniform vec2 iMouse;

// Get the normal from the vertex shader
varying vec3 vNormal;
varying vec3 vEye;

uniform sampler2D uMatcapTexture;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

void main() {


      // Calculate our uv
      vec2 uv2 = matcap(vEye, vNormal) ;

      // Sample the texture
      vec4 color = texture2D(uMatcapTexture, uv2);

      color *= 1.5;


      gl_FragColor = color;
}
