const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector('.toolbar').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let painting = false;
let tool = 'draw';
let color = document.getElementById('color').value;
let thickness = document.getElementById('thickness').value;
let startX, startY;

document.getElementById('color').addEventListener('input', (e) => color = e.target.value);
document.getElementById('thickness').addEventListener('input', (e) => thickness = e.target.value);
document.getElementById('tool').addEventListener('change', (e) => tool = e.target.value);

document.getElementById('clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  localStorage.removeItem('drawing');
});

document.getElementById('download').addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = dataURL;
  link.click();
});

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  startX = e.clientX - canvas.offsetLeft;
  startY = e.clientY - canvas.offsetTop;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
});

canvas.addEventListener('mouseup', () => {
  if (tool === 'draw' || tool === 'erase') {
    painting = false;
    ctx.beginPath();
    saveDrawing();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!painting) return;

  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.strokeStyle = tool === 'erase' ? '#ffffff' : color;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  if (tool === 'draw') {
    ctx.lineTo(x, y);
    ctx.stroke();
    saveDrawing();
  }
});

canvas.addEventListener('click', (e) => {
  if (tool === 'text') {
    const text = prompt('Geben Sie den Text ein:');
    if (text) {
      ctx.fillStyle = color;
      ctx.font = `${thickness * 2}px Arial`;
      ctx.fillText(text, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      saveDrawing();
    }
  } else if (tool === 'line') {
    drawLine(e);
  } else if (tool === 'rectangle') {
    drawRectangle(e);
  } else if (tool === 'circle') {
    drawCircle(e);
  }
});

function drawLine(e) {
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  saveDrawing();
}

function drawRectangle(e) {
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(startX, startY, e.clientX - canvas.offsetLeft - startX, e.clientY - canvas.offsetTop - startY);
  ctx.stroke();
  saveDrawing();
}

function drawCircle(e) {
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;
  ctx.beginPath();
  const radius = Math.sqrt(Math.pow(e.clientX - canvas.offsetLeft - startX, 2) + Math.pow(e.clientY - canvas.offsetTop - startY, 2));
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.stroke();
  saveDrawing();
}

function saveDrawing() {
  const dataURL = canvas.toDataURL();
  localStorage.setItem('drawing', dataURL);
}

// Laden des gespeicherten Bildes beim Start
const savedDrawing = localStorage.getItem('drawing');
if (savedDrawing) {
  const img = new Image();
  img.src = savedDrawing;
  img.onload = () => ctx.drawImage(img, 0, 0);
}
