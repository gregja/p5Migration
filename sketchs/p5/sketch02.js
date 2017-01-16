/* 
 * Circles, by Paul Orlov
 * http://ptahi.ru/2016/02/07/programming-for-artists/
 */

var a = new Array(500)
function setup() {
    createCanvas(700, 500);
    var i, j ;
    for (i = 0; i < 500; i++){
        a[i] = new Array(2);
        for (j = 0; j < 2; j++){
          a[i][j] = random(10,490);
        }
    }
}

function draw() {
   smooth();
   noStroke();
   background(0);
   var i, eDist, eSize, eColor, cx, cy;
   for (i = 0; i < a.length; i++){
     eDist = dist(mouseX , mouseY , a[i][0], a[i][1]);
     eSize = map(eDist , 0, 200, 5, 100);
     eColor = map(eDist , 0, 200, 50, 255);
     fill(eColor , 200);

     cx = noise(mouseX)*10 + a[i][0];
     cy = noise(mouseY)*10 + a[i][1];

     ellipse(cx, cy , eSize , eSize);
   }
}
