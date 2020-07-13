let teapot;

let bx;
let by;
let xOffset = 0.0;
let yOffset = 0.0;

let randDisplace = new Array(12);

let mandel;
let theShader;
let textSpacing = 230;

let rotXmax = PI * 0.5;
let rotYmax = PI * 0.5;



function preload() {
  // Load model with normalise parameter set to true
  //speakers = loadModel('assets/speakers.obj', true);
  //glasses = loadModel('assets/glasses.obj', true);
  //lips = loadModel('assets/lip.obj', true);
  cap = loadModel('assets/bottleCap_UV.obj', true);
  cube = loadModel('assets/cube.obj', true);

  title3d = [loadModel('assets/text/A1.obj', true),
    loadModel('assets/text/N1.obj', true),
    loadModel('assets/text/A1.obj', true),
    loadModel('assets/text/N2.obj', true),
    loadModel('assets/text/D.obj', true),
    loadModel('assets/text/A1.obj', true)
  ]

  //ear = loadModel('assets/ear.obj', true);

  // load the shader definitions from files
  theShader = loadShader('shader.vert', 'shader.frag');
  matcap = loadImage("matcap.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  for(var i=0; i<12 ; i++){
    randDisplace[i] = random() * 60;
  }
}

function draw() {
  theShader.setUniform("uMatcapTexture", matcap);
  background(200);
  scale(0.4); // Scaled to make model fit into canvas
  //rotateX(frameCount * 0.01);
  //rotateY(frameCount * 0.01);
  //normalMaterial(); // For effect

  //stroke(100,100,0);
  noStroke();
  angleMode(DEGREES);

  for(var i=0; i < 6; i++){
    push();

    translate((i-2.5) * textSpacing, randDisplace[i] * sin(frameCount),  randDisplace[i+6] * sin(frameCount));
    rotateX(-yOffset* 45 + 180);
    rotateY(-xOffset * 45 + 180);
    shader(theShader);
    theShader.setUniform("iResolution", [width, height]);
    theShader.setUniform("iFrame", frameCount);
    theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    model(title3d[i]);
    pop();
  }

}

function mousePressed() {
  bx = mouseX;
  by = mouseY;
}

function mouseDragged() {
    xOffset = (mouseX / windowWidth) - 0.5;

    yOffset = (mouseY / windowHeight) - 0.5;

    console.log("x: " + xOffset);
    console.log("y: " + yOffset);
}

function mouseReleased() {
  locked = false;
}






function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
