/* 
 * Circles, by Paul Orlov
 * http://ptahi.ru/2016/02/07/programming-for-artists/
 */

float [][] a = new float[500][2]; 
void setup() { 
   size(500, 500); 
   for(int i = 0; i < a.length; i++){ 
      for(int j = 0; j < a[i].length; j++){ 
          a[i][j] = random(10,490); 9 
      }  
   } 
}

void draw() { 
  smooth(); 
  noStroke(); 
  background(0); 
  for(int i = 0; i < a.length; i++){ 
    float eDist = dist(mouseX, mouseY, a[i][0], a[i][1]); 
    float eSize = map(eDist, 0, 200, 5, 100); 
    float eColor = map(eDist, 0, 200, 50, 255); 
    fill(eColor, 200); 
    float cx = noise(mouseX)*10 + a[i][0]; 
    float cy = noise(mouseY)*10 + a[i][1]; 
    ellipse(cx, cy, eSize, eSize); 
  } 
} 
