
let teapot;

let bx;
let by;
let xOffset = 0.0;
let yOffset = 0.0;

let randDisplace = new Array(12);

let font;

let mandel;
let theShader;
let textSpacing = 230;

let rotXmax = Math.PI * 0.5;
let rotYmax = Math.PI * 0.5;

let pg;




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

  font = loadFont('sofia/Sofia-Regular.otf');



}

function setup() {
  devicePixelScaling(false);
  pg = createGraphics(windowWidth*4, windowHeight*4, WEBGL );
  createCanvas(windowWidth, windowHeight);
  console.log(devicePixelRatio);
  console.log(windowHeight);


  for(var i=0; i<12 ; i++){
    randDisplace[i] = random() * 60;
  }

  //textFont(font);
  pg.textFont(font);
  pg.textSize(width / 3);
  pg.textAlign(CENTER, CENTER);

}

function draw() {
  theShader.setUniform("uMatcapTexture", matcap);
  pg.clear();
  pg.background(100);
  scale(0.4); // Scaled to make model fit into canvas
  //rotateX(frameCount * 0.01);
  //rotateY(frameCount * 0.01);
  //normalMaterial(); // For effect


  pg.noStroke();
  angleMode(DEGREES);

  pg.fill(0);

  pg.textSize(150);
  pg.text('fest', 0, 240);

  //hello();

  for(var i=0; i < 6; i++){
    pg.push();

    pg.translate((i-2.5) * textSpacing, randDisplace[i] * sin(frameCount),  randDisplace[i+6] * sin(frameCount));
    pg.rotateX(-yOffset* 45 + 180);
    pg.rotateY(-xOffset * 45 + 180);
    pg.shader(theShader);
    theShader.setUniform("iResolution", [width, height]);
    theShader.setUniform("iFrame", frameCount);
    theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    pg.model(title3d[i]);
    pg.pop();
  }

clear();
  image(pg, 0, 0, windowWidth*2.5, windowHeight*2.5);

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
