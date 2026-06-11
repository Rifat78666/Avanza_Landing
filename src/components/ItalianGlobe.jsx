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

    const isMobile = window.innerWidth <= 768;

    const NUM_LAT = isMobile ? 36 : 16;
    const NUM_LON = isMobile ? 60 : 24;
    const STEPS = 180;

    // Colors
    const GREEN = [0, 180, 80];
    const RED   = [220, 50, 60];
    const WHITE = [255, 255, 255];
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
      const alpha = Math.max(0.08, ((depth + 1) / 2) * 0.85 + 0.1);
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      if (isMobile) {
        // Faint blue glow behind globe for mobile
        const grad = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.1);
        grad.addColorStop(0, 'rgba(14,165,233,0.08)');
        grad.addColorStop(0.5, 'rgba(14,165,233,0.03)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bold outer glow for desktop
        const grad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.2);
        grad.addColorStop(0, 'rgba(0,180,80,0.06)');
        grad.addColorStop(0.5, 'rgba(0,180,80,0.03)');
        grad.addColorStop(0.8, 'rgba(220,50,60,0.02)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Latitude rings
      for (let i = 1; i < NUM_LAT; i++) {
        const phi = (i / NUM_LAT) * Math.PI - Math.PI / 2;
        
        let color;
        if (isMobile) {
          color = INDIMA_BLUE;
        } else {
          const latFraction = i / NUM_LAT;
          if (latFraction < 0.35) color = GREEN;
          else if (latFraction < 0.65) color = WHITE;
          else color = RED;
        }

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
          ctx.lineWidth = isMobile ? (depth > 0 ? 0.6 : 0.2) : (depth > 0 ? 1.4 : 0.6);
          ctx.stroke();
        }
      }

      // Longitude arcs
      for (let i = 0; i < NUM_LON; i++) {
        const lambda = (i / NUM_LON) * Math.PI * 2;
        
        let color;
        if (isMobile) {
          color = INDIMA_BLUE;
        } else {
          const lonFraction = i / NUM_LON;
          if (lonFraction < 0.33) color = GREEN;
          else if (lonFraction < 0.66) color = WHITE;
          else color = RED;
        }

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
          ctx.lineWidth = isMobile ? (depth > 0 ? 0.6 : 0.2) : (depth > 0 ? 1.5 : 0.6);
          ctx.stroke();
        }
      }

      if (!isMobile) {
        // Equator ring — extra bold green
        const equPhi = 0;
        for (let j = 0; j < STEPS; j++) {
          const lam1 = (j / STEPS) * Math.PI * 2;
          const lam2 = ((j + 1) / STEPS) * Math.PI * 2;
          const p1 = project(equPhi, lam1);
          const p2 = project(equPhi, lam2);
          const depth = (p1.z + p2.z) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = segmentColor(...GREEN, depth);
          ctx.lineWidth = depth > 0 ? 3 : 1;
          ctx.stroke();
        }
      }

      // Slowly rotate
      rotation -= 0.002;
      animId = requestAnimationFrame(draw);
    };

    draw();

    // Listen for resize to update isMobile state correctly if they rotate device
    const handleResize = () => {
      // Just force a re-render or let it be handled by next mount. 
      // It's mostly fine if they don't resize across the 768px threshold.
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
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
