

let theLayer;


const LAYERCOLS = 3;
const LAYERROWS = 3;

const INITPOPX = 0;
const INITPOPY = 0;

const TIMESTEPS = null;


let sliderDefault;
let outputSlider;

function setup() {
  createCanvas(700,700);
  //background(1);
  
  
  frameRate(60);
  elipPos = createVector(200,200);
  
  
  sliderDefault = document.getElementById("myRange");
  outputSlider = document.getElementById("f");
  outputSlider.innerHTML = sliderDefault.value;
  
  
  sliderDefault.oninput = function() {
    outputSlider.innerHTML = this.value;
}
  resetSim();
  
}

let elipPos;
let prvValue;
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
  
  if(sliderDefault.value != prvValue){
      resetSim();
  }
}


function resetSim(){
    
  let nrows = parseInt(sliderDefault.value);
  let ncols = parseInt(sliderDefault.value);

  prvValue = sliderDefault.value;
  //theLayer = new Layer(LAYERROWS,LAYERCOLS);
  theLayer = new Layer(nrows,ncols);
  
  theLayer.renderGrid();
  //theLayer.initPop(INITPOPX,INITPOPY);
  //  theLayer.initPop(LAYERROWS-1,LAYERCOLS-1);
  //  theLayer.initPop(LAYERCOLS-1,0);
  for(let i = 0; i < nrows; i++){
      for(let j = 0; j < ncols; j++){
        theLayer.initPop(i,j);
      }
  }
}


function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}

function keyPressed(){
    if(key === 'Q'){
        noLoop();
    }else if(key === 'W'){
        redraw();
    }else if (key === 'E'){
        loop();
    }
}
