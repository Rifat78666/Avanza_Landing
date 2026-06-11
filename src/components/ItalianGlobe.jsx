import React, { useRef, useEffect } from 'react';

const ItalianGlobe = ({ size = 600 }) => {
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
    const R = size * 0.44;

    const NUM_LAT = 36;
    const NUM_LON = 60;
    const STEPS = 180;

    // Indima's vibrant light blue color
    const INDIMA_BLUE = [14, 165, 233];

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
      // Much higher opacity — front lines fully visible, back lines still faintly visible
      const alpha = Math.max(0.08, ((depth + 1) / 2) * 0.85 + 0.1);
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Faint blue glow behind globe
      const grad = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.1);
      grad.addColorStop(0, 'rgba(14,165,233,0.08)');
      grad.addColorStop(0.5, 'rgba(14,165,233,0.03)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Latitude rings
      for (let i = 1; i < NUM_LAT; i++) {
        const phi = (i / NUM_LAT) * Math.PI - Math.PI / 2;
        const color = INDIMA_BLUE;

        for (let j = 0; j < STEPS; j++) {
          const lam1 = (j / STEPS) * Math.PI * 2;
          const lam2 = ((j + 1) / STEPS) * Math.PI * 2;
          const p1 = project(phi, lam1);
          const p2 = project(phi, lam2);
          const depth = (p1.z + p2.z) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = segmentColor(...color, depth);
          // Very thin lines to match Indima style
          ctx.lineWidth = depth > 0 ? 0.6 : 0.2;
          ctx.stroke();
        }
      }

      // Longitude arcs
      for (let i = 0; i < NUM_LON; i++) {
        const lambda = (i / NUM_LON) * Math.PI * 2;
        const color = INDIMA_BLUE;

        for (let j = 0; j < STEPS; j++) {
          const phi1 = (j / STEPS) * Math.PI - Math.PI / 2;
          const phi2 = ((j + 1) / STEPS) * Math.PI - Math.PI / 2;
          const p1 = project(phi1, lambda);
          const p2 = project(phi2, lambda);
          const depth = (p1.z + p2.z) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = segmentColor(...color, depth);
          ctx.lineWidth = depth > 0 ? 0.6 : 0.2;
          ctx.stroke();
        }
      }

      // Slowly rotate
      rotation -= 0.002;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};

export default ItalianGlobe;
