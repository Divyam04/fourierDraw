// import Two from 'https://cdn.skypack.dev/two.js@latest';

import { TWO_PI } from "two.js/src/utils/math";
import Two from "./node_modules/two.js/build/two.module.js"


// import Math

let boundFuncs = [];

function drawSignal(two, rotTestX, rotTestY, masterGroup, localRotX,localRotY, lineTest, graphPoints, circleTest, numCycles)
{
  rotTestX = masterGroup[0].parent.position.x;
  rotTestY = masterGroup[0].parent.position.y;

  let accum = 0;
  for (let i = 0; i < numCycles ; i++)
  {
    let n = (i * 2) + 1 ;
    let k = n - 2;

      let tempTestX = localRotX[i]
      let tempTestY = localRotY[i]

      localRotX[i] =  Math.cos( k * 0.02) * tempTestX - (Math.sin(k * 0.02) * tempTestY);
      localRotY[i] =  Math.sin( k * 0.02) * tempTestX + (Math.cos(k * 0.02) * tempTestY);


    accum = k ; 

    rotTestX = rotTestX + localRotX[i]; 
    rotTestY = rotTestY + localRotY[i]; 

   }
   

  lineTest.vertices[0].x = rotTestX; 
  lineTest.vertices[0].y =  rotTestY; 
  lineTest.vertices[1].y =  rotTestY; 

  let graphPoint = two.makeCircle(lineTest.vertices[1].x, rotTestY, 1) ;

  // graphPoint.fill =  '#AF2342';
  graphPoint.stroke = '#AF2342';
  // graphPoint.linewidth = 0.1;
  // graphPoint.noStroke(); 
  graphPoint.opacity = 1;

  graphPoints.push(graphPoint);

  for (let point of graphPoints)
  {
    point.translation.set(point.translation.x+1, point.translation.y)
  }

  if(graphPoints.length > 900)
  {
    const removedCircle = graphPoints.shift(); 
    two.remove(removedCircle); 

  }

  circleTest.translation.set(rotTestX, rotTestY);

  circleTest.fill =  '#000000';
  circleTest.stroke = 'black';
  circleTest.linewidth = 1;
  circleTest.opacity = 0.5;

}

// const drawSignalBound =  drawSignal.bind(this, two, rotTestX, rotTestY, masterGroup, localRotX,localRotY, lineTest, graphPoints, circleTest, numCycles);

function renderHeading(two)
{
  const text = two.makeText('Fourier Draw!', window.screen.width/2, 200); // Text, x, y position

text.fill = 'black';       // Set text color
text.size = 64;            // Set font size
text.style = "italic"
text.alignment = 'center'; // Align the text to the center
return text;
}

function update(group, rotVal = 0.006)
{
  group.rotation += rotVal;

}

function dft(vals)
{
  let fourier = [];

  for (let i=0; i<vals.length; i++)
  {
    let re = 0;
    let im = 0; 
    for(let n=0; n< vals.length; n++)
    {
      let angle = (TWO_PI * i * n) / vals.length;
      re += vals[n] * Math.cos(angle);
      im -= vals[n] * Math.sin(angle);
    }

    re = re / vals.length;
    im = im / vals.length;

    fourier[i] = { re , im };
  }
  return fourier
}

let time = 0;
function createElement(two, pos, numCycles=5)
{
  two.clear();

  renderHeading(two);


  // let rad = 50

  // let initFlag = false;
  let x = 0;
  let y = 0;

  // let rotCenterX = pos[0];
  // let rotCenterY = pos[1];

  let translateX = 0;
  let translateY = 0;

  let currX = 0;
  let currY = 0;

  const group0 = two.makeGroup();
  group0.translation.set(pos[0], pos[1])

  // let numCycles = 5;
  const groupArray = []

  // groupArray.push(group0);


  for (let i=0; i < numCycles; i++)
  {
    let prevX = x;
    let prevY = y;

    let n = i * 2 + 1;

    let radius = pos[2] * (4/( n * Math.PI ));


    let circle = two.makeCircle(0 , 0, radius)
    circle.fill =  '#FF8000';
    circle.stroke = 'orangered';
    circle.linewidth = 5;
    circle.opacity = 0.4


    let line2 = two.makeLine(0, 0, radius, 0)
    
    const group2 = two.makeGroup(circle, line2);
    group2.translation.set(currX , currY );
    circle.position.set( translateX,  translateY)

    groupArray.push(group2);

    
    currX = translateX;
    currY = translateY;


    group0.add(group2);

    x = radius * Math.cos(n * time);
    y = radius * Math.sin(n * time);

    translateX = x;
    translateY = y;

    line2.position.set(prevX,  prevY); 


    // circle 2 is the ddot in the end

    let circle2 = two.makeCircle(0, 0, 2)
    circle2.fill =  '#aF8F00';
    circle2.stroke = 'blue';
    circle2.linewidth = 2;
    circle2.opacity = 0.4


    circle2.position.set(radius,0)
    

    // // update for line
    // two.bind("update", function() {
    //   update(group); 
    // } )

  }

  let masterGroup = []
  for(let i=0 ; i < numCycles ; i++)
  {
    let tempGroup = groupArray[i];
    for (let j = i+1; j<numCycles ; j++)
    {
      tempGroup.add(groupArray[j]);
    }
    masterGroup.push(tempGroup);
  }


  let rotTestX = 0;
  let rotTestY = 0;
  let circleTest = two.makeCircle(rotTestX, rotTestY, 5) ;

  let graphPoints = []

  graphPoints.clear


  let localRotX = masterGroup.map(elem => elem.children[0].position.x); 
  localRotX[groupArray.length - 1] = localRotX[groupArray.length - 1] + masterGroup[groupArray.length - 1].children[0].radius;
  let localRotY = masterGroup.map(elem => elem.children[0].position.y); 


  let lineTest = two.makeLine(rotTestX, rotTestX, 550 +  localRotX.reduce((acc, curr) => acc + curr, 0), 
      500 + localRotY.reduce((acc, curr) => acc + curr, 0))

  let drawSignalBound =  drawSignal.bind(this, two, rotTestX, rotTestY, masterGroup, localRotX,localRotY, lineTest, graphPoints, circleTest, numCycles);
  boundFuncs.push(drawSignalBound);
  two.bind("update", drawSignalBound);

  // two.bind("update", function() 
  // {


  //   rotTestX = masterGroup[0].parent.position.x;
  //   rotTestY = masterGroup[0].parent.position.y;

  //   let accum = 0;
  //   for (let i = 0; i < numCycles ; i++)
  //   {
  //     let n = (i * 2) + 1 ;
  //     let k = n - 2;

  //       let tempTestX = localRotX[i]
  //       let tempTestY = localRotY[i]
  
  //       localRotX[i] =  Math.cos( k * 0.02) * tempTestX - (Math.sin(k * 0.02) * tempTestY);
  //       localRotY[i] =  Math.sin( k * 0.02) * tempTestX + (Math.cos(k * 0.02) * tempTestY);


  //     accum = k ; 

  //     rotTestX = rotTestX + localRotX[i]; 
  //     rotTestY = rotTestY + localRotY[i]; 

  //    }
     

  //   lineTest.vertices[0].x = rotTestX; 
  //   lineTest.vertices[0].y =  rotTestY; 
  //   lineTest.vertices[1].y =  rotTestY; 

  //   let graphPoint = two.makeCircle(lineTest.vertices[1].x, rotTestY, 1) ;

  //   // graphPoint.fill =  '#AF2342';
  //   graphPoint.stroke = '#AF2342';
  //   // graphPoint.linewidth = 0.1;
  //   // graphPoint.noStroke(); 
  //   graphPoint.opacity = 1;

  //   graphPoints.push(graphPoint);

  //   for (let point of graphPoints)
  //   {
  //     point.translation.set(point.translation.x+1, point.translation.y)
  //   }

  //   if(graphPoints.length > 900)
  //   {
  //     const removedCircle = graphPoints.shift(); 
  //     two.remove(removedCircle); 

  //   }

  //   circleTest.translation.set(rotTestX, rotTestY);

  //   circleTest.fill =  '#000000';
  //   circleTest.stroke = 'black';
  //   circleTest.linewidth = 1;
  //   circleTest.opacity = 0.5;

  // } )

  // // two.bind("update", function() {
  // //   update(masterGroup[2], 0.02 ); 
  // // } )


    two.bind("update", function() 
    {

      let accum = 0;
      for (let i = 1 ; i < numCycles; i++)
      {
        let n = (i * 2) + 1 ;
        let k = n - 2;

      update(masterGroup[i], k * 0.02 ); 
      update(masterGroup[i], -(accum * 0.02) );
      accum = k ; 
     } 
    } )



      // two.bind("update", function() {
      //         // update(masterGroup[2],  0.05 ); 
      //   update(groupArray[0], 0.05); 
      // } )

}



function mainFunc()
{
  let params = { fullscreen: true};
  let elem = document.getElementById("content");
  let two = new Two(params).appendTo(elem)
  // elem.style.backgroundColor = '#000000';
  document.body.style.backgroundColor = "lightblue"


  const text = renderHeading(two);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 1;
  slider.max = 50;
  slider.value = 10;
  slider.style.position = 'absolute';

  slider.style.top = text.translation.y+50 + "px";
  slider.style.left = text.translation.x + "px";
  document.body.appendChild(slider);




  createElement(two, [500,500,120], slider.value);
  two.play();
  // two.unbind();
  
  
  slider.addEventListener( 'input',  function (event) 
  {

      two.pause();
      two.unbind("update", boundFuncs[0]);
      boundFuncs.pop();
      createElement(two, [500,500,120], slider.value);
      two.play();
    
    },
    false
  );
}


// x, y, radius
// createElement([500,500,120], slider.value);

// let y = [100 , 100 , 100 , -100 , -100, -100,100 , 100 , 100 , -100 , -100, -100];

// console.log(dft(y));



mainFunc();