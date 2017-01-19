/* 
 * Moving through space, by Konrad Junger
 *  https://www.openprocessing.org/sketch/96948
 *  
 * Classe star préparée à la sauce ES6 avant passage à la moulinette de Babel
 * 
 */

"use strict";

 class star {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.2, 5);
    this.wachsen = parseInt(random(0, 2));
    if (this.wachsen == 1) {
      this.d = 0; 
    } else {
      this.d = random(0.2, 3);
    }
    this.age = 0;
    this.sizeIncr = random(0,0.03);
  }
  render() {
    this.age++;
    if (this.age < 200){
      if (this.wachsen == 1){
        this.d += this.sizeIncr;
        if (this.d > 3 || this.d < -3) { 
            this.d = 3;
        }
      } else {
        if (this.d > 3 || this.d < -3) { 
           this.d = 3; 
        }
        this.d = this.d + 0.2 - 0.6 * noise(this.x, this.y, frameCount);
      }
    } else {
      if (this.d > 3 || this.d <- 3) {
          this.d = 3;
      }
    }
    
    ellipse(this.x, this.y, 
        this.d*(map(noise(this.x, this.y, 0.001 * frameCount),0,1,0.2,1.5)), 
        this.d*(map(noise(this.x, this.y, 0.001 * frameCount),0,1,0.2,1.5))
    );
  }
  move() {
    this.x = this.x - map(mouseX, 0, width, -0.05 * this.speed, 0.05 * this.speed) * (w2 - this.x); 
    this.y = this.y - map(mouseY, 0, height, -0.05 * this.speed, 0.05 * this.speed) * (h2 - this.y);
  }
}

var neuerStern;  // traduction : nouvelle étoile
var starArray = [];
var h2;//=height/2
var w2;//=width/2
var d2;//=diagonal/2
var numberOfStars = 20000;
var newStars = 50;

function setup() {
    createCanvas(900, 900);
    w2 = width / 2;
    h2 = height / 2;
    d2 = dist(0, 0, w2, h2);
    noStroke();
    neuerStern = new star();
    //frameRate(9000);
    background(0);
}

function draw() {
    fill(0, map(dist(mouseX, mouseY, w2, h2), 0, d2, 255, -10));
    rect(0, 0, width, height);
    fill(255);
    neuerStern.render();
    for (let i = 0; i < newStars; i++) {   // star init
        starArray.push(new star());
    }

    for (let i = 0; i < starArray.length; i++) {
        if (starArray[i].x < 0 || starArray[i].x > width || starArray[i].y < 0
                || starArray[i].y > height) {
            starArray.splice(i, 1);
        }
        starArray[i].move();
        starArray[i].render();
    }
    if (starArray.length > numberOfStars) {//
        for (let i = 0; i < newStars; i++) {
            starArray.splice(i, 1);
        }
    }
}

//boolean sketchFullScreen() {// force fullscreen
//  return true;
//}
