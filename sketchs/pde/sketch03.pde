// Source : https://github.com/p5aholic/p5codeschool/blob/master/samples/Chapter15_3/sketch07/sketch07.pde

// Génération d'un tableau de 100 éléments destinés à stocker des 
//   instances de la classe Ball
Ball[] balls = new Ball[100];

void setup() {
  size(750, 350);

  // Générer 100 objets de classe Ball 
  for (int i = 0; i < balls.length; i++) {
    balls[i] = new Ball();
  }
}

void draw() {
  background(255);

  // Exécuter les méthodes de mise à jour et d'affichage pour tous les objets Ball
  for (int i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].display();
  }
}

class Ball {
  float x, y;
  float vx, vy;
  int radius;
  color c;

  // constructeur
  Ball() {
    this.radius = (int)random(10, 20);
    this.x = random(this.radius, width-this.radius);
    this.y = random(this.radius, height-this.radius);
    this.vx = random(-5, 5);
    this.vy = random(-5, 5);
    this.c = color(random(255), random(255), random(255), random(255));
  }

  // méthode de mise à jour
  void update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x-this.radius <= 0 || this.x+this.radius >= width) {
      this.vx *= -1;
    }
    if (this.y-radius <= 0 || this.y+this.radius >= height) {
      this.vy *= -1;
    }
  }

  // méthode d'affichage
  void display() {
    noStroke();
    fill(c);
    ellipse(x, y, 2*radius, 2*radius);
  }
}
