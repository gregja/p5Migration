// Génération de 100 balles rebondissantes
// Source : https://github.com/p5aholic/p5codeschool/blob/master/samples/Chapter15_3/sketch07/sketch07.pde

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
  function Ball() {
    _classCallCheck(this, Ball);
      this.radius = random(10, 20);
      this.x = random(this.radius, width - this.radius);
      this.y = random(this.radius, height - this.radius);
      this.vx = random(-5, 5);
      this.vy = random(-5, 5);
      this.c = color(random(255), random(255), random(255), random(255));
      
  }

  _createClass(Ball, [{

    key: "update",
    value: function update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
        this.vx *= -1;
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= height) {
        this.vy *= -1;
      }
    }

    // méthode d'affichage

  }, {
    key: "display",
    value: function display() {
      noStroke();
      fill(this.c);
      ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
    }
  }]);

  return Ball;
}();

// Génération d'un tableau de 100 éléments destinés à stocker des 
//   instances de la classe Ball
var balls = new Array(100);

function setup() {
  createCanvas(750, 350);

  // Générer 100 objets de classe Ball 
  for (var i = 0; i < balls.length ; i++) {
    balls[i] = new Ball();
  }
}

function draw() {
  background(255);

  // Exécuter les méthodes de mise à jour et d'affichage pour tous les objets Ball
  for (var i = 0; i < balls.length ; i++) {
    balls[i].update();
    balls[i].display();
  }
}

