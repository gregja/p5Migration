// Dream Catcher by Oggy
// https://www.openprocessing.org/   
// sketch n° sketch169537
// Adaptation à P5.js version 2 : utilisation de ES5 avec Object.create()
//   les fonctions SeeWeed et MyColor fonctionnent ici selon le principe de 
//   fonctions "factory"

"use strict";

var nbWeeds = 60;
var weeds;
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
        path: 'audio/bomp2.ogg',
        loop: false
    }
}, function () {
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

var MyColor_Proto = {
    minSpeed : .6,
    maxSpeed : 1.8,
    minR : 200,
    maxR : 255,
    minG : 20,
    maxG : 12,
    minB : 100,
    maxB : 140
};
    
var MyColor = function () {
    "use strict";
    var that = Object.create(MyColor_Proto);

    that.R = random(that.minR, that.maxR);
    that.G = random(that.minG, that.maxG);
    that.B = random(that.minB, that.maxB);
    that.Rspeed = (random(1) > .5 ? 1 : -1) * random(that.minSpeed, that.maxSpeed);
    that.Gspeed = (random(1) > .5 ? 1 : -1) * random(that.minSpeed, that.maxSpeed);
    that.Bspeed = (random(1) > .5 ? 1 : -1) * random(that.minSpeed, that.maxSpeed);

    that.update = function () {
        that.Rspeed = (((that.R += that.Rspeed) > that.maxR) ||
                (that.R < that.minR)) ? -that.Rspeed : that.Rspeed;
        that.Gspeed = (((that.G += that.Gspeed) > that.maxG) ||
                (that.G < that.minG)) ? -that.Gspeed : that.Gspeed;
        that.Bspeed = (((that.B += that.Bspeed) > that.maxB) ||
                (that.B < that.minB)) ? -that.Bspeed : that.Bspeed;
    };
    
    that.getColor = function () {
        return color(that.R, that.G, that.B);
    };
    
    return that ;
}


var SeaWeed_Proto = {
    DIST_MAX: 5.5, //length of each segment
    maxWidth: 50, //max width of the base line
    minWidth: 11, //min width of the base line
    FLOTATION: -3.5, //flotation constant
    mouseDist: 40, //mouse interaction distance
};

var SeaWeed = function (p_rad, p_length) {
    "use strict";
    var that = Object.create(SeaWeed_Proto);

    that.myCol = new MyColor();

    that.nbSegments = parseInt(p_length / that.DIST_MAX);
    that.pos = new Array(that.nbSegments); // position of each segment => createVector(nbSegments);
    that.cols = new Array(that.nbSegments); // colors array, one per segment => new color(that.nbSegments);
    //that.rad = new Array(that.nbSegments); // new float[that.nbSegments]();
    that.cosi = cos(p_rad);
    that.sinu = sin(p_rad);
    that.x = width / 2 + radius * that.cosi; //origin of the weed
    that.y = height / 2 + radius * that.sinu; //origin of the weed
    that.pos[0] = createVector(that.x, that.y);
    for (var i = 1; i < that.nbSegments; i++) {
        that.pos[i] = createVector(that.pos[i - 1].x - that.DIST_MAX * that.cosi, that.pos[i - 1].y - that.DIST_MAX * that.sinu);
        that.cols[i] = that.myCol.getColor();
        //that.rad[i] = 3;
    }

    that.update = function () {
        var mouse = createVector(mouseX, mouseY);

        that.pos[0] = createVector(that.x, that.y);
        for (var i = 1; i < that.nbSegments; i++) {
            var n = noise(rootNoise.x + .002 * that.pos[i].x, rootNoise.y + .002 * that.pos[i].y);
            var noiseForce = (.5 - n) * 7;
            if (noiseOn) {
                that.pos[i].x += noiseForce;
                that.pos[i].y += noiseForce;
            }
            var pv = createVector(that.cosi, that.sinu);
            pv.mult(map(i, 1, that.nbSegments, that.FLOTATION, .6 * that.FLOTATION));
            that.pos[i].add(pv);

            //mouse interaction
            if (pmouseX != mouse.x || pmouseY != mouse.y) {
                 if (p5.Vector.dist(mouse, this.pos[i]) < this.mouseDist) {  
                    var tmpPV = mouse.copy();
                    tmpPV.sub(that.pos[i]);
                    tmpPV.normalize();
                    tmpPV.mult(that.mouseDist);
                    tmpPV = p5.Vector.sub(mouse, tmpPV);
                    that.pos[i] = tmpPV.copy();

                    // Sound drived by PizzicatoJS
                    synth1.play();

                }
            }

            var tmp = new p5.Vector.sub(that.pos[i - 1], that.pos[i]);
            tmp.normalize();
            tmp.mult(that.DIST_MAX);
            that.pos[i] = new p5.Vector.sub(that.pos[i - 1], tmp);

            //keep the points inside the circle
            if (p5.Vector.dist(center, that.pos[i]) > radius) {
                var tmpPV = that.pos[i].copy();  // that.pos[i].get();
                tmpPV.sub(center);
                tmpPV.normalize();
                tmpPV.mult(radius);
                tmpPV.add(center);
                that.pos[i] = tmpPV.copy();

            }
        }

        that.updateColors();

        if (mode == 0) {
            stroke(0, 100);
        }
        beginShape();
        noFill();
        for (var i = 0; i < that.nbSegments; i++) {
            //var r = that.rad[i];
            if (mode == 1) {
                stroke(that.cols[i]);
                vertex(that.pos[i].x, that.pos[i].y);
                //line(that.pos[i].x, that.pos[i].y, that.pos[i+1].x, that.pos[i+1].y);
            } else {
                fill(that.cols[i]);
                noStroke();
                ellipse(that.pos[i].x, that.pos[i].y, 2, 2);
            }
        }
        endShape();
    };

    that.updateColors = function () {
        that.myCol.update();
        that.cols[0] = that.myCol.getColor();
        for (var i = that.nbSegments - 1; i > 0; i--) {
            that.cols[i] = that.cols[i - 1];
        }
    }
    return that;
};

