var contents = "Type here";
var anim;
let uniformsShader;
let post;
let alt;
let div;
let varying = 1;
let varying2;
let first = false;

function preload() {
  uniformsShader = loadShader('uniform.vert', 'uniform.frag');
  //post = loadShader('hmhm.vert', 'hmhm.frag');

}
function setup() {
  let cnv = createCanvas((windowWidth*85)/100, windowHeight);
  anim = createGraphics((windowWidth*85)/100, windowHeight,WEBGL);
  background(0);
  div = createDiv(contents);
  div.id('texte');

}

function draw() {
  anim.noStroke();
  anim.shader(uniformsShader);
// lets just send frameCount to the shader as a way to control animation over time
  uniformsShader.setUniform('time', frameCount);
  uniformsShader.setUniform("var1", float(varying));
  uniformsShader.setUniform('alt', alt);

  varying2 = map(varying, 0, 20090,0.0,1.0);
  uniformsShader.setUniform("var2", float(varying2));
  //anim.shader(post);
  //anim.rect(0,0,width, height);
// rect gives us some geometry on the screen
  anim.rect(0,0,width, height);
  image(anim,0,0);
  filter(POSTERIZE,10);
  image(anim,0,0);

  filter(GRAY);


}

function myBox(k) {
 var txt = "' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.:;!?/§éèêàùãîâû-`_ç@()[]{}=+&#²<>%*` 1234567890°";
 var i = txt.indexOf(k);
 varying += i;
 print(varying);
 var next;
  if (i+1 < txt.length) {
   next = txt[i];
 }
  else {
  next = txt[0];
 }
  return next;
}

function keyTyped() {
  if(first == false){
    contents="";
    contents += myBox(key);
    div.html(contents, false);
    first = true;
  }
  else{
  if (keyCode === ENTER) {
    contents+="<br>";
    div.html(contents, false);
    alt += 1;
  }
  else{
  contents += myBox(key);
  div.html(contents, false);
  }
}
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    contents = contents.slice(0,-1);
    div.html(contents, false);
  }
}
function windowResized() {
  resizeCanvas((windowWidth*55)/100, windowHeight);
}
