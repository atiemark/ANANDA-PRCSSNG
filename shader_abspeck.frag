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

float hash( float n )
			{
			    return fract(sin(n)*43758.5453);
			}

			float noise( vec3 x )
			{
			    // The noise function returns a value in the range -1.0f -> 1.0f

			    vec3 p = floor(x);
			    vec3 f = fract(x);

			    f       = f*f*(3.0-2.0*f);
			    float n = p.x + p.y*57.0 + 113.0*p.z;

			    return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
			                   mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
			               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
			                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z)-.5;
			}


vec3 rgb2hsb(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

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

  vec3 t = (float(iFrame)*vec3(1.0,2.0,3.0)/1.0)/1000.0;//+iMouse.xyz/1000.0;


  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = gl_FragCoord.xy/iResolution.xy;
  uv=uv/12.0 + sin(float(iFrame)/10000000.0) * 20.0 +.5 + iMouse/50000.0;
  uv-=iResolution.xy/4.0;

  vec3 col = vec3(0.0);



  for(int i = 0; i < 16; i++){
      float i2 = float(i)*1.0;
        col.r+=noise(uv.xyy*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0)));
        col.g+=noise(uv.xyx*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0)));
        col.b+=noise(uv.yyx*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0)));
      }


 for(int i = 0; i < 16; i++){
      float i2 = float(i)*1.0;
        col.r+=noise(uv.xyy*(31.0)+col.rgb+t*sign(sin(i2/3.0)));
        col.g+=noise(uv.xyx*(32.0)+col.rgb+t*sign(sin(i2/3.0)));
        col.b+=noise(uv.yyx*(32.0)+col.rgb+t*sign(sin(i2/3.0)));
      }
      col.rgb/=32.0;

      col.rgb=mix(col.rgb,normalize(col.rgb)*2.0,1.0);

      col = rgb2hsb(col);
      col = fract(col);
      // col = hsb2rgb(col);

      // float pct = (col.g + col.b) / 2.0;
      float pct = (col.g) * 2.0;
      pct = fract(pct) * 1.24;

      // col.rgb+=.3;


      // Calculate our uv
      vec2 uv2 = matcap(vEye, vNormal) ;

      // Sample the texture
      vec4 color = texture2D(uMatcapTexture, uv2);

      color *= 1.5;

      vec3 matcapColorHSV = rgb2hsv(vec3(color.r, color.g, color.b));
      matcapColorHSV.r = 1.0;
      matcapColorHSV.g *= 1.0;
      matcapColorHSV.b *= 1.0;
      vec4 matcapColorRGB = vec4(hsv2rgb(matcapColorHSV), 1.0);

      vec3 noiseColorHSV = rgb2hsv(vec3(col.r, col.g, col.b));
      //noiseColorHSV.r = sin(float(iFrame)*0.01);
      noiseColorHSV.g *= 1.0;
      noiseColorHSV.b *= 0.8;
      vec4 noiseColorRGB = vec4(hsv2rgb(noiseColorHSV), 1.0);
      noiseColorRGB = mix(vec4(col, 1.0), noiseColorRGB, 0.5);
      //noiseColorRGB *= 2.3;
      //noiseColorRGB -= 1.0;

      float blendMask = (matcapColorRGB.r + matcapColorRGB.g + matcapColorRGB.b) / 3.0;
      blendMask = -blendMask + 1.2;
      blendMask *= 2.0;
      blendMask -= 1.0;
      blendMask = blendMask * 0.5 + blendMask * sin(float(iFrame)*0.05)* 0.5;

      vec3 matcapColorHSV2 = rgb2hsv(vec3(color.r, color.g, color.b));
      //matcapColorHSV2.r = 1.0;
      matcapColorHSV2.g *= 2.0;
      //matcapColorHSV2.b *= 1.0;
      vec4 matcapColorRGB2 = vec4(hsv2rgb(matcapColorHSV2), 1.0);
      //matcapColorRGB2.r -= 0.4;
      matcapColorRGB2.b *= 0.5;
      matcapColorRGB2 -= -2.0;

      // Output to screen
      //vec4 differenceColor = blendDifference(vec3)
      vec4 mixColor = mix( noiseColorRGB, matcapColorRGB2, 0.2);


      vec3 mixColorHSV = rgb2hsv(vec3(mixColor.r, mixColor.g, mixColor.b));
      mixColorHSV.b = 1.0; //+ sin(float(iFrame)*0.05)* 0.1;
      vec4 mixColorRGB = vec4(hsv2rgb(mixColorHSV), 1.0);
      mixColorRGB *= 1.5;
      mixColorRGB -= 0.5;
      //mixColorRGB += 0.1;
      //mixColorRGB *= 2.0;
      //mixColorRGB -= 0.5;
      /*
      vec3 eyeDirection = normalize(vEye - surfacePosition);
      vec3 lightDirection = normalize(lightPosition - surfacePosition);
      vec3 normal = normalize(surfaceNormal);

      float power = blinnPhongSpec(lightDirection, eyeDirection, normal, shininess);

      gl_FragColor = vec4(power,power,power,1.0);
      */

      gl_FragColor = mixColorRGB;
}
