// this is a port of "recursive noise experiment" by ompuco
// https://www.shadertoy.com/view/wllGzr
// casey conchinha - @kcconch ( https://github.com/kcconch )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform int iFrame;
uniform vec2 iMouse;

// Get the normal from the vertex shader
varying vec3 vNormal;
varying vec3 vEye;

uniform sampler2D uMatcapTexture;



void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
