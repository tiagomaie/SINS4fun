


function Individual(xPos, yPos, theFather, theMother, amIMale) {

    this.rGen = [64, 64];
    this.gGen = [64, 64];
    this.bGen = [64, 64];
    this.male = color(255, 0, 0);
    this.female = color(0, 0, 255);
    this.genome;
    this.sex = amIMale;

    //this.deme_i = xPos;
    //this.deme_j = yPos;
    
    this.mutationRate = 0.2;
    //this.mutationStep = 1;
    this.mutationStep = parseInt(document.getElementById("stepsPerMutationRange").value);
    
    this.origin_position = createVector(xPos,yPos);
    
    //movement - acceleration affects speed, speed affects position
    this.position = createVector(xPos,yPos);

    //p5.Vector.lerp(this.position, this.origin_position,0.5,this.origin_position);
    
    this.acceleration = createVector(0,0);
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.maxspeed = 2;
    
    this.indSize = 10;
    
    
    this.indFather = theFather;
    this.indMother = theMother;
    
    if (this.indFather === null || this.indMother === null) {
        this.genome = color(
                this.rGen[0] + this.rGen[1], this.gGen[0] + this.gGen[1], this.bGen[0] + this.bGen[1]
                );
    } else {
        this.rGen[0] = this.indFather.getRGen()[random([0, 1])];
        this.rGen[1] = this.indMother.getRGen()[random([0, 1])];
        this.gGen[0] = this.indFather.getGGen()[random([0, 1])];
        this.gGen[1] = this.indMother.getGGen()[random([0, 1])];
        this.bGen[0] = this.indFather.getBGen()[random([0, 1])];
        this.bGen[1] = this.indMother.getBGen()[random([0, 1])];
        this.genome = color(
                this.rGen[0] + this.rGen[1], this.gGen[0] + this.gGen[1], this.bGen[0] + this.bGen[1]
                );
    }
}

Individual.prototype.getRGen = function () {
    return this.rGen;
}
Individual.prototype.getGGen = function () {
    return this.gGen;
}
Individual.prototype.getBGen = function () {
    return this.bGen;
}

Individual.prototype.mutation = function(mutRate){
    if(random(1) < mutRate){
        this.rGen[0] += random([-this.mutationStep, this.mutationStep]);
        this.rGen[1] += random([-this.mutationStep, this.mutationStep]);
        this.gGen[0] += random([-this.mutationStep, this.mutationStep]);
        this.gGen[1] += random([-this.mutationStep, this.mutationStep]);
        this.bGen[0] += random([-this.mutationStep, this.mutationStep]);
        this.bGen[1] += random([-this.mutationStep, this.mutationStep]);
    }
}

Individual.prototype.reproduction = function(mom, dad, demePositionVec){
    
    let childPos = p5.Vector.lerp(mom.position, demePositionVec,0.7);
    
    
    let child = new Individual(childPos.x, childPos.y, dad, mom, random([true,false]));
    //let child = new Individual(mom.position.x, mom.position.y, dad, mom, random([true,false]));
    child.mutation(this.mutationRate);
    return child;
}

Individual.prototype.isMale = function(){
    return this.sex;
}


Individual.prototype.render = function(){
    fill(this.genome);

    strokeWeight(1);
    if (this.sex) {
        stroke(this.male);
    } else {
        stroke(this.female);
    }
    //text(this.origin_position.x+" "+this.origin_position.y,this.origin_position.x,this.origin_position.y);
    //rect(this.origin_position.x, this.origin_position.y, this.indSize, this.indSize);
    ellipse(this.position.x, this.position.y, this.indSize, this.indSize);
    line(this.origin_position.x, this.origin_position.y,this.position.x, this.position.y);
}

Individual.prototype.update = function (){
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    
    this.velocity.limit(this.maxspeed);
    
    this.position.add(this.velocity);
    this.position.lerp(this.origin_position,0.05);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
}



// We accumulate a new acceleration each time based on three rules
Individual.prototype.flock = function(boids) {
    //console.log(boids);
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  //let coh = this.cohesion(target);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(100.0);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

Individual.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Individual.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// Separation
// Method checks for nearby boids and steers away
Individual.prototype.separate = function(boids) {
  let desiredseparation = 200.0;
  let steer = createVector(0,0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position,boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Individual.prototype.align = function(boids) {
  let neighbordist = 500;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Individual.prototype.cohesion = function(boids/*target*/) {
  var neighbordist = 500;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0,0);
  }
    //let theTarget = createVector(this.deme_i+random(2),this.deme_j+random(2));
    //return this.seek(target);
}

