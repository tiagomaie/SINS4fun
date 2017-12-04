

function Deme(x,y,nRows,nCols,popSize){
    
    this.population = [];
    this.maxPop = popSize*2;
    
    this.numRows = nRows;
    this.numCols = nCols;
    
    this.x = map(x, 0, this.numRows, 0, width);
    this.y = map(y, 0, this.numCols, 0, height);
    this.demePosition = createVector(this.x,this.y);
}

Deme.prototype.createPop = function(popSize){

    this.maxpop = popSize * 2;
    
    for(let i = 0;i<popSize;i++){
        this.population.push(new Individual(this.x,this.y,null,null,false));
    }
    
    for(let i = 0;i<popSize;i++){
         this.population.push(new Individual(this.x,this.y,null,null,true));
     }
}



Deme.prototype.removeFromAddTo = function(individualIdx,targetDeme){
    targetDeme.population.push(this.population.splice(individualIdx,1));
}
    
Deme.prototype.getMalePopulation=function(){
    let malePop = [];
    for(let i = 0; i < this.population.length;i++){
        if(this.population[i].isMale()){
            malePop.push(this.population[i]);
        }
    }
    return malePop;
}

Deme.prototype.getFemalePopulation=function (){
    let femalePop = [];
    for(let i = 0; i < this.population.length;i++){
        if(!(this.population[i].isMale())){
            femalePop.push(this.population[i]);
        }
    }
    return femalePop;
}

Deme.prototype.runDeme = function(){
    this.renderDeme();
    let boolRenderPop = document.getElementById("drawLineChkbox").checked 
            || document.getElementById("drawIndividualGenotypeChkbox").checked 
            || document.getElementById("drawStrokeChkbox").checked 
            || document.getElementById("drawIndividualPointsChkbox").checked;
    if (boolRenderPop) {
        if (this.population.length > 0) {
            for (let i = 0; i < this.population.length; i++) {
                this.population[i].flock(this.population);
                this.population[i].update();
                this.population[i].render();
            }
        }
    }
}

Deme.prototype.nextGeneration = function () {
    let newPopulation = [];
    let nMales = this.getMalePopulation().length;
    let nFemales = this.getFemalePopulation().length;
    let growthRate = 0.8;
    let newPopSize = 2 * nFemales * ((1+growthRate)/(1+growthRate*((2*nFemales)/this.maxPop)));

    if(nMales >= 1 && nFemales >= 1){
        while(newPopulation.length < newPopSize){
            let dad = random(this.getMalePopulation());
            let mom = random(this.getFemalePopulation());
            newPopulation.push(mom.reproduction(mom,dad,this.demePosition));  
        }
    }
    
    for(let i = 0; i < this.population.length; i++){
        this.population[i] = null;
    }
    this.population = newPopulation;
    //return newPopulation;
}




Deme.prototype.renderDeme = function() {
    push();
    
    let avgR=0,avgG=0,avgB=0;
    if(this.population.length === 0){
        avgR = 255;
        avgG = 255;
        avgB = 255;
    }else{
        for(let i = 0; i < this.population.length; i++) {
            avgR += (this.population[i].rGen[0] + this.population[i].rGen[1]);
            avgG += (this.population[i].gGen[0] + this.population[i].gGen[1]);
            avgB += (this.population[i].bGen[0] + this.population[i].bGen[1]);
        }
        avgR /= this.population.length;
        avgG /= this.population.length;
        avgB /= this.population.length;
    }
    
    let c = color(avgR,avgG,avgB);
    
    noStroke();
    fill(c,0.5);
    rectMode(CENTER);
    rect(this.demePosition.x,this.demePosition.y,width/this.numRows/1.5, height/this.numCols/1.5);
    pop();

    if (document.getElementById("showDemeStatsChkbox").checked) {
        rectMode(CENTER);
        noStroke();
        textSize(15 * (5/this.numCols));
        
        fill(0);
        let demeStats = "R:"+parseFloat(avgR).toFixed(0)
                + " G:"+parseFloat(avgG).toFixed(0)
                + " B:"+parseFloat(avgB).toFixed(0)+"\n"
                + "Size:"+this.population.length;
        text(demeStats, this.demePosition.x,this.demePosition.y,width/this.numRows, height/this.numCols);
    }
    
    
    
}