let socket;
let color = '#000';
let strokeWidth = 4;
const size = 700;

function setup() {
  // Creating canvas
  createCanvas(size, size);
  background(255);

  // Start the socket connection
  socket = io.connect();

  // Socket drawing callback
  socket.on('mouse', data => {
    stroke(data.color);
    strokeWeight(data.strokeWidth);
    line(data.x, data.y, data.px, data.py)
  });

  // Socket clear canvas callback
  socket.on('clear', () => background(255));

  // Select buttons and inputs through p5.dom
  const colorPicker = select('#color-picker');
  const colorBtn = select('#color-btn');
  const colorHolder = select('#color-holder');
  colorHolder.style('background-color', 'white');
  const clearCanvasBtn = select('#clear-canvas');
  const strokeWidthPicker = select('#stroke-width-picker');
  const strokeBtn = select('#stroke-btn');

  // Add "on click" event listener to the color picking button
  colorBtn.mouseClicked(() => {
    // Check if the input is a valid hex color
    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorPicker.value())) {
      color = colorPicker.value();
      colorHolder.style('background-color', color);
    } else {
      console.log('Enter a valid hex value');
    }
  });

  // Add "on click" event listener to the stroke weight picking button
  strokeBtn.mouseClicked(() => {
    const width = parseInt(strokeWidthPicker.value());
    if (width > 0) strokeWidth = width;
  });

  // Add "on click" event listener to the canvas clearing button
  clearCanvasBtn.mouseClicked(() => {
    background(255);
    socket.emit('clear');
  });
}

function mouseDragged() {
  // Draw
  stroke(color);
  strokeWeight(strokeWidth);
  line(mouseX, mouseY, pmouseX, pmouseY);

  // Send mouse coordinates
  sendMouseData(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendMouseData(x, y, px, py) {
  const data = { x, y, px, py, color, strokeWidth };
  socket.emit('mouse', data)
}