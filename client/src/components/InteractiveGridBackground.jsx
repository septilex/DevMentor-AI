import React, { useEffect, useRef } from 'react';

const InteractiveGridBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;

            // Update CSS variables for mouse position
            containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
            containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[-1] overflow-hidden bg-[#f5f5f7] pointer-events-none"
        >
            {/* Base Grid Pattern (Flat) */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #9ca3af 1px, transparent 1px),
                        linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }}
            />

            {/* 3D Perspective Plane (The "Floor") */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[1000px] transform-gpu">
                <div
                    className="absolute w-[200vw] h-[200vh] origin-center bg-[size:60px_60px] border-t border-gray-200"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                        `,
                        transform: 'rotateX(60deg) translateY(-100px) translateZ(-200px)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%)',
                        animation: 'grid-move 20s linear infinite'
                    }}
                />
            </div>

            {/* Mouse Spotlight (Interactivity) */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `
                        radial-gradient(
                            600px circle at var(--mouse-x) var(--mouse-y), 
                            rgba(250, 204, 21, 0.15), 
                            transparent 40%
                        )
                    `
                }}
            />

            {/* Animated Floating Particles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-yellow-300/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-300/10 rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />
            </div>

            <style>{`
                @keyframes grid-move {
                    0% { transform: rotateX(60deg) translateY(0) translateZ(-200px); }
                    100% { transform: rotateX(60deg) translateY(60px) translateZ(-200px); }
                }
            `}</style>
        </div>
    );
};

export default InteractiveGridBackground;
