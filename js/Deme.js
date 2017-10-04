

function Deme(x,y,nRows,nCols){
    
    this.population = [];
    this.maxPop = 10;
    
    this.numRows = nRows;
    this.numCols = nCols;
    
    this.x = map(x, 0, this.numRows, 0, width);
    this.y = map(y, 0, this.numCols, 0, height);
    this.demePosition = createVector(this.x,this.y);
}

Deme.prototype.createPop = function(){

    for(let i = 0;i<this.maxPop/2;i++){
        this.population.push(new Individual(this.x,this.y,null,null,false));
    }
    
    for(let i = 0;i<this.maxPop/2;i++){
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
    if(this.population.length>0){
        let currentX = (this.x)*width/this.numRows;
        let currentY = (this.y)*height/this.numCols;
        for(let i = 0; i < this.population.length; i++){
            if(this.population.length>1){
                this.population[i].flock(this.population);
                this.population[i].update();
            }
            this.population[i].render();
        }
    }
}

Deme.prototype.nextGeneration = function () {
    let newPopulation = [];
    let nMales = this.getMalePopulation().length;
    let nFemales = this.getFemalePopulation().length;
    if(nMales >= 1 && nFemales >= 1){
        while(newPopulation.length < this.maxPop){
            let dad = random(this.getMalePopulation());
            let mom = random(this.getFemalePopulation());
            newPopulation.push(mom.reproduction(mom,dad,this.demePosition));
            
        }
        this.population = newPopulation;
        
    }else{
        this.population = newPopulation;
    }
    //return newPopulation;
}




Deme.prototype.renderDeme = function() {
    push();
    //text(round(this.demePosition.x) + "  " + round(this.demePosition.y), this.demePosition.x,this.demePosition.y);
    //rectMode(CENTER);
    
    let avgR=0,avgG=0,avgB=0;
    if(this.population.length === 0){
        avgR = 0;
        avgG = 0;
        avgB = 0;
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
    
    let c =color(avgR,avgG,avgB);
    
    noStroke();
    fill(c);
    rectMode(CENTER);
    rect(this.demePosition.x,this.demePosition.y,width/this.numRows/1.5, height/this.numCols/1.5);
    pop();
    
}