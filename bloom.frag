precision mediump float;

// texcoords from the vertex shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform sampler2D tex1;

// the mouse value between 0 and 1
uniform float mouseX;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;
  uv.x = 1.0 - uv.x;

  // get the camera and the blurred image as textures
  vec4 cam = texture2D(tex0, uv);
  vec4 blur = texture2D(tex1, uv);

  // calculate an average color for the blurred image
  // this is essentially the same as saying (blur.r + blur.g + blur.b) / 3.0;
  float avg = dot(blur.rgb, vec3(0.33333));

  // mix the blur and camera together according to how bright the blurred image is
  // use the mouse to control the bloom
  vec4 bloom = mix(cam, blur, clamp(avg*(1.0 + mouseX), 0.0, 1.0));

  vec3 bloomHSV = rgb2hsv(vec3(bloom.r, bloom.g, bloom.b));
  //bloomHSV.r = 1.0; //+ sin(float(iFrame)*0.05)* 0.1;
  vec4 bloomRGB = vec4(hsv2rgb(bloomHSV), 0.2);

  vec4 mixed = mix(bloomRGB, bloom, 1.0);
  mixed.a = bloom.a * 1.0;
  mixed.r += 0.1;
  mixed.g += 0.6;
  mixed.b += 0.6;

  mixed.a *= 0.45;
  //mixed *= 1.5;

  gl_FragColor = mixed;
}
