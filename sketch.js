
let teapot;

let bx;
let by;
let xOffset = 0.0;
let yOffset = 0.0;

let randDisplace = new Array(12);

let font;

let mandel;
let theShader;
let textSpacing = 220;

var txtX = 0;
var txtY = 100;

let rotXmax = Math.PI * 0.5;
let rotYmax = Math.PI * 0.5;

let textSz = 60;

let onFest = false;

let threeDTextOffset = 10;
let pg;

let blurH, blurV, bloom;

// we need three createGraphics layers for our blur algorithm
let pass1, pass2, bloomPass;

let drop = false;
let acc = 0.01;

let tDrop;

let bgColor = [0, 84, 158];

let info;

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

  blurH = loadShader('base.vert', 'blur.frag');
  blurV = loadShader('base.vert', 'blur.frag');
  bloom = loadShader('base.vert', 'bloom.frag');

  loadStrings('info.txt', loadInfoString);

}

function loadInfoString(result) {
  info = result;
  console.log(info);
}

function setup() {
  pg = createGraphics(windowWidth, windowHeight, WEBGL );
  pg.scale(0.5, 0.5);
  createCanvas(windowWidth, windowHeight, WEBGL);

  for(var i=0; i<12 ; i++){
    randDisplace[i] = random() * 60;
  }

  //textFont(font);
  textFont(font);
  textSize(width / 3);
  textAlign(CENTER, CENTER);

  // initialize the createGraphics layers
  pass1 = createGraphics(windowWidth, windowHeight, WEBGL);
  pass2 = createGraphics(windowWidth, windowHeight, WEBGL);
  bloomPass = createGraphics(windowWidth, windowHeight, WEBGL);

  // turn off the cg layers stroke
  pass1.noStroke();
  pass2.noStroke();
  bloomPass.noStroke();

}


function draw() {
  xOffset = (mouseX / windowWidth) - 0.5;
  yOffset = (mouseY / windowHeight) - 0.5;

  theShader.setUniform("uMatcapTexture", matcap);
  if(drop){
    var t = tDrop -frameCount;
    acc += t/10.0;
    background(bgColor[0], bgColor[1], bgColor[2]);
    //background(0,0,0,t/10000.0);
  }else{
    background(bgColor[0], bgColor[1], bgColor[2]);
  }

  //scale(0.4); // Scaled to make model fit into canvas
  //rotateX(frameCount * 0.01);
  //rotateY(frameCount * 0.01);
  //normalMaterial(); // For effect




  angleMode(DEGREES);

  fill(255);

  textSize(textSz);

  var festString = 'fest';
  let bbox = font.textBounds(festString, txtX, txtY, textSz);

  //rect(txtX - textSz, txtY - textSz*0.45, textSz * 2.0, textSz * 1.5);
  //rect(bbox.x, bbox.y, bbox.w, bbox.h);
  //circle(bbox.x, bbox.y, 100);

  //console.log(bbox);
    //console.log(mouseX);
  stroke(255, 255, 255, 255);
  var mX = (mouseX - windowWidth/2);
  var mY = (mouseY - windowHeight/2);

    //line(0, txtY*1.2, mX, mY);
    var spacingSin = textSpacing + sin(frameCount/1.7) * textSpacing * 0.1;
    pg.clear();
      //hello();
    pg.noStroke();
  //stroke(sin(frameCount) * 255, sin(frameCount + 100) * 255, sin(frameCount+ 235325) * 255);
  for(var i=0; i < 6; i++){
    pg.push();

    if(drop){
      pg.translate(-(i-2.5)* acc, 0, 0);
    }
    pg.translate((i-2.5) * spacingSin, randDisplace[i] * sin(frameCount) - threeDTextOffset,  randDisplace[i+6] * sin(frameCount));
    pg.rotateX(-yOffset + Math.PI);
    pg.rotateY(-xOffset + Math.PI);
    pg.scale(0.9 + 0.4 * sin(frameCount/randDisplace[i]), 0.8, 0.8)
    pg.shader(theShader);
    theShader.setUniform("iResolution", [width, height]);
    theShader.setUniform("iFrame", frameCount);
    theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    pg.model(title3d[i]);
    pg.pop();
  }


  //image(pg, -windowWidth/2 + textSpacing/2, -windowHeight/2);
/*
  // set the shader for our first pass
  pass1.shader(blurH);

  // send the camera texture to the horizontal blur shader
  // send the size of the texels
  // send the blur direction that we want to use [1.0, 0.0] is horizontal
  blurH.setUniform('tex0', pg);
  blurH.setUniform('texelSize', [1.0/width, 1.0/height]);
  blurH.setUniform('direction', [0.0, 2.0]);

  // we need to make sure that we draw the rect inside of pass1
  pass1.rect(0,0, width*2, height*2);

  // set the shader for our second pass
  pass2.shader(blurV);

  // instead of sending the webcam, we will send our first pass to the vertical blur shader
  // texelSize remains the same as above
  // direction changes to [0.0, 1.0] to do a vertical pass
  blurV.setUniform('tex0', pass1);
  blurV.setUniform('texelSize', [1.0/width, 1.0/height]);
  blurV.setUniform('direction', [2.0, 0.0]);

  // again, make sure we have some geometry to draw on in our 2nd pass
  pass2.rect(0,0, width*2, height*2);

  // set the bloom shader for the bloom pass
  bloomPass.shader(bloom);

  // send both the camera and the blurred camera to the bloom shader
  bloom.setUniform('tex0', pg);
  bloom.setUniform('tex1', pass2);

  // also send the mouse to control the amount of bloom
  bloom.setUniform('mouseX', 7.0);

  // we need some geometry for the bloom pass
  scale(1, 1);
  bloomPass.rect(0,0, width*2, height*2);

  // draw the second pass to the screen


  image(bloomPass, -windowWidth/2, -windowHeight/2);

  //scale(-1, 1);
  image(pg, -windowWidth/2, -windowHeight/2);
*/
image(pg, -windowWidth/2, -windowHeight/2);

  var frequ = 1;

  if(!drop){

      if (
        mX > bbox.x &&
        mX < bbox.x + bbox.w &&
        mY > bbox.y &&
        mY < bbox.y + bbox.h

      ) {
        onFest = true;
        textSize(textSz);
        //clear();
        //background(0);
        text(festString, txtX + sin(frameCount * 5 * frequ) * textSz/3.0, txtY + cos(frameCount* 5 * frequ) * textSz/3.0);
        frequ += 10;
        //fill (100,0,0,200);
        //console.log("hi");
        //rect(bbox.x, bbox.y, bbox.w, bbox.h);
      }else{
        frequ = 0;
        onFest = false;
        text(festString, txtX, txtY);
      }
  }else{
      textSize(22);
      text(info, -width/4, -height/2, width*0.5, height);
  }


}

function mousePressed() {
  bx = mouseX;
  by = mouseY;

  if(onFest){
    drop = true;
    tDrop = frameCount;
  }
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
