import React from 'react';

const BackgroundCircles = () => {
  // Detect screen width
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Create cyberpunk UI elements
  const cyberpunkElements = Array.from({ length: 10 }).map((_, index) => {
    const elements = ['holo-panel', 'tech-frame', 'data-bar', 'cyber-border', 'neon-box', 'progress-strip'];
    const element = elements[Math.floor(Math.random() * elements.length)];

    const size = isMobile
      ? Math.floor(Math.random() * 100) + 80 // 80px to 180px for mobile
      : Math.floor(Math.random() * 200) + 120; // 120px to 320px for desktop

    const left = Math.floor(Math.random() * 85) + 7.5; // Keep away from edges
    const top = Math.floor(Math.random() * 85) + 7.5;
    const opacity = Math.random() * 0.15 + 0.05; // Reduced to 5-20% opacity
    const rotation = Math.floor(Math.random() * 8) - 4; // Small rotation -4 to 4 degrees
    const animationDelay = Math.random() * 6;
    const animationDuration = Math.random() * 10 + 12; // 12-22 seconds

    const getCyberpunkElement = () => {
      const neonColors = ['cyan-400', 'blue-400', 'purple-400', 'pink-400', 'violet-400'];
      const primaryColor = neonColors[Math.floor(Math.random() * neonColors.length)];
      const secondaryColor = neonColors[Math.floor(Math.random() * neonColors.length)];

      switch (element) {
        case 'holo-panel':
          return (
            <div className="relative">
              {/* Main holographic panel */}
              <div
                className={`border-2 border-${primaryColor} bg-gradient-to-br from-${primaryColor}/20 to-${secondaryColor}/10 backdrop-blur-sm rounded-lg`}
                style={{
                  width: `${size}px`,
                  height: `${size * 0.7}px`,
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.1)',
                }}
              >
                {/* Tech corner details */}
                <div className={`absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-${primaryColor}`} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-${primaryColor}`} />
                <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-${primaryColor}`} />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-${primaryColor}`} />
              </div>
            </div>
          );
        case 'tech-frame':
          return (
            <div className="relative">
              <div
                className="border-2 border-cyan-400 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm"
                style={{
                  width: `${size}px`,
                  height: `${size * 0.6}px`,
                  clipPath: 'polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 15% 100%, 0% 85%)',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
                }}
              />
              {/* Tech notches */}
              <div className="absolute top-0 left-1/4 w-8 h-2 bg-cyan-400 rounded-b" />
              <div className="absolute bottom-0 right-1/4 w-8 h-2 bg-pink-400 rounded-t" />
            </div>
          );
        case 'data-bar':
          return (
            <div className="relative">
              <div
                className="border border-purple-400 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded"
                style={{
                  width: `${size * 1.5}px`,
                  height: `${size * 0.3}px`,
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
                }}
              >
                {/* Data segments */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute top-1 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-sm`}
                    style={{
                      left: `${5 + i * 18}%`,
                      width: '12%',
                      opacity: Math.random() * 0.6 + 0.4,
                      animation: `dataFlow ${2 + i * 0.5}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        case 'cyber-border':
          return (
            <div className="relative">
              <div
                className="border-2 border-blue-400 bg-blue-900/20 backdrop-blur-sm rounded-lg"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                }}
              >
                {/* Scanning line */}
                <div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{ animation: 'scanLine 3s ease-in-out infinite' }}
                />
              </div>
            </div>
          );
        case 'neon-box':
          return (
            <div className="relative">
              <div
                className="border border-pink-400 bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm rounded"
                style={{
                  width: `${size}px`,
                  height: `${size * 0.8}px`,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), inset 0 0 10px rgba(236, 72, 153, 0.1)',
                }}
              >
                {/* Neon accent lines */}
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
              </div>
            </div>
          );
        case 'progress-strip':
          const progress = Math.floor(Math.random() * 70) + 30; // 30-100%
          return (
            <div className="relative">
              <div
                className="border border-violet-400 bg-gray-900/50 backdrop-blur-sm rounded overflow-hidden"
                style={{
                  width: `${size * 1.2}px`,
                  height: `${size * 0.25}px`,
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 rounded-sm relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shine effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: 'shine 2s ease-in-out infinite' }}
                  />
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div
              className="border-2 border-cyan-400 bg-cyan-900/20 backdrop-blur-sm rounded-lg"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)',
              }}
            />
          );
      }
    };

    return (
      <div
        key={index}
        className="absolute cyber-element"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          opacity: opacity,
          pointerEvents: 'none',
          // Combined animations for floating and pulsing
          animation: `cyberFloat ${animationDuration}s ease-in-out infinite ${animationDelay}s, 
                          cyberPulse ${animationDuration * 0.6}s ease-in-out infinite ${animationDelay}s`,
          '--rotation': `${rotation}deg` // Pass the rotation value as a CSS custom property
        }}
      >
        {getCyberpunkElement()}
      </div>
    );
  });

  return (
    <>
      <style jsx>{`
        @keyframes cyberFloat {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation)) translate(0px, 0px); }
          33% { transform: translate(-55%, -45%) rotate(var(--rotation)) translate(-15px, -10px) scale(1.02); }
          66% { transform: translate(-45%, -55%) rotate(var(--rotation)) translate(15px, 5px) scale(0.98); }
        }
        
        @keyframes cyberPulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
          50% { filter: brightness(1.2) drop-shadow(0 0 20px currentColor); }
        }
        
        @keyframes dataFlow {
          0%, 100% { opacity: 0.4; transform: scaleX(1); }
          50% { opacity: 1; transform: scaleX(1.1); }
        }
        
        @keyframes scanLine {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .cyber-element {
          --rotation: 0deg; /* default value */
        }
      `}</style>
      
      {/* Updated background with deep royal blue gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "linear-gradient(to bottom, #0B33FF 0%, #000B33 100%)" }}>
        {/* Cyberpunk grid overlay */}
        <div
          className="absolute inset-0 opacity-10" // Opacity reduced
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 70%),
              radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 70%)
            `,
            backgroundSize: '60px 60px, 60px 60px, 400px 400px, 400px 400px',
            animation: 'gridPulse 4s ease-in-out infinite',
          }}
        />

        {/* Cyberpunk UI elements */}
        {cyberpunkElements}

        {/* Corner HUD elements */}
        <div className="absolute top-4 left-4 opacity-20"> {/* Opacity reduced */}
          <div className="w-24 h-16 border-2 border-cyan-400 bg-cyan-900/20 backdrop-blur-sm rounded"
            style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)' }}>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400" />
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-20"> {/* Opacity reduced */}
          <div className="w-24 h-16 border-2 border-purple-400 bg-purple-900/20 backdrop-blur-sm rounded"
            style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-purple-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-purple-400" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 opacity-20"> {/* Opacity reduced */}
          <div className="w-24 h-16 border-2 border-pink-400 bg-pink-900/20 backdrop-blur-sm rounded"
            style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)' }}>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-pink-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-pink-400" />
          </div>
        </div>

        <div className="absolute bottom-4 right-4 opacity-20"> {/* Opacity reduced */}
          <div className="w-24 h-16 border-2 border-blue-400 bg-blue-900/20 backdrop-blur-sm rounded"
            style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-blue-400" />
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-blue-400" />
          </div>
        </div>

        {/* Ambient particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full" // Opacity reduced
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                boxShadow: '0 0 4px currentColor',
              }}
            />
          ))}
        </div>

        {/* Scanning beam effect */}
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" // Opacity reduced
          style={{ animation: 'scanLine 8s linear infinite' }}
        />
      </div>
    </>
  );
};

export default BackgroundCircles;
