

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

    let xPos = map(this.x, 0, this.numRows, 0, width);
    let yPos = map(this.y, 0, this.numCols, 0, height);
    
    for(let i = 0;i<this.maxPop;i++){
        this.population.push(new Individual(this.x,this.y,null,null,false));
        this.population.push(new Individual(this.x,this.y,null,null,true));
    }
    
    console.log(xPos + "  " + this.x);
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
    if(this.population.length>0){
        let currentX = (this.x)*width/this.numRows;
        let currentY = (this.y)*height/this.numCols;
        for(let i = 0; i < this.population.length; i++){
            if(this.population.length>1){
                this.population[i].flock(this.population);
                this.population[i].update();
            }
            //console.log("i="+i) 
            //console.log(" x="+this.population[i].position.x);
            //console.log(" y="+this.population[i].position.y);
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
    return newPopulation;
}
