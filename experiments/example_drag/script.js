// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    },
    {
      "type": "lab.plugins.Transmit",
      "url": "\u002Fsave",
      "encoding": "form",
      "updates": {
        "incremental": false
      },
      "callbacks": {
        "setup": function(){this.headers["X-CSRFToken"]=window.csrf_token},
        "full": function(e){e&&e.ok&&(window.location="/next")}
      },
      "path": undefined
    }
  ],
  "metadata": {
    "title": "Example_Drag",
    "description": "",
    "repository": "",
    "contributors": ""
  },
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 727.47,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "Drag the dot into a position in the ring: click to start!",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "click": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Start"
    },
    {
      "type": "lab.canvas.Screen",
      "content": [],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {},
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
circleX = [0, 100]
circleY = [150, 150]

colors = ['red', 'blue', 'magenta'];

radi = 44
dotSize = 10

// define center of the currently tested item
testX = circleX[0];
testY = circleY[0];

dotDist = 30

// define that the dot will appear there
relX = testX;
relY = testY;

// at onset, participant is not dragging the dot
isDragging = false

// Define what happens when mouse is pressed down
this.options.events['mousedown'] = (e) => {
  if(!isDragging){
  //tell the browser we are handling the event
    e.preventDefault();
    e.stopPropagation();
    // relative position of the mouse in relation to screen center
[mouseX, mouseY] = this.transformInverse([e.clientX, e.clientY])
    // check whether mouse is on the shape
    distance = Math.round(Math.abs(Math.sqrt(Math.pow((mouseX-relX), 2)+Math.abs(Math.pow((mouseY-relY), 2)))));
    console.log(distance)
    if(distance<dotDist){         
        // set the isDragging flag
        isDragging=true;
        console.log(isDragging);      
        }          
      }
  
}

// Define what happens when mouse is moved (if dragging is on)
this.options.events['mousemove'] = (e) => {
  // return if we're not dragging
  if(!isDragging){return;}
  //tell the browser we are handling the event
  e.preventDefault();
  e.stopPropagation();
  // relative position of the mouse in relation to screen center
  [mouseX, mouseY] = this.transformInverse([e.clientX, e.clientY])
  
  
  relX = Math.round(mouseX);
  relY = Math.round(mouseY);  
}

// Define what happens when mouse is pressed down
this.options.events['mouseup'] = (e) => {
  // return if we're not dragging
  if(!isDragging){return;}
  //tell the browser we are handling the event
  e.preventDefault();
  e.stopPropagation();
  // the drag is over -- clear the isDragging flag
  isDragging=false; 
  
    // compute angle selected
    angle = getDirection(relX,relY, testX, testY);
    console.log(angle);
    
    // because of the way the triangle drawing is oriented, position is always at 90 degrees offset
    responseAngle = (angle+180)%360; 
    console.log(responseAngle);
    this.end();     
}

function getDirection(x1, y1, pX, pY) {
    angle = Math.atan2(pY-y1, pX-x1) * 180 / Math.PI;
    if(angle < 0){angle += 360}    
    return (angle);
}

// Function to draw the content as defined via the visual builder
// (this is digging in the lab.js internals, which may change
// sometime)
const baseRenderFunction = lab.util.canvas.makeRenderFunction(
  this.options.content.filter(c => c.type !== 'aoi'),
  this.internals.controller.cache
)

/************
 * Render
 */
// function to draw the ring-dot stimuli
this.options.renderFunction = function(ts, canvas, ctx, obj) {

i = 0; // define the item to be recalled
// Render the base layer
baseRenderFunction(ts, canvas, ctx, obj);

// Draw the ring
drawRing(circleX, circleY, radi, colors,i);
// Draw edge dot
drawDot(relX, relY, dotSize, colors, i);
// Queue rerender on next frame
this.queueAnimationFrame()
 

  function drawRing(X, Y, dotSize, colors, index){ 
    ctx.beginPath();
    ctx.arc(X[index], Y[index], dotSize, 0, 2 * Math.PI, false);  
    ctx.closePath();
    myColor = colors[index];
    ctx.lineWidth = 3;
    ctx.strokeStyle = myColor;
    ctx.stroke();
  }

  function drawDot(dotX, dotY, dotSize, colors, index){ 
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotSize, 0, 2 * Math.PI, false);  
    ctx.closePath();
    myColor = colors[index];
    ctx.fillStyle = myColor;
    ctx.fill();
  }

  
}

}
      },
      "title": "Drag 1"
    }
  ]
})

// Let's go!
study.run()