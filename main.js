const FRAME_COUNT = 300;
const LERP_FACTOR = 0.1; // Smooth momentum factor

const canvas = document.getElementById('scroll-canvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loader-progress');

// Offscreen canvas for precise subject opacity masking
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');

const images = [];
let loadedCount = 0;
let targetFrameIndex = 0;
let currentFrameIndex = 0;
let isFirstFrameRendered = false;

// Format frame index with 3 leading zeros (e.g. 1 -> "001")
function getFramePath(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `/frames/ezgif-frame-${paddedIndex}.jpg`;
}

// Render 3D Curved Arc "PORTFOLIO" Text with tight character spacing ensuring 100% letter visibility across the screen
function draw3DCurvedPortfolioText(targetCtx, canvasWidth, canvasHeight) {
  const text = "PORTFOLIO";
  const letters = text.split("");
  const total = letters.length;
  const mid = (total - 1) / 2;

  // Calculate font size & tight character spacing so all 9 letters fit inside 80% of screen width
  const fontSize = Math.min(canvasWidth * 0.135, canvasHeight * 0.28);
  const letterSpacing = fontSize * 0.58; // Tightened character spacing
  const totalTextWidth = (total - 1) * letterSpacing;
  const startX = (canvasWidth - totalTextWidth) / 2;
  const baseY = canvasHeight * 0.08;

  targetCtx.save();
  targetCtx.font = `900 ${fontSize}px 'Bebas Neue', sans-serif`;
  targetCtx.textAlign = 'center';
  targetCtx.textBaseline = 'middle';

  letters.forEach((letter, i) => {
    const distFromCenter = (i - mid) / mid; // Normalized -1 to +1
    
    // 3D Arc Curve Displacement (curving gracefully downwards)
    const curveY = Math.pow(distFromCenter, 2) * (fontSize * 0.18);
    
    // 3D Perspective Scale (center letters slightly larger)
    const scale3D = 1 - Math.pow(distFromCenter, 2) * 0.06;
    
    // 3D Rotation Angle for wrapping curve effect
    const angle = distFromCenter * 0.10;

    const x = startX + (i * letterSpacing);
    const y = baseY + curveY;

    targetCtx.save();
    targetCtx.translate(x, y);
    targetCtx.rotate(angle);
    targetCtx.scale(scale3D, scale3D);

    // 1. 3D Text Extrusion Layers (Dark Crimson Shadow Depth)
    for (let depth = 8; depth >= 1; depth--) {
      targetCtx.fillStyle = '#4A060A';
      targetCtx.fillText(letter, 0, depth * 1.2);
    }

    // 2. High-Opacity Vibrant Neon Red Text
    targetCtx.fillStyle = '#FF1825';
    targetCtx.shadowColor = 'rgba(255, 24, 37, 0.95)';
    targetCtx.shadowBlur = 35;
    targetCtx.fillText(letter, 0, 0);

    targetCtx.restore();
  });

  targetCtx.restore();
}

// Render pipeline combining 3D Curved Text + Subject Layer with tuned opacity for maximum text visibility
function drawPortfolioTextBehindSubject(img) {
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  // Sync offscreen canvas size
  if (offCanvas.width !== canvasWidth || offCanvas.height !== canvasHeight) {
    offCanvas.width = canvasWidth;
    offCanvas.height = canvasHeight;
  }

  // 1. Clear Main Canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 2. LAYER 1: Render High-Opacity 3D Curved PORTFOLIO Text in Background
  draw3DCurvedPortfolioText(ctx, canvasWidth, canvasHeight);

  // 3. LAYER 2: Prepare Subject Image on Offscreen Canvas
  offCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;
  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;

  offCtx.drawImage(img, x, y, drawWidth, drawHeight);

  // 4. Precise Subject Alpha Masking
  const imgData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imgData.data;

  const frameLeft = Math.floor(x);
  const frameRight = Math.ceil(x + drawWidth);

  for (let py = 0; py < canvasHeight; py++) {
    for (let px = 0; px < canvasWidth; px++) {
      const idx = (py * canvasWidth + px) * 4;

      // Outside frame bounds -> 100% transparent so background 3D text is visible
      if (px < frameLeft || px > frameRight) {
        data[idx + 3] = 0;
        continue;
      }

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luma = r * 0.299 + g * 0.587 + b * 0.114;

      const relX = (px - frameLeft) / drawWidth;

      // Subject core region (hair, sunglasses, face, neck, shirt)
      const isSubjectRegion = relX > 0.14 && relX < 0.86;

      if (isSubjectRegion) {
        // Keep hair and head solid over text
        if (luma < 3) {
          data[idx + 3] = 0;
        } else {
          data[idx + 3] = 255;
        }
      } else {
        // Outer side margins: fade out dark background pixels to show 3D text
        if (luma < 25) {
          data[idx + 3] = Math.max(0, Math.floor((luma / 25) * 255));
        }
      }
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  // 5. Draw Subject with tuned opacity (0.88) so 3D text behind is vibrant and clear
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.drawImage(offCanvas, 0, 0);
  ctx.restore();
}

// Adjust canvas resolution for crisp rendering across high-DPI screens
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  const frameToDraw = Math.round(currentFrameIndex);
  if (images[frameToDraw]) {
    drawPortfolioTextBehindSubject(images[frameToDraw]);
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Preload all 300 images
for (let i = 1; i <= FRAME_COUNT; i++) {
  const img = new Image();
  img.src = getFramePath(i);
  
  img.onload = () => {
    loadedCount++;
    const progress = Math.round((loadedCount / FRAME_COUNT) * 100);
    if (loaderProgress) {
      loaderProgress.style.width = `${progress}%`;
    }

    // Render frame 1 immediately as soon as loaded
    if (i === 1 && !isFirstFrameRendered) {
      isFirstFrameRendered = true;
      drawPortfolioTextBehindSubject(img);
    }

    if (loadedCount >= FRAME_COUNT) {
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
      }, 200);
    }
  };

  img.onerror = () => {
    console.error(`Failed to load frame ${i} at path ${img.src}`);
  };

  images.push(img);
}

// Calculate scroll progress ratio
function updateScroll() {
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
  
  targetFrameIndex = scrollFraction * (FRAME_COUNT - 1);
}

window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', updateScroll, { passive: true });
document.addEventListener('DOMContentLoaded', updateScroll);
updateScroll();

// Animation render loop with LERP for ultra-smooth transitions
function renderLoop() {
  // Smoothly interpolate current index towards target index
  currentFrameIndex += (targetFrameIndex - currentFrameIndex) * LERP_FACTOR;

  const frameToRender = Math.min(
    FRAME_COUNT - 1,
    Math.max(0, Math.round(currentFrameIndex))
  );

  if (images[frameToRender] && images[frameToRender].complete && images[frameToRender].naturalWidth > 0) {
    drawPortfolioTextBehindSubject(images[frameToRender]);
  }

  requestAnimationFrame(renderLoop);
}

// Start animation loop
requestAnimationFrame(renderLoop);
