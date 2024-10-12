// import Two from 'https://cdn.skypack.dev/two.js@latest';

import Two from "./node_modules/two.js/build/two.module.js"

// var two = new Two({
//   type: Two.Types.svg,
//   fullscreen: true,
//   autostart: true
// }).appendTo(document.body);

// two.renderer.domElement.style.background = '#fcb215';
// two.renderer.domElement.style.cursor = 'none';

// var cx = two.width / 2;
// var cy = two.height / 2;
// var delta = new Two.Vector();
// var mouse = new Two.Vector(cx, cy);
// var drag = 0.33;
// var radius = 50;

// var shape = new Two.Circle(0, 0, radius, 32);

// var shadow = new Two.Path(shape.vertices, true, true);
// shadow.position.set(cx, cy);
// shadow.noStroke().fill = 'rgba(0, 0, 0, 0.2)';
// shadow.offset = new Two.Vector(- radius / 2, radius * 2);
// shadow.scale = 1.2;

// var ball = new Two.Path(shape.vertices, true, true);
// ball.position.set(cx, cy);
// ball.noStroke().fill = 'white';

// for (var i = 0; i < ball.vertices.length; i++) {
//   var v = ball.vertices[i];
//   v.origin = v.clone();
// }

// two.add(shadow, ball);

// window.addEventListener('mousemove', function(e) {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
//   shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
//   shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
// }, false);

// window.addEventListener('touchstart', function() {
//   e.preventDefault();
//   return false;
// }, false);

// window.addEventListener('touchmove', function(e) {
//   e.preventDefault();
//   var touch = e.changedTouches[0];
//   mouse.x = touch.pageX;
//   mouse.y = touch.pageY;
//   shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
//   shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
//   return false;
// }, false);

// two.bind('update', function() {

//   delta.copy(mouse).subSelf(ball.translation);
  
//   for (var i = 0; i < ball.vertices.length; i++) {

//     var v = ball.vertices[i];
//     var dist = v.origin.distanceTo(delta);
//     var pct = dist / radius;

//     var x = delta.x * pct;
//     var y = delta.y * pct;

//     var destx = v.origin.x - x;
//     var desty = v.origin.y - y;

//     v.x += (destx - v.x) * drag;
//     v.y += (desty - v.y) * drag;

//     shadow.vertices[i].copy(v);

//   }

//   ball.translation.addSelf(delta);

//   shadow.translation.copy(ball.translation);
//   shadow.translation.addSelf(shadow.offset);
  
// });


// Result Skip Results Iframe
// EDIT ON


let xPos = 500
let yPos = 500
let rad = 50

let pos = [xPos, yPos, rad];

let params = { fullscreen: true};

let elem = document.getElementById("content");

let two = new Two(params).appendTo(elem)

let line = two.makeLine(0,0,rad,0)

// let line = new Two.makeLine(0,0,rad,0)

let circle = two.makeCircle(pos[0], pos[1], pos[2])
circle.fill =  '#FF8000';
circle.stroke = 'orangered';
circle.linewidth = 5;
circle.opacity = 0.5

let circle2 = two.makeCircle(0 , 0 , 2)
circle2.fill =  '#aF8F00';
circle2.stroke = 'blue';
circle2.linewidth = 2;
circle2.opacity = 0.5

const group = two.makeGroup(circle2);
group.translation.set(pos[0],pos[1]);

circle2.position.set(rad,0)


line.position.set(pos[0],pos[1]); 



two.bind("update", update)

// two.add(line)
two.play();

// line.center([500,500])
// line.translation.set(500, 500);
// line.center = [500,500]

function update()
{
  // console.log("frameCount: ", frameCount)
  // rect.rotation+=0.01;
  // circle.rotation += 0.01;
  line.rotation += 0.006;

  // circle2.rotation += 0.02

  circle2.position.rotate(0.002)

  group.rotation += 0.005;
}


