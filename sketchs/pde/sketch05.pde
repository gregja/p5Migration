// Dream Catcher by Oggy
// https://www.openprocessing.org/
// sketch n° sketch169537

final int nbWeeds = 60;
SeaWeed[] weeds;
PVector rootNoise = new PVector(random(123456), random(123456));
int mode = 1;
float radius = 220;
Boolean noiseOn = true;
PVector center;

void setup()
{
  size(600, 450, P2D);
  center = new PVector(width/2, height/2);
  strokeWeight(1);
  weeds = new SeaWeed[nbWeeds];
  for (int i = 0; i < nbWeeds; i++)
  {
    weeds[i] = new SeaWeed(i*TWO_PI/nbWeeds, 3*radius);
  }
}

void draw()
{
  background(50);
  noStroke();
  fill(20, 10, 20);//, 50);
  rect(0, 0, width, height);
  rootNoise.add(new PVector(.01, .01));
  strokeWeight(1);
  for (int i = 0; i < nbWeeds; i++)
  {
    weeds[i].update();
  }
  stroke(120, 0, 0, 220);
  strokeWeight(2);
  noFill();
  ellipse(center.x, center.y, 2*radius, 2*radius);
  //rect(center.x, center.y, 2*radius, 2*radius);
}

void keyPressed()
{
    if(key == 'x' || key == 'X') {
      noLoop();
    } else {
      if(key == 'n' || key == 'N') {
        noiseOn = !noiseOn;
      } else {
        mode = (mode + 1) % 2;
      }
    }
}


class MyColor
{
  float R, G, B, Rspeed, Gspeed, Bspeed;
  final static float minSpeed = .6;
  final static float maxSpeed = 1.8;
  final static float minR = 200;
  final static float maxR = 255;
  final static float minG = 20;
  final static float maxG = 120;
  final static float minB = 100;
  final static float maxB = 140;

  MyColor()
  {
    init();
  }

  public void init()
  {
    R = random(minR, maxR);
    G = random(minG, maxG);
    B = random(minB, maxB);
    Rspeed = (random(1) > .5 ? 1 : -1) * random(minSpeed, maxSpeed);
    Gspeed = (random(1) > .5 ? 1 : -1) * random(minSpeed, maxSpeed);
    Bspeed = (random(1) > .5 ? 1 : -1) * random(minSpeed, maxSpeed);
  }

  public void update()
  {
    Rspeed = ((R += Rspeed) > maxR || (R < minR)) ? -Rspeed : Rspeed;
    Gspeed = ((G += Gspeed) > maxG || (G < minG)) ? -Gspeed : Gspeed;
    Bspeed = ((B += Bspeed) > maxB || (B < minB)) ? -Bspeed : Bspeed;
  }

  public color getColor()
  {
    return color(R, G, B);
  }
}
class SeaWeed
{
  final static float DIST_MAX = 5.5;//length of each segment
  final static float maxWidth = 50;//max width of the base line
  final static float minWidth = 11;//min width of the base line
  final static float FLOTATION = -3.5;//flotation constant
  float mouseDist;//mouse interaction distance
  int nbSegments;
  PVector[] pos;//position of each segment
  color[] cols;//colors array, one per segment
  // float[] rad;
  MyColor myCol = new MyColor();
  float x, y;//origin of the weed
  float cosi, sinu;

  SeaWeed(float p_rad, float p_length)
  {
    nbSegments = (int)(p_length/DIST_MAX);
    pos = new PVector[nbSegments];
    cols = new color[nbSegments];
    // rad = new float[nbSegments];
    cosi = cos(p_rad);
    sinu = sin(p_rad);
    x = width/2 + radius*cosi;
    y = height/2 + radius*sinu;
    mouseDist = 40;
    pos[0] = new PVector(x, y);
    for (int i = 1; i < nbSegments; i++)
    {
      pos[i] = new PVector(pos[i-1].x - DIST_MAX*cosi, pos[i-1].y - DIST_MAX*sinu);
      cols[i] = myCol.getColor();
      // rad[i] = 3;
    }
  }

  void update()
  {
    PVector mouse = new PVector(mouseX, mouseY);

    pos[0] = new PVector(x, y);
    for (int i = 1; i < nbSegments; i++)
    {
      float n = noise(rootNoise.x + .002 * pos[i].x, rootNoise.y + .002 * pos[i].y);
      float noiseForce = (.5 - n) * 7;
      if(noiseOn)
      {
        pos[i].x += noiseForce;
        pos[i].y += noiseForce;
      }
      PVector pv = new PVector(cosi, sinu);
      pv.mult(map(i, 1, nbSegments, FLOTATION, .6*FLOTATION));
      pos[i].add(pv);

      //mouse interaction
      //if(pmouseX != mouseX || pmouseY != mouseY)
      {
        float d = PVector.dist(mouse, pos[i]);
        if (d < mouseDist)// && pmouseX != mouseX && abs(pmouseX - mouseX) < 12)
        {
          PVector tmpPV = mouse.get();
          tmpPV.sub(pos[i]);
          tmpPV.normalize();
          tmpPV.mult(mouseDist);
          tmpPV = PVector.sub(mouse, tmpPV);
          pos[i] = tmpPV.get();
        }
      }

      PVector tmp = PVector.sub(pos[i-1], pos[i]);
      tmp.normalize();
      tmp.mult(DIST_MAX);
      pos[i] = PVector.sub(pos[i-1], tmp);

      //keep the points inside the circle
      if(PVector.dist(center, pos[i]) > radius)
      {
        PVector tmpPV = pos[i].get();
        tmpPV.sub(center);
        tmpPV.normalize();
        tmpPV.mult(radius);
        tmpPV.add(center);
        pos[i] = tmpPV.get();
      }
    }

    updateColors();

    if (mode == 0)
    {
      stroke(0, 100);
    }
    beginShape();
    noFill();
    for (int i = 0; i < nbSegments; i++)
    {
      // float r = rad[i];
      if (mode == 1)
      {
        stroke(cols[i]);
        vertex(pos[i].x, pos[i].y);
        //line(pos[i].x, pos[i].y, pos[i+1].x, pos[i+1].y);
      } else
      {
        fill(cols[i]);
        noStroke();
        ellipse(pos[i].x, pos[i].y, 2, 2);
      }
    }
    endShape();
  }

  void updateColors()
  {
    myCol.update();
    cols[0] = myCol.getColor();
    for (int i = nbSegments-1; i > 0; i--)
    {
      cols[i] = cols[i-1];
    }
  }
}

/*
// this code was autogenerated from PJS
(function($p) {
    var MyColor = (function() {
        function MyColor() {
            var $this_1 = this;

            function $superCstr() {
                $p.extendClassChain($this_1)
            }
            $this_1.R = 0;
            $this_1.G = 0;
            $this_1.B = 0;
            $this_1.Rspeed = 0;
            $this_1.Gspeed = 0;
            $this_1.Bspeed = 0;
            $p.defineProperty($this_1, 'minSpeed', {
                get: function() {
                    return MyColor.minSpeed
                },
                set: function(val) {
                    MyColor.minSpeed = val
                }
            });
            $p.defineProperty($this_1, 'maxSpeed', {
                get: function() {
                    return MyColor.maxSpeed
                },
                set: function(val) {
                    MyColor.maxSpeed = val
                }
            });
            $p.defineProperty($this_1, 'minR', {
                get: function() {
                    return MyColor.minR
                },
                set: function(val) {
                    MyColor.minR = val
                }
            });
            $p.defineProperty($this_1, 'maxR', {
                get: function() {
                    return MyColor.maxR
                },
                set: function(val) {
                    MyColor.maxR = val
                }
            });
            $p.defineProperty($this_1, 'minG', {
                get: function() {
                    return MyColor.minG
                },
                set: function(val) {
                    MyColor.minG = val
                }
            });
            $p.defineProperty($this_1, 'maxG', {
                get: function() {
                    return MyColor.maxG
                },
                set: function(val) {
                    MyColor.maxG = val
                }
            });
            $p.defineProperty($this_1, 'minB', {
                get: function() {
                    return MyColor.minB
                },
                set: function(val) {
                    MyColor.minB = val
                }
            });
            $p.defineProperty($this_1, 'maxB', {
                get: function() {
                    return MyColor.maxB
                },
                set: function(val) {
                    MyColor.maxB = val
                }
            });

            function init$0() {
                $this_1.R = $p.random(MyColor.minR, MyColor.maxR);
                $this_1.G = $p.random(MyColor.minG, MyColor.maxG);
                $this_1.B = $p.random(MyColor.minB, MyColor.maxB);
                $this_1.Rspeed = ($p.random(1) > .5 ? 1 : -1) * $p.random(MyColor.minSpeed, MyColor.maxSpeed);
                $this_1.Gspeed = ($p.random(1) > .5 ? 1 : -1) * $p.random(MyColor.minSpeed, MyColor.maxSpeed);
                $this_1.Bspeed = ($p.random(1) > .5 ? 1 : -1) * $p.random(MyColor.minSpeed, MyColor.maxSpeed);
            }
            $p.addMethod($this_1, 'init', init$0, false);

            function update$0() {
                $this_1.Rspeed = (($this_1.R += $this_1.Rspeed) > MyColor.maxR || ($this_1.R < MyColor.minR)) ? -$this_1.Rspeed : $this_1.Rspeed;
                $this_1.Gspeed = (($this_1.G += $this_1.Gspeed) > MyColor.maxG || ($this_1.G < MyColor.minG)) ? -$this_1.Gspeed : $this_1.Gspeed;
                $this_1.Bspeed = (($this_1.B += $this_1.Bspeed) > MyColor.maxB || ($this_1.B < MyColor.minB)) ? -$this_1.Bspeed : $this_1.Bspeed;
            }
            $p.addMethod($this_1, 'update', update$0, false);

            function getColor$0() {
                return $p.color($this_1.R, $this_1.G, $this_1.B);
            }
            $p.addMethod($this_1, 'getColor', getColor$0, false);

            function $constr_0() {
                $superCstr();

                $this_1.$self.init();
            }

            function $constr() {
                if (arguments.length === 0) {
                    $constr_0.apply($this_1, arguments);
                } else $superCstr();
            }
            $constr.apply(null, arguments);
        }
        MyColor.minSpeed = .6;
        MyColor.maxSpeed = 1.8;
        MyColor.minR = 200;
        MyColor.maxR = 255;
        MyColor.minG = 20;
        MyColor.maxG = 120;
        MyColor.minB = 100;
        MyColor.maxB = 140;
        return MyColor;
    })();
    $p.MyColor = MyColor;
    var SeaWeed = (function() {
        function SeaWeed() {
            var $this_1 = this;

            function $superCstr() {
                $p.extendClassChain($this_1)
            }
            $p.defineProperty($this_1, 'DIST_MAX', {
                get: function() {
                    return SeaWeed.DIST_MAX
                },
                set: function(val) {
                    SeaWeed.DIST_MAX = val
                }
            });
            $p.defineProperty($this_1, 'maxWidth', {
                get: function() {
                    return SeaWeed.maxWidth
                },
                set: function(val) {
                    SeaWeed.maxWidth = val
                }
            });
            $p.defineProperty($this_1, 'minWidth', {
                get: function() {
                    return SeaWeed.minWidth
                },
                set: function(val) {
                    SeaWeed.minWidth = val
                }
            });
            $p.defineProperty($this_1, 'FLOTATION', {
                get: function() {
                    return SeaWeed.FLOTATION
                },
                set: function(val) {
                    SeaWeed.FLOTATION = val
                }
            });
            $this_1.mouseDist = 0;
            $this_1.nbSegments = 0;
            $this_1.pos = null;
            $this_1.cols = null;
            $this_1.rad = null;
            $this_1.myCol = new MyColor();
            $this_1.x = 0;
            $this_1.y = 0;
            $this_1.cosi = 0;
            $this_1.sinu = 0;

            function update$0() {
                var mouse = new $p.PVector($p.mouseX, $p.mouseY);

                $this_1.pos[0] = new $p.PVector($this_1.x, $this_1.y);
                for (var i = 1; i < $this_1.nbSegments; i++) {
                    var n = $p.noise(rootNoise.x + .002 * $this_1.pos[i].x, rootNoise.y + .002 * $this_1.pos[i].y);
                    var noiseForce = (.5 - n) * 7;
                    if (noiseOn) {
                        $this_1.pos[i].x += noiseForce;
                        $this_1.pos[i].y += noiseForce;
                    }
                    var pv = new $p.PVector($this_1.cosi, $this_1.sinu);
                    pv.mult($p.map(i, 1, $this_1.nbSegments, SeaWeed.FLOTATION, .6 * SeaWeed.FLOTATION));
                    $this_1.pos[i].add(pv);

                    {
                        var d = $p.PVector.dist(mouse, $this_1.pos[i]);
                        if (d < $this_1.mouseDist) {
                            var tmpPV = mouse.get();
                            tmpPV.sub($this_1.pos[i]);
                            tmpPV.normalize();
                            tmpPV.mult($this_1.mouseDist);
                            tmpPV = $p.PVector.sub(mouse, tmpPV);
                            $this_1.pos[i] = tmpPV.get();
                        }
                    }

                    var tmp = $p.PVector.sub($this_1.pos[i - 1], $this_1.pos[i]);
                    tmp.normalize();
                    tmp.mult(SeaWeed.DIST_MAX);
                    $this_1.pos[i] = $p.PVector.sub($this_1.pos[i - 1], tmp);

                    if ($p.PVector.dist(center, $this_1.pos[i]) > radius) {
                        var tmpPV = $this_1.pos[i].get();
                        tmpPV.sub(center);
                        tmpPV.normalize();
                        tmpPV.mult(radius);
                        tmpPV.add(center);
                        $this_1.pos[i] = tmpPV.get();
                    }
                }

                $this_1.$self.updateColors();

                if (mode == 0) {
                    $p.stroke(0, 100);
                }
                $p.beginShape();
                $p.noFill();
                for (var i = 0; i < $this_1.nbSegments; i++) {
                    var r = $this_1.rad[i];
                    if (mode == 1) {
                        $p.stroke($this_1.cols[i]);
                        $p.vertex($this_1.pos[i].x, $this_1.pos[i].y);
                    } else {
                        $p.fill($this_1.cols[i]);
                        $p.noStroke();
                        $p.ellipse($this_1.pos[i].x, $this_1.pos[i].y, 2, 2);
                    }
                }
                $p.endShape();
            }
            $p.addMethod($this_1, 'update', update$0, false);

            function updateColors$0() {
                $this_1.myCol.update();
                $this_1.cols[0] = $this_1.myCol.getColor();
                for (var i = $this_1.nbSegments - 1; i > 0; i--) {
                    $this_1.cols[i] = $this_1.cols[i - 1];
                }
            }
            $p.addMethod($this_1, 'updateColors', updateColors$0, false);

            function $constr_2(p_rad, p_length) {
                $superCstr();

                $this_1.nbSegments = $p.__int_cast((p_length / SeaWeed.DIST_MAX));
                $this_1.pos = $p.createJavaArray('$p.PVector', [$this_1.nbSegments]);
                $this_1.cols = $p.createJavaArray('$p.color', [$this_1.nbSegments]);
                $this_1.rad = $p.createJavaArray('float', [$this_1.nbSegments]);
                $this_1.cosi = $p.cos(p_rad);
                $this_1.sinu = $p.sin(p_rad);
                $this_1.x = $p.width / 2 + radius * $this_1.cosi;
                $this_1.y = $p.height / 2 + radius * $this_1.sinu;
                $this_1.mouseDist = 40;
                $this_1.pos[0] = new $p.PVector($this_1.x, $this_1.y);
                for (var i = 1; i < $this_1.nbSegments; i++) {
                    $this_1.pos[i] = new $p.PVector($this_1.pos[i - 1].x - SeaWeed.DIST_MAX * $this_1.cosi, $this_1.pos[i - 1].y - SeaWeed.DIST_MAX * $this_1.sinu);
                    $this_1.cols[i] = $this_1.myCol.getColor();
                    $this_1.rad[i] = 3;
                }
            }

            function $constr() {
                if (arguments.length === 2) {
                    $constr_2.apply($this_1, arguments);
                } else $superCstr();
            }
            $constr.apply(null, arguments);
        }
        SeaWeed.DIST_MAX = 5.5;
        SeaWeed.maxWidth = 50;
        SeaWeed.minWidth = 11;
        SeaWeed.FLOTATION = -3.5;
        return SeaWeed;
    })();
    $p.SeaWeed = SeaWeed;

    var nbWeeds = 60;
    var weeds = null;
    var rootNoise = new $p.PVector($p.random(123456), $p.random(123456));
    var mode = 1;
    var radius = 220;
    var noiseOn = true;
    var center = null;

    function setup() {
        $p.size(600, 450, $p.P2D);
        center = new $p.PVector($p.width / 2, $p.height / 2);
        $p.strokeWeight(1);
        weeds = $p.createJavaArray('SeaWeed', [nbWeeds]);
        for (var i = 0; i < nbWeeds; i++) {
            weeds[i] = new SeaWeed(i * $p.TWO_PI / nbWeeds, 3 * radius);
        }
    }
    $p.setup = setup;
    setup = setup.bind($p);

    function draw() {
        $p.background(50);
        $p.noStroke();
        $p.fill(20, 10, 20);
        $p.rect(0, 0, $p.width, $p.height);
        rootNoise.add(new $p.PVector(.01, .01));
        $p.strokeWeight(1);
        for (var i = 0; i < nbWeeds; i++) {
            weeds[i].update();
        }
        $p.stroke(120, 0, 0, 220);
        $p.strokeWeight(2);
        $p.noFill();
        $p.ellipse(center.x, center.y, 2 * radius, 2 * radius);
    }
    $p.draw = draw;
    draw = draw.bind($p);

    function keyPressed() {
        if ($p.key == (new $p.Character('n'))) {
            noiseOn = !noiseOn;
        } else {
            mode = (mode + 1) % 2;
        }
    }
    $p.keyPressed = keyPressed;
    keyPressed = keyPressed.bind($p);

})
*/