
let growthRate = 0.8;
let shortDistanceMigration = 0.1;
let shortDistanceMigrationSR = 0.5;
let dominantMalePercent = 0.5;
let dominantFemalePercent = 0.5;

//let layerWidth = 5;
//let layerHeight = 5;
//let squareSize = 1;


let layerArray;
let layerNextGenArray;

let MATINGSYSTEM = ["RANDOM", "MONOGAMY", "SOFTMONOGAMY", "POLYGYNY", "POLYANDRY"];





function Layer(layerRows, layerCols){
    
    this.layerCols = layerCols;
    this.layerRows = layerRows;
    
    this.generation = 0;
    this.trueGeneration = 0;
    this.layer = new Array(layerRows);
    
    this.tempLayer = new Array(layerRows);
    
    for(let i = 0; i < this.layer.length; i++){
        this.layer[i] = new Array(this.layerCols);
        this.tempLayer[i] = new Array(this.layerCols);
    }
    
    for(let i = 0; i < this.layer.length; i++){
        for(let j = 0; j < this.layer[0].length; j++){
            this.layer[i][j] = new Deme(i,j, this.layerRows,this.layerCols);
            this.tempLayer[i][j] = new Deme(i,j, this.layerRows,this.layerCols);
        }
    }
    
}





Layer.prototype.renderGrid = function(){
    for(let i = 0; i < this.layer.length; i++){
        for(let j = 0; j < this.layer[0].length; j++){
            if(this.layer[i][j] === 1) fill(0);
            else fill(255);
            stroke(0);
            rect(
                i*width/this.layerRows,
                j*height/this.layerCols, 
                width/this.layerRows-1, 
                height/this.layerCols-1
            );
        }
    } 
}


Layer.prototype.initPop = function(x,y){
    this.layer[x][y].createPop();
}


Layer.prototype.runSim = function () {
    //console.log(this.generation);
    this.displayClock();
    console.log(this.generation + " " + this.trueGeneration);
    push();
    translate(0.5 * width / this.layerRows, 0.5 * height / this.layerCols);
    for (let i = 0; i < this.layer.length; i++) {
        for (let j = 0; j < this.layer[0].length; j++) {
            this.layer[i][j].runDeme();
        }
    }
    if (this.generation > 0) {
        if ((this.generation + updateRateGap) % updateRate === 0) {
            this.migratePop();
            textSize(32);
            text("Migration", 200,200);
        }

        if ((this.generation) % updateRate === 0) {
            for (let i = 0; i < this.layer.length; i++) {
                for (let j = 0; j < this.layer[0].length; j++) {
                    this.layer[i][j].nextGeneration();
                }
            }
            this.trueGeneration++;
        }
    }

    this.generation++;
    pop();
}

let updateRate = 100;
let updateRateGap = 50;

Layer.prototype.displayClock = function(){
    if(this.generation > 0){
        if((this.generation+updateRateGap) % updateRate > 0){
            let mapColor = map((this.generation+updateRateGap) % updateRate,0,updateRate,0,255);
            let mapWidth = map((this.generation+updateRateGap) % updateRate,0,updateRate,0,width);
            fill(mapColor,0,0);
            rect(0,height-20,mapWidth,20);
        }
        if((this.generation) % updateRate > 0){
            let mapColor = map((this.generation) % updateRate,0,updateRate,0,255);
            let mapWidth = map((this.generation) % updateRate,0,updateRate,0,width);
            fill(mapColor);
            rect(0,height-10,mapWidth,10);
        }
    }
}

Layer.prototype.getNumberRows = function(){
    return layerRows;
}

Layer.prototype.getNumberCols = function(){
    return layerCols;
}

Layer.prototype.migratePop = function () {
    let migrationRate = 0.3;
    for (let i = 0; i < this.layer.length; i++) {
        for (let j = 0; j < this.layer[0].length; j++) {
            if (this.layer[i][j].population.length > 0) {
                for (let indIdx = this.layer[i][j].population.length - 1; indIdx >= 0; indIdx--) {
                    if (random(1) < migrationRate) {
                        let randomDir = random(["up", "down", "left", "right"]);
                        let newX, newY;
                        if (randomDir === "up" && j>0) {
                            //newX = map(0, 0, this.layerRows, 0, width);
                            //newY = map(-1, 0, this.layerCols, 0, height);
                            //this.layer[i][j].population[indIdx].position.add(
                            //        createVector(newX, newY));
                            //this.layer[i][j].population[indIdx].position.sub(newX, newY);
                            let migrantInd = this.layer[i][j].population.splice(indIdx, 1);
                            migrantInd[0].origin_position.set(this.layer[i][j - 1].demePosition);
                            this.layer[i][j - 1].population.push(migrantInd[0]);
                        } else if (randomDir === "down" && j<this.layerCols-1) {
                            //console.log(j + " vs "+ layerCols);
                            //newX = map(0, 0, this.layerRows, 0, width);
                            //newY = map(1, 0, this.layerCols, 0, height);
                            //this.layer[i][j].population[indIdx].position.add(
                            //        createVector(newX, newY));
                            let migrantInd = this.layer[i][j].population.splice(indIdx, 1);
                            migrantInd[0].origin_position.set(this.layer[i][j + 1].demePosition);
                            this.tempLayer[i][j + 1].population.push(migrantInd[0]);
                        } else if (randomDir === "left" && i > 0) {
                            
                            let migrantInd = this.layer[i][j].population.splice(indIdx, 1);
                            //RESET POSITION OF MIGRANT
                            migrantInd[0].origin_position.set(this.layer[i - 1][j].demePosition);
                            this.tempLayer[i-1][j].population.push(migrantInd[0]);
                            
                        } else if (randomDir === "right" && i < this.layerRows-1) {
//                            newX = map(1, 0, this.layerRows, 0, width);
//                            newY = map(0, 0, this.layerCols, 0, height);
//                            this.layer[i][j].population[indIdx].position.add(
//                                    createVector(newX, newY));
                            let migrantInd = this.layer[i][j].population.splice(indIdx, 1);
                            migrantInd[0].origin_position.set(this.layer[i + 1][j].demePosition);
                            this.layer[i+1][j].population.push(migrantInd[0]);
                        }
                    }
                }
            }
        }
    }
    
    for (let i = 0; i < this.layer.length; i++) {
        for (let j = 0; j < this.layer[0].length; j++) {
            while(this.tempLayer[i][j].population.length > 0){
                this.layer[i][j].population.push(this.tempLayer[i][j].population.pop());
            }
        }
    }
    //this.layer = this.tempLayer;


}


