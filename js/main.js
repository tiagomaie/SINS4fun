

let theLayer;


const LAYERCOLS = 3;
const LAYERROWS = 3;

const INITPOPX = 0;
const INITPOPY = 0;

const TIMESTEPS = null;


let layerSizeSlider;
let layerSizeSliderOutput;

let popSizeSlider;
let popSizeSliderOutput;

let mutationStepSlider;
let mutationStepSliderOutput;

let migrationRateSlider;
let migrationRateSliderOutput;

//This option slows the program down considerably. Enable only when debugging.
p5.disableFriendlyErrors = true;

function setup() {
    createCanvas(700, 700);
    //background(1);


    frameRate(60);
    elipPos = createVector(200, 200);


    layerSizeSlider = document.getElementById("demesPerSideRange");
    layerSizeSliderOutput = document.getElementById("layerSize");
    layerSizeSliderOutput.innerHTML = layerSizeSlider.value;


    layerSizeSlider.oninput = function () {
        layerSizeSliderOutput.innerHTML = this.value;
    }
    
    popSizeSlider = document.getElementById("popSizeRange");
    popSizeSliderOutput = document.getElementById("popSize");
    popSizeSliderOutput.innerHTML = popSizeSlider.value;


    popSizeSlider.oninput = function () {
        popSizeSliderOutput.innerHTML = this.value;
    }
    
    mutationStepSlider = document.getElementById("stepsPerMutationRange");
    mutationStepSliderOutput = document.getElementById("mutSteps");
    mutationStepSliderOutput.innerHTML = mutationStepSlider.value;


    mutationStepSlider.oninput = function () {
        mutationStepSliderOutput.innerHTML = this.value;
    }
    
    migrationRateSlider = document.getElementById("migrationRateRange");
    migrationRateSliderOutput = document.getElementById("migrationRate");
    migrationRateSliderOutput.innerHTML = 
            parseFloat(parseInt(migrationRateSlider.value)/100).toFixed(2);


    migrationRateSlider.oninput = function () {
        migrationRateSliderOutput.innerHTML = 
                parseFloat(parseInt(this.value)/100).toFixed(2);
    }
    
    
    resetSim();

}

let elipPos;
let prvLSizeValue;
let prvPopSizeValue;
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
  
  if(layerSizeSlider.value !== prvLSizeValue 
          || popSizeSlider.value !== prvPopSizeValue){
      resetSim();
  }
}


function resetSim(){
    
  let nrows = parseInt(layerSizeSlider.value);
  let ncols = parseInt(layerSizeSlider.value);
  
  let popSize = parseInt(popSizeSlider.value);

  prvLSizeValue = layerSizeSlider.value;
  prvPopSizeValue = popSizeSlider.value;
  //theLayer = new Layer(LAYERROWS,LAYERCOLS);
  theLayer = new Layer(nrows,ncols,popSize);
  
  theLayer.renderGrid();
  //theLayer.initPop(INITPOPX,INITPOPY);
  //  theLayer.initPop(LAYERROWS-1,LAYERCOLS-1);
  //  theLayer.initPop(LAYERCOLS-1,0);
  for(let i = 0; i < nrows; i++){
      for(let j = 0; j < ncols; j++){
        theLayer.initPop(i,j,popSize);
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
