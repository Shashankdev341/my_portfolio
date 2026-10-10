import React, { useEffect, useRef } from 'react';

// --- Performance Configuration ---
// Detect mobile once at module load for static optimization branching.
// Combines viewport width check with touch detection for tablet edge cases.
const IS_MOBILE = typeof window !== 'undefined' &&
  (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));

const TOTAL_FRAMES = 300;
// Mobile: load every 3rd frame (100 total) to cut decoded memory from ~360MB to ~120MB
const FRAME_STEP = IS_MOBILE ? 3 : 1;
const FRAME_COUNT = Math.ceil(TOTAL_FRAMES / FRAME_STEP);
// Mobile: faster LERP so animation settles quickly and stops burning render cycles
const LERP_FACTOR = IS_MOBILE ? 0.2 : 0.1;
// Mobile: cap DPR at 1.0 — on a 3x display this avoids 9x pixel overhead
const MAX_DPR = IS_MOBILE
  ? 1.0
  : Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 2);

export default function CanvasSequence() {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animFrameRef = useRef(null);

  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const lastDrawSizeRef = useRef({ w: 0, h: 0 });
  const sizeRef = useRef({
    w: typeof window !== 'undefined' ? window.innerWidth : 1000,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // --- Resize Handler ---
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const prev = sizeRef.current;

      // On mobile, ignore small height changes caused by the address bar hiding/showing
      if (Math.abs(currentWidth - prev.w) > 0 || Math.abs(currentHeight - prev.h) > 120) {
        sizeRef.current = { w: currentWidth, h: currentHeight };
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Frame Preloading ---
  useEffect(() => {
    const getFramePath = (index) => {
      const padded = String(index).padStart(3, '0');
      return `/frames/ezgif-frame-${padded}.jpg`;
    };

    const images = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const frameNum = Math.min(i * FRAME_STEP + 1, TOTAL_FRAMES);
      const img = new Image();
      img.decoding = 'async'; // Non-blocking decode on supported browsers
      img.src = getFramePath(frameNum);
      images.push(img);
    }
    imagesRef.current = images;

    // Only allocate offscreen canvas on desktop (needed for pixel masking pipeline)
    if (!IS_MOBILE) {
      offCanvasRef.current = document.createElement('canvas');
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // --- Scroll → Target Frame Mapping ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetFrameRef.current = Math.min(FRAME_COUNT - 1, Math.max(0, progress * (FRAME_COUNT - 1)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Render Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const offCanvas = offCanvasRef.current;
    const offCtx = offCanvas
      ? offCanvas.getContext('2d', { willReadFrequently: true })
      : null;

    // Flat, Giant PORTFOLIO Text Renderer in Layer 1 (Desktop only)
    const drawFlatPortfolioText = (targetCtx, width, height) => {
      const text = 'PORTFOLIO';
      const fontSize = height * 0.75;

      targetCtx.save();
      targetCtx.font = `${fontSize}px 'Bebas Neue', sans-serif`;
      targetCtx.textAlign = 'center';
      targetCtx.textBaseline = 'middle';
      // Set opacity of the PORTFOLIO text to 28%
      targetCtx.globalAlpha = 0.28;
      // Dark rich red matching reference image
      targetCtx.fillStyle = '#90050B';

      targetCtx.translate(width / 2, height * 0.55);
      // Stretch vertically by 1.4x and squeeze horizontally slightly to match the condensed look
      targetCtx.scale(0.8, 1.4);
      targetCtx.fillText(text, 0, 0);
      targetCtx.restore();
    };

    const render = () => {
      // Smooth LERP interpolation toward target
      currentFrameRef.current +=
        (targetFrameRef.current - currentFrameRef.current) * LERP_FACTOR;

      // Snap to target when very close — prevents endless asymptotic micro-updates
      // that would keep the render loop doing work indefinitely
      if (Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.05) {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameIdx = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const w = Math.round(sizeRef.current.w * MAX_DPR);
      const h = Math.round(sizeRef.current.h * MAX_DPR);
      const sizeChanged = canvas.width !== w || canvas.height !== h;

      // PERF: Skip entire redraw when both frame index AND canvas size are unchanged.
      // This is the single biggest win — when user isn't scrolling, render() becomes a no-op.
      if (frameIdx === lastRenderedFrameRef.current && !sizeChanged) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (sizeChanged) {
        canvas.width = w;
        canvas.height = h;
      }

      const img = imagesRef.current[frameIdx];

      // Draw background color explicitly
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      if (img && img.complete && img.naturalWidth > 0) {
        // Fit image so 100% of the head, hair, face, and chin fit completely inside viewport height
        const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
        const drawWidth = Math.floor(img.naturalWidth * scale);
        const drawHeight = Math.floor(img.naturalHeight * scale);
        const x = Math.floor((w - drawWidth) / 2);
        const y = Math.floor((h - drawHeight) / 2);

        if (IS_MOBILE) {
          // =====================================================
          // MOBILE PATH — Maximum performance, zero pixel masking
          // =====================================================
          // Skip the PORTFOLIO background text and the expensive
          // per-pixel alpha masking pipeline entirely.
          // The frame's black background blends naturally with the
          // page's #050507 dark background — visually seamless.
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
        } else {
          // =====================================================
          // DESKTOP PATH — Full compositing pipeline (unchanged)
          // =====================================================

          // 1. Render Flat Red PORTFOLIO Text in Layer 1 (Background)
          drawFlatPortfolioText(ctx, w, h);

          // 2. Render Full-Face Character Frame Animation in Layer 2
          if (offCanvas && offCtx) {
            if (offCanvas.width !== drawWidth || offCanvas.height !== drawHeight) {
              offCanvas.width = drawWidth;
              offCanvas.height = drawHeight;
            }

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
                const threshold = 2 + distSq * 12;

                if (r < threshold && g < threshold && b < threshold) {
                  data32[i] = 0; // Make background transparent
                }
                i++;
              }
            }

            offCtx.putImageData(imgData, 0, 0);
            lastDrawSizeRef.current = { w: drawWidth, h: drawHeight };

            ctx.save();
            // Fully opaque so the character solidly blocks the text behind him
            ctx.globalAlpha = 1.0;
            ctx.drawImage(offCanvas, x, y);
            ctx.restore();
          }
        }

        // Only mark frame as rendered AFTER the image was actually drawn.
        // If the image hasn't loaded yet, we leave lastRenderedFrameRef at -1
        // so the render loop keeps retrying until the first frame appears.
        lastRenderedFrameRef.current = frameIdx;
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
