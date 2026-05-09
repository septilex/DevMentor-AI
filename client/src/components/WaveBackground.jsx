import React, { useEffect, useRef } from 'react';

const WaveBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width, height;
        let waves = [];
        let particles = [];

        // Initialize particles
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 60; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5 + 0.5,
                    speedY: -Math.random() * 0.3 - 0.1,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        };

        // Initialize waves
        const initWaves = () => {
            waves = [];
            const waveCount = 4;
            for (let i = 0; i < waveCount; i++) {
                waves.push({
                    y: height / 2 + (i * 30),
                    length: 0.002 + i * 0.001,
                    amplitude: 60 + i * 15,
                    speed: 0.003 + i * 0.002,
                    offset: i * 5,
                    // Soft Apple blues and purples
                    color: i % 2 === 0 ? `rgba(0, 122, 255, ${0.03 + i * 0.01})` : `rgba(94, 92, 230, ${0.02 + i * 0.01})`,
                    stroke: i % 2 === 0 ? `rgba(0, 122, 255, ${0.15})` : `rgba(94, 92, 230, ${0.15})`
                });
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initWaves();
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const draw = (time) => {
            ctx.clearRect(0, 0, width, height);
            
            // Draw particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 122, 255, ${p.opacity * 0.2})`;
                ctx.fill();
                
                // Interaction: Particles move away from mouse slightly
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;
                }
                
                p.y += p.speedY;
                if (p.y < 0) {
                    p.y = height;
                    p.x = Math.random() * width;
                }
            });

            // Note: We don't fill a solid rectangle here so the global index.css gradient shines through.

            waves.forEach((wave, i) => {
                ctx.beginPath();

                // Interaction: Wave tends towards mouse Y
                const mouseInfluence = (mouseRef.current.y - height / 2) * 0.1 * (i + 1);

                // Optimization: Step x by 3 to optimize drawing
                for (let x = 0; x <= width; x += 3) {
                    const y = wave.y +
                        Math.sin(x * wave.length + time * wave.speed + wave.offset) * wave.amplitude +
                        (mouseInfluence * Math.sin(x / width * Math.PI) * 0.3); // Smooth bend

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                // Fill area below wave with a very subtle tint
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.fillStyle = wave.color;
                ctx.fill();

                // Bright strokes
                ctx.strokeStyle = wave.stroke;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame((t) => draw(t * 0.002));
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        draw(0);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[0] pointer-events-none opacity-60"
        />
    );
};

export default WaveBackground;
