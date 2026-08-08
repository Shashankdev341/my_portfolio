import React, { useEffect, useRef } from 'react';

const FRAME_COUNT = 300;
const LERP_FACTOR = 0.1;

export default function CanvasSequence({ scrollProgress }) {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animFrameRef = useRef(null);
  
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  useEffect(() => {
    // Format frame index with 3 leading zeros
    const getFramePath = (index) => {
      const padded = String(index).padStart(3, '0');
      return `/frames/ezgif-frame-${padded}.jpg`;
    };

    // Preload images
    const images = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images.push(img);
    }
    imagesRef.current = images;

    // Create offscreen canvas for alpha masking
    const offCanvas = document.createElement('canvas');
    offCanvasRef.current = offCanvas;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update target frame when scrollProgress changes
  useEffect(() => {
    targetFrameRef.current = Math.min(FRAME_COUNT - 1, Math.max(0, scrollProgress * (FRAME_COUNT - 1)));
  }, [scrollProgress]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // optimize
    const offCanvas = offCanvasRef.current;
    if (!offCanvas) return;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true }); // optimize getImageData

    // Flat, Giant PORTFOLIO Text Renderer in Layer 1 (Matching Reference Image)
    const drawFlatPortfolioText = (targetCtx, width, height) => {
      const text = "PORTFOLIO";
      
      // Calculate font size to span most of the screen vertically and horizontally
      const fontSize = height * 0.75; 
      
      targetCtx.save();
      // Using Bebas Neue, but we'll scale it vertically to make it even taller like the reference
      targetCtx.font = `${fontSize}px 'Bebas Neue', sans-serif`;
      targetCtx.textAlign = 'center';
      targetCtx.textBaseline = 'middle';
      
      // Set opacity of the PORTFOLIO text to 28%
      targetCtx.globalAlpha = 0.28;
      
      // Dark rich red matching reference image
      targetCtx.fillStyle = '#90050B';
      
      const x = width / 2;
      const y = height * 0.55; // Slightly lowered

      targetCtx.translate(x, y);
      
      // Stretch vertically by 1.4x and squeeze horizontally slightly to match the condensed look
      targetCtx.scale(0.8, 1.4);
      
      // Letter spacing needs to be tight. Canvas fillText doesn't support letter-spacing easily, 
      // but Bebas Neue is naturally condensed. If we just draw the word:
      targetCtx.fillText(text, 0, 0);

      targetCtx.restore();
    };

    const render = () => {
      // Lerp frame index for smooth momentum animation
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * LERP_FACTOR;
      const frameIdx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(currentFrameRef.current)));
      const img = imagesRef.current[frameIdx];

      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      // Draw background color explicitly
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      // 1. Render Flat Red PORTFOLIO Text in Layer 1 (Background)
      drawFlatPortfolioText(ctx, w, h);

      // 2. Render Full-Face Character Frame Animation in Layer 2 (Foreground over text)
      if (img && img.complete && img.naturalWidth > 0) {
        // Fit image so 100% of the head, hair, face, and chin fit completely inside viewport height
        const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
        const drawWidth = Math.floor(img.naturalWidth * scale);
        const drawHeight = Math.floor(img.naturalHeight * scale);
        
        if (offCanvas.width !== drawWidth || offCanvas.height !== drawHeight) {
          offCanvas.width = drawWidth;
          offCanvas.height = drawHeight;
        }

        const x = Math.floor((w - drawWidth) / 2);
        const y = Math.floor((h - drawHeight) / 2);

        // Draw to offscreen canvas
        offCtx.clearRect(0, 0, drawWidth, drawHeight);
        offCtx.drawImage(img, 0, 0, drawWidth, drawHeight);

        // Optimized subject pixel masking using Uint32Array
        const imgData = offCtx.getImageData(0, 0, drawWidth, drawHeight);
        const data32 = new Uint32Array(imgData.data.buffer);
        
        const centerX = drawWidth / 2;
        const centerY = drawHeight / 2;
        let i = 0;

        for (let py = 0; py < drawHeight; py++) {
          const dy = (py - centerY) / centerY;
          const dySq = dy * dy;
          for (let px = 0; px < drawWidth; px++) {
            const dx = (px - centerX) / centerX;
            const distSq = dx * dx + dySq;
            
            const pixel = data32[i];
            const r = pixel & 0xff;
            const g = (pixel >> 8) & 0xff;
            const b = (pixel >> 16) & 0xff;
            
            // Spatial thresholding:
            // Center of screen (character): Threshold is ~2 (only removes absolute black, protecting dark clothes/hair)
            // Edges of screen (background): Threshold is ~14+ (clears all JPEG background compression artifacts)
            const threshold = 2 + (distSq * 12);
            
            if (r < threshold && g < threshold && b < threshold) {
              data32[i] = 0; // Make background transparent
            }
            i++;
          }
        }

        offCtx.putImageData(imgData, 0, 0);

        ctx.save();
        // Fully opaque so the character solidly blocks the text behind him
        ctx.globalAlpha = 1.0;
        ctx.drawImage(offCanvas, x, y);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return <canvas id="scroll-canvas" ref={canvasRef} />;
}
