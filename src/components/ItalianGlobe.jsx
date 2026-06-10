import React, { useRef, useEffect } from 'react';

const ItalianGlobe = ({ size = 480 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.41;

    const NUM_LAT = 11;
    const NUM_LON = 14;
    const STEPS = 120;

    // Italian flag colors
    const GREEN  = [0, 146, 70];
    const RED    = [206, 43, 55];
    const WHITE  = [255, 255, 255];

    let rotation = 0;
    let animId;

    const project = (phi, lambda) => {
      const cosPhi = Math.cos(phi);
      const x = cosPhi * Math.cos(lambda + rotation);
      const y = Math.sin(phi);
      const z = cosPhi * Math.sin(lambda + rotation);
      return { px: cx + x * R, py: cy - y * R, z };
    };

    const segmentColor = (r, g, b, depth) => {
      const alpha = Math.max(0.04, ((depth + 1) / 2) * 0.7);
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Subtle outer glow ring
      const grad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.1);
      grad.addColorStop(0, 'rgba(0,146,70,0.04)');
      grad.addColorStop(1, 'rgba(0,146,70,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Latitude rings (green)
      for (let i = 1; i < NUM_LAT; i++) {
        const phi = (i / NUM_LAT) * Math.PI - Math.PI / 2;
        for (let j = 0; j < STEPS; j++) {
          const lam1 = (j / STEPS) * Math.PI * 2;
          const lam2 = ((j + 1) / STEPS) * Math.PI * 2;
          const p1 = project(phi, lam1);
          const p2 = project(phi, lam2);
          const depth = (p1.z + p2.z) / 2;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = segmentColor(...GREEN, depth);
          ctx.lineWidth = depth > 0 ? 1.0 : 0.45;
          ctx.stroke();
        }
      }

      // Longitude arcs — green with 2 Italian red accents and 1 white highlight
      for (let i = 0; i < NUM_LON; i++) {
        const lambda = (i / NUM_LON) * Math.PI * 2;
        const isRed   = i === 0 || i === Math.floor(NUM_LON * 0.5);
        const isWhite = i === Math.floor(NUM_LON * 0.25) || i === Math.floor(NUM_LON * 0.75);
        const [r, g, b] = isRed ? RED : isWhite ? WHITE : GREEN;

        for (let j = 0; j < STEPS; j++) {
          const phi1 = (j / STEPS) * Math.PI - Math.PI / 2;
          const phi2 = ((j + 1) / STEPS) * Math.PI - Math.PI / 2;
          const p1 = project(phi1, lambda);
          const p2 = project(phi2, lambda);
          const depth = (p1.z + p2.z) / 2;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = segmentColor(r, g, b, depth);
          ctx.lineWidth = depth > 0 ? 1.1 : 0.45;
          ctx.stroke();
        }
      }

      // Small dot at front pole intersection
      const frontPole = project(0, 0);
      ctx.beginPath();
      ctx.arc(frontPole.px, frontPole.py, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,146,70,0.6)';
      ctx.fill();

      rotation += 0.004;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
    />
  );
};

export default ItalianGlobe;
