import { useEffect, useRef } from 'react';
import { GameLoop } from './GameLoop';

// Timer is now a pure display component - countdown happens in App.jsx
const Timer = ({ timeLeft, duration, isActive }) => {
    const canvasRef = useRef(null);
    const gameLoopRef = useRef(null);
    const particlesRef = useRef([]);
    const glowIntensityRef = useRef(0);

    const progress = (timeLeft / duration) * 100;

    // Particle system and animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = 150;
        const centerY = 150;
        const radius = 135;

        // Create particles
        const createParticle = () => {
            const angle = Math.random() * Math.PI * 2;
            return {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: 1,
                size: Math.random() * 3 + 1,
                hue: 200 + Math.random() * 40
            };
        };

        const update = (dt) => {
            if (isActive) {
                // Add new particles
                if (Math.random() < 0.3) {
                    particlesRef.current.push(createParticle());
                }

                // Update glow pulse
                glowIntensityRef.current = (glowIntensityRef.current + dt) % (Math.PI * 2);
            }

            // Update particles
            particlesRef.current = particlesRef.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= dt * 0.5;
                return p.life > 0;
            });
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw pulsing glow when active
            if (isActive) {
                const glowSize = 5 + Math.sin(glowIntensityRef.current * 2) * 3;
                ctx.shadowBlur = glowSize;
                ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
            }

            // Draw particles
            particlesRef.current.forEach(p => {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        };

        gameLoopRef.current = new GameLoop(update, render);
        gameLoopRef.current.start();

        return () => {
            if (gameLoopRef.current) {
                gameLoopRef.current.stop();
            }
        };
    }, [isActive]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const strokeDasharray = 283;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

    return (
        <div className="timer-container" style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
            {/* Canvas for particles */}
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none'
                }}
            />

            {/* SVG timer */}
            <svg className="timer-svg" width="300" height="300" viewBox="0 0 100 100" style={{ position: 'relative', zIndex: 1 }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    filter={isActive ? "url(#glow)" : "none"}
                    style={{
                        // Only animate during countdown, not when resetting to 100%
                        transition: progress < 100 ? 'stroke-dashoffset 1s linear' : 'none',
                        animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none'
                    }}
                />
            </svg>

            <div className="timer-text" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 2
            }}>
                <div style={{
                    fontSize: '5rem',
                    fontWeight: 500,
                    fontFamily: 'var(--font-family)',
                    letterSpacing: '-2px',
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {formatTime(timeLeft)}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {isActive ? 'Current Session' : 'Ready to Start'}
                </div>
            </div>
        </div>
    );
};

export default Timer;
