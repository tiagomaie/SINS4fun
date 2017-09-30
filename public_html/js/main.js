

let theLayer;


const LAYERCOLS = 10;
const LAYERROWS = 10;

const INITPOPX = 0;
const INITPOPY = 0;

const TIMESTEPS = null;


function setup() {
  createCanvas(700,700);
  //background(1);
  theLayer = new Layer(LAYERROWS,LAYERCOLS);
  
  theLayer.renderGrid();
  //theLayer.initPop(INITPOPX,INITPOPY);
//  theLayer.initPop(LAYERROWS-1,LAYERCOLS-1);
  theLayer.initPop(LAYERCOLS-1,0);
//  for(let i = 0; i < LAYERROWS; i++){
//      for(let j = 0; j < LAYERCOLS; j++){
//        theLayer.initPop(i,j);
//      }
//  }
  
  frameRate(60);
  elipPos = createVector(200,200);
}

let elipPos;
function draw() {

  theLayer.renderGrid();
  push();
  theLayer.runSim();
  pop();
  //theLayer.displayClock();
  if(theLayer.generation === TIMESTEPS){
      noLoop();
  }
  
  
  //mousePressed();
  
  elipPos.lerp(createVector(mouseX,mouseY),0.5);
 
  ellipse(elipPos.x,elipPos.y,10,10);
  
  
}

function mousePressed(){
    noLoop();
}

function keyPressed(){
    if(key === "G"){
        loop();
    }else{
        redraw();
    }
}
