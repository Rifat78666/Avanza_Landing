import React, { useRef, useEffect } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Resize handler
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial setup
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse interaction
    const mouse = { x: null, y: null, radius: 150 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle settings
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100;
    const connectionRadius = 140;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() * 1 - 0.5) * 1.5;
        this.speedY = (Math.random() * 1 - 0.5) * 1.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        
        // Randomly assign vibrant color to some nodes
        this.isSpecial = Math.random() > 0.85;
      }
      
      update() {
        // Move
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Mouse interaction - gentle attraction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const ease = 0.05; // Make the movement smooth not jerky
            
            this.x += forceDirectionX * force * ease * 10;
            this.y += forceDirectionY * force * ease * 10;
          }
        }
      }
      
      draw() {
        ctx.fillStyle = this.isSpecial ? 'rgba(209, 247, 39, 0.8)' : this.color;
        
        if (this.isSpecial) {
           // Glow effect for special nodes
           ctx.shadowBlur = 10;
           ctx.shadowColor = 'rgba(209, 247, 39, 0.5)';
        } else {
           ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Check connections
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionRadius) {
            const opacity = 1 - (distance / connectionRadius);
            
            if (particles[i].isSpecial || particles[j].isSpecial) {
                ctx.strokeStyle = `rgba(209, 247, 39, ${opacity * 0.4})`;
            } else {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            }
            
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'var(--gradient-glow)',
      }}
    />
  );
};

export default NeuralBackground;
