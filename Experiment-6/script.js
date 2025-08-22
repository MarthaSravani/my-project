// ===== Helpers =====
const svg = document.getElementById('board');
const colorEl = document.getElementById('color');
const widthEl = document.getElementById('width');
const widthVal = document.getElementById('widthVal');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const toolRadios = [...document.querySelectorAll('input[name="tool"]')];

let tool = 'pen';        // 'pen' | 'line' | 'rect'
let drawing = false;
let activeEl = null;     // currently drawn SVG element
let start = null;        // {x, y}
const history = [];      // stack for undo

widthEl.addEventListener('input', () => widthVal.textContent = widthEl.value);

// Convert client coords to SVG coords
function svgPoint(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// ===== Tool switching =====
toolRadios.forEach(r => r.addEventListener('change', e => tool = e.target.value));

// ===== Drawing logic (Pointer Events for mouse + touch) =====
svg.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  svg.setPointerCapture(e.pointerId);
  drawing = true;
  const { x, y } = svgPoint(e);
  start = { x, y };

  const stroke = colorEl.value;
  const width = Number(widthEl.value);

  if (tool === 'pen') {
    // Freehand path using 'M' + series of 'L'
    activeEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    activeEl.setAttribute('class', 'path-stroke');
    activeEl.setAttribute('stroke', stroke);
    activeEl.setAttribute('stroke-width', width);
    activeEl.setAttribute('d', `M ${x} ${y}`);
    svg.appendChild(activeEl);
  } else if (tool === 'line') {
    activeEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    activeEl.setAttribute('class', 'shape-stroke');
    activeEl.setAttribute('x1', x); activeEl.setAttribute('y1', y);
    activeEl.setAttribute('x2', x); activeEl.setAttribute('y2', y);
    activeEl.setAttribute('stroke', stroke);
    activeEl.setAttribute('stroke-width', width);
    svg.appendChild(activeEl);
  } else if (tool === 'rect') {
    activeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    activeEl.setAttribute('class', 'shape-stroke');
    activeEl.setAttribute('x', x); activeEl.setAttribute('y', y);
    activeEl.setAttribute('width', 0); activeEl.setAttribute('height', 0);
    activeEl.setAttribute('fill', 'transparent');
    activeEl.setAttribute('stroke', stroke);
    activeEl.setAttribute('stroke-width', width);
    svg.appendChild(activeEl);
  }
});

svg.addEventListener('pointermove', (e) => {
  if (!drawing || !activeEl) return;
  const { x, y } = svgPoint(e);

  if (tool === 'pen') {
    // Append segment to path
    const d = activeEl.getAttribute('d') + ` L ${x} ${y}`;
    activeEl.setAttribute('d', d);
  } else if (tool === 'line') {
    activeEl.setAttribute('x2', x);
    activeEl.setAttribute('y2', y);
  } else if (tool === 'rect') {
    const w = x - start.x;
    const h = y - start.y;
    activeEl.setAttribute('x', Math.min(start.x, x));
    activeEl.setAttribute('y', Math.min(start.y, y));
    activeEl.setAttribute('width', Math.abs(w));
    activeEl.setAttribute('height', Math.abs(h));
  }
});

function finishStroke() {
  if (!drawing || !activeEl) return;
  history.push(activeEl);  // push for undo
  drawing = false;
  activeEl = null;
  start = null;
}

svg.addEventListener('pointerup', finishStroke);
svg.addEventListener('pointercancel', finishStroke);
svg.addEventListener('pointerleave', finishStroke);

// ===== Utilities: Undo & Clear =====
undoBtn.addEventListener('click', () => {
  const el = history.pop();
  if (el && el.parentNode === svg) svg.removeChild(el);
});

clearBtn.addEventListener('click', () => {
  history.length = 0;
  while (svg.lastChild) svg.removeChild(svg.lastChild);
});

// Optional: keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') undoBtn.click();
});
