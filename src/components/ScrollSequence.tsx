import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  /** Total number of frames in the sequence. */
  frameCount: number;
  /** Builds the URL for a given 1-based frame index. */
  pathFor: (index: number) => string;
}

/**
 * Cinematic scroll-driven image sequence used as a FIXED, full-page backdrop.
 *
 * The canvas is pinned to the viewport (position: fixed) and sits behind all
 * page content. As the visitor scrolls the whole document top -> bottom, the
 * frames advance 1 -> frameCount, so the footage scrubs across the entire page
 * (not just the hero). Page sections render on top; transparent sections reveal
 * the footage while solid/dark sections naturally cover it.
 */
export default function ScrollSequence({ frameCount, pathFor }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Preload the first useful frames immediately, then continue in small batches.
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    let batchTimer: number | undefined;
    const imgs: HTMLImageElement[] = new Array(frameCount);

    const loadFrame = (index: number) => {
      if (cancelled || imgs[index - 1]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = pathFor(index);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
      };
      imgs[index - 1] = img;
    };

    const firstBatch = Math.min(12, frameCount);
    for (let i = 1; i <= firstBatch; i++) {
      loadFrame(i);
    }

    let nextFrame = firstBatch + 1;
    const loadNextBatch = () => {
      for (let count = 0; count < 8 && nextFrame <= frameCount; count += 1) {
        loadFrame(nextFrame);
        nextFrame += 1;
      }
      if (!cancelled && nextFrame <= frameCount) {
        batchTimer = window.setTimeout(loadNextBatch, 160);
      }
    };
    batchTimer = window.setTimeout(loadNextBatch, 600);

    imagesRef.current = imgs;
    return () => {
      cancelled = true;
      if (batchTimer) window.clearTimeout(batchTimer);
    };
  }, [frameCount, pathFor]);

  // Respect reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Draw a frame covering the whole canvas (object-fit: cover behaviour).
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Size the canvas to the viewport with devicePixelRatio for crispness.
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    drawFrame(currentFrameRef.current < 0 ? 0 : currentFrameRef.current);
  };

  // Map whole-document scroll position -> frame index.
  useEffect(() => {
    const computeFrame = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      const frame = reducedMotion
        ? 0
        : Math.min(frameCount - 1, Math.round(progress * (frameCount - 1)));
      if (frame !== currentFrameRef.current) {
        currentFrameRef.current = frame;
        drawFrame(frame);
      }
    };
    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(computeFrame);
      }
    };
    const onResize = () => {
      resizeCanvas();
      computeFrame();
    };
    resizeCanvas();
    computeFrame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // The document height changes as images/sections load, which shifts the
    // scroll->frame mapping; recompute whenever the body resizes.
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => computeFrame());
      ro.observe(document.body);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, reducedMotion]);

  // Redraw as soon as the first frames decode.
  useEffect(() => {
    if (loaded > 0) {
      resizeCanvas();
      drawFrame(currentFrameRef.current < 0 ? 0 : currentFrameRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const ready = loaded >= Math.min(8, frameCount);
  const canvasStyle: React.CSSProperties = {
    opacity: ready ? 1 : 0,
    transition: 'opacity 0.6s ease',
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Cinematic frame-sequence backdrop pinned to the viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full select-none"
        style={canvasStyle}
      />
      {/* Warm veil + soft vertical gradient so copy stays readable over the footage */}
      <div className="absolute inset-0 bg-[#FCFAF7]/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCFAF7]/25 via-transparent to-[#FCFAF7]/55" />

      {/* Loading shimmer until the first frames decode */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FCFAF7]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#9C7346]/30 border-t-[#9C7346]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#9C7346]">
              Brewing the scene
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
