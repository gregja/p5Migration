// Dream Catcher by Oggy
// https://www.openprocessing.org/   
// sketch n° sketch169537
// Adaptation à P5.js version 2 : utilisation de ES5 avec 
//   création d'objets via .prototype.

"use strict";

var nbWeeds = 60 ; 
var weeds ;
var rootNoise;
var mode = 1;
var radius = 220;
var noiseOn = true;
var center;

var sound = new Pizzicato.Sound();

var delay1 = new Pizzicato.Effects.Delay({
    feedback: 0.6,
    time: 0.4,
    mix: 0.5
});

var synth1 = new Pz.Sound({ 
	source: 'file', 
	options: { 
		path: 'audio/bomp2.ogg' , 
		loop: false
	}
}, function() { 
    synth1.addEffect(delay1); 
});


function setup() {
    createCanvas(600, 450, P2D);
    
    center = createVector(width / 2, height / 2);

    rootNoise = createVector(random(123456), random(123456));

    strokeWeight(1);

    weeds = new Array(nbWeeds);
    for (var i = 0; i < nbWeeds; i++) {
        weeds[i] = new SeaWeed(i * TWO_PI / nbWeeds, 3 * radius);
    }
    frameRate(60);
}

function draw() {
    background(50);
    noStroke();
    fill(20, 10, 20);//, 50);
    rect(0, 0, width, height);
    rootNoise.add(createVector(.01, .01));
    strokeWeight(1);
    for (var i = 0; i < nbWeeds; i++) {
        weeds[i].update();
    }
    stroke(120, 0, 0, 220);
    strokeWeight(2);
    noFill();
    ellipse(center.x, center.y, 2 * radius, 2 * radius);

}

function keyPressed() {
    if (key > '0' && key <= '9') {
        noiseOn = true;
        nbWeeds = parseInt(key) * 10;
        weeds = new Array(nbWeeds);
        // réinitialisation du canvas
        setup();
        return;
    } else {
        if (key == 'x' || key == 'X') {
            noLoop();
            return;
        } else {
            if (key == 's' || key == 'S') {
                saveCanvas("DreamCatcher-" + frameCount + ".png", 'png');
                return;
            } else {
                if (key == 'n' || key == 'N') {
                    noiseOn = !noiseOn;
                    return;
                } else {
                    mode = (mode + 1) % 2;
                    return;
                }
            }
        }
    }
}

var MyColor = function () {
    this.init();
}
MyColor.prototype.init = function () {
    this.minSpeed = .6;
    this.maxSpeed = 1.8;
    this.minR = 200;
    this.maxR = 255;
    this.minG = 20;
    this.maxG = 120;
    this.minB = 100;
    this.maxB = 140;
    this.R = random(this.minR, this.maxR);
    this.G = random(this.minG, this.maxG);
    this.B = random(this.minB, this.maxB);
    this.Rspeed = (random(1) > .5 ? 1 : -1) * random(this.minSpeed, this.maxSpeed);
    this.Gspeed = (random(1) > .5 ? 1 : -1) * random(this.minSpeed, this.maxSpeed);
    this.Bspeed = (random(1) > .5 ? 1 : -1) * random(this.minSpeed, this.maxSpeed);    
};
MyColor.prototype.update = function () {
    this.Rspeed = (((this.R += this.Rspeed) > this.maxR) || (this.R < this.minR)) ? -this.Rspeed : this.Rspeed;
    this.Gspeed = (((this.G += this.Gspeed) > this.maxG) || (this.G < this.minG)) ? -this.Gspeed : this.Gspeed;
    this.Bspeed = (((this.B += this.Bspeed) > this.maxB) || (this.B < this.minB)) ? -this.Bspeed : this.Bspeed;
};
MyColor.prototype.getColor = function () {
    return color(this.R, this.G, this.B);
};


var SeaWeed = function (p_rad, p_length) {
    this.init();
    this.myCol = new MyColor();

    this.nbSegments = parseInt(p_length / this.DIST_MAX);
    this.pos = new Array(this.nbSegments); // position of each segment => createVector(nbSegments);
    this.cols = new Array(this.nbSegments); // colors array, one per segment => new color(this.nbSegments);
    //this.rad = new Array(this.nbSegments); // new float[this.nbSegments]();
    this.cosi = cos(p_rad);
    this.sinu = sin(p_rad);
    this.x = width / 2 + radius * this.cosi; //origin of the weed
    this.y = height / 2 + radius * this.sinu; //origin of the weed
    this.pos[0] = createVector(this.x, this.y);
    for (var i = 1; i < this.nbSegments; i++) {
        this.pos[i] = createVector(this.pos[i - 1].x - this.DIST_MAX * this.cosi, this.pos[i - 1].y - this.DIST_MAX * this.sinu);
        this.cols[i] = this.myCol.getColor();
        //this.rad[i] = 3;
    }
    
};

SeaWeed.prototype.init = function () {
    this.DIST_MAX = 5.5; //length of each segment
    this.maxWidth = 50; //max width of the base line
    this.minWidth = 11; //min width of the base line
    this.FLOTATION = -3.5; //flotation constant
    this.mouseDist = 40; //mouse interaction distance
};

SeaWeed.prototype.update = function () {
    "use strict";
    var mouse = createVector(mouseX, mouseY);

    this.pos[0] = createVector(this.x, this.y);
    for (var i = 1; i < this.nbSegments; i++) {
        var n = noise(rootNoise.x + .002 * this.pos[i].x, rootNoise.y + .002 * this.pos[i].y);
        var noiseForce = (.5 - n) * 7;
        if (noiseOn) {
            this.pos[i].x += noiseForce;
            this.pos[i].y += noiseForce;
        }
        var pv = createVector(this.cosi, this.sinu);
        pv.mult(map(i, 1, this.nbSegments, this.FLOTATION, .6 * this.FLOTATION));
        this.pos[i].add(pv);

        //mouse interaction
        if (pmouseX != mouse.x || pmouseY != mouse.y) {
            if (p5.Vector.dist(mouse, this.pos[i]) < this.mouseDist) {  
                var tmpPV = mouse.copy();
                tmpPV.sub(this.pos[i]);
                tmpPV.normalize();
                tmpPV.mult(this.mouseDist);
                tmpPV = p5.Vector.sub(mouse, tmpPV);
                this.pos[i] = tmpPV.copy(); 
                
                // Sound drived by PizzicatoJS
                synth1.play();

            }
        }

        var tmp = new p5.Vector.sub(this.pos[i - 1], this.pos[i]);
        tmp.normalize();
        tmp.mult(this.DIST_MAX);
        this.pos[i] = new p5.Vector.sub(this.pos[i - 1], tmp);

        //keep the points inside the circle
        if (p5.Vector.dist(center, this.pos[i]) > radius) {
            var tmpPV = this.pos[i].copy();  // this.pos[i].get();
            tmpPV.sub(center);
            tmpPV.normalize();
            tmpPV.mult(radius);
            tmpPV.add(center);
            this.pos[i] = tmpPV.copy();  
                            
        }
    }

    this.updateColors();

    if (mode == 0) {
        stroke(0, 100);
    }
    beginShape();
    noFill();
    for (var i = 0; i < this.nbSegments; i++) {
        //var r = this.rad[i];
        if (mode == 1) {
            stroke(this.cols[i]);
            vertex(this.pos[i].x, this.pos[i].y);
            //line(this.pos[i].x, this.pos[i].y, this.pos[i+1].x, this.pos[i+1].y);
        } else {
            fill(this.cols[i]);
            noStroke();
            ellipse(this.pos[i].x, this.pos[i].y, 2, 2);
        }
    }
    endShape();
};

SeaWeed.prototype.updateColors = function () {
    this.myCol.update();
    this.cols[0] = this.myCol.getColor();
    for (var i = this.nbSegments - 1; i > 0; i--) {
        this.cols[i] = this.cols[i - 1];
    }
}


