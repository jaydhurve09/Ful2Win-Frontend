import React from 'react';

const BackgroundBubbles = ({ blur = false }) => {
  const styles = `
    @keyframes random-float {
      0% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(15vw, -15vh) scale(1.1);
      }
      50% {
        transform: translate(-20vw, 10vh) scale(0.9);
      }
      75% {
        transform: translate(10vw, 20vh) scale(1.2);
      }
      100% {
        transform: translate(0, 0) scale(1);
      }
    }

    .bubble {
      position: absolute;
      border-radius: 9999px;
      animation: random-float 20s ease-in-out infinite alternate;
      /* Ensure bubbles are positioned relative to the full viewport */
      left: var(--left-pos, 0);
      top: var(--top-pos, 0);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={`fixed inset-0 overflow-hidden z-0 pointer-events-none ${blur ? 'blur-sm' : ''}`}>
        {/* Large bubbles - positioned to fill the screen */}
        <div className="bubble w-48 h-48 md:w-64 md:h-64 bg-blue-400 opacity-5" style={{ '--left-pos': '-20vw', '--top-pos': '-20vh', animationDelay: '0s' }}></div>
        <div className="bubble w-40 h-40 md:w-56 md:h-56 bg-blue-300 opacity-5" style={{ '--left-pos': '80vw', '--top-pos': '60vh', animationDelay: '2s' }}></div>

        {/* Medium bubbles - positioned to fill the screen */}
        <div className="bubble w-24 h-24 md:w-32 md:h-32 bg-blue-300 opacity-5" style={{ '--left-pos': '30vw', '--top-pos': '25vh', animationDelay: '1s' }}></div>
        <div className="bubble w-32 h-32 md:w-40 md:h-40 bg-blue-200 opacity-5" style={{ '--left-pos': '65vw', '--top-pos': '75vh', animationDelay: '3s' }}></div>

        {/* Small bubbles - positioned to fill the screen */}
        <div className="bubble w-16 h-16 md:w-20 md:h-20 bg-blue-400 opacity-5" style={{ '--left-pos': '50vw', '--top-pos': '5vh', animationDelay: '1.5s' }}></div>
        <div className="bubble w-20 h-20 md:w-24 md:h-24 bg-blue-300 opacity-5" style={{ '--left-pos': '10vw', '--top-pos': '80vh', animationDelay: '2.5s' }}></div>
      </div>
    </>
  );
};

export default BackgroundBubbles;



// import React from 'react';

// const BackgroundBubbles = () => {
//   // Detect screen width
//   const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

//   // Create cyberpunk UI elements
//   const cyberpunkElements = Array.from({ length: 10 }).map((_, index) => {
//     const elements = ['holo-panel', 'tech-frame', 'data-bar', 'cyber-border', 'neon-box', 'progress-strip'];
//     const element = elements[Math.floor(Math.random() * elements.length)];

//     const size = isMobile
//       ? Math.floor(Math.random() * 100) + 80 // 80px to 180px for mobile
//       : Math.floor(Math.random() * 200) + 120; // 120px to 320px for desktop

//     const left = Math.floor(Math.random() * 85) + 7.5; // Keep away from edges
//     const top = Math.floor(Math.random() * 85) + 7.5;
//     const opacity = Math.random() * 0.4 + 0.4; // 40-80% opacity
//     const rotation = Math.floor(Math.random() * 8) - 4; // Small rotation -4 to 4 degrees
//     const animationDelay = Math.random() * 6;
//     const animationDuration = Math.random() * 10 + 12; // 12-22 seconds

//     const getCyberpunkElement = () => {
//       const neonColors = ['cyan-400', 'blue-400', 'purple-400', 'pink-400', 'violet-400'];
//       const primaryColor = neonColors[Math.floor(Math.random() * neonColors.length)];
//       const secondaryColor = neonColors[Math.floor(Math.random() * neonColors.length)];

//       switch (element) {
//         case 'holo-panel':
//           return (
//             <div className="relative">
//               {/* Main holographic panel */}
//               <div
//                 className={`border-2 border-${primaryColor} bg-gradient-to-br from-${primaryColor}/20 to-${secondaryColor}/10 backdrop-blur-sm rounded-lg`}
//                 style={{
//                   width: `${size}px`,
//                   height: `${size * 0.7}px`,
//                   boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.1)',
//                 }}
//               >
//                 {/* Tech corner details */}
//                 <div className={`absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-${primaryColor}`} />
//                 <div className={`absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-${primaryColor}`} />
//                 <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-${primaryColor}`} />
//                 <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-${primaryColor}`} />
//               </div>
//             </div>
//           );
//         case 'tech-frame':
//           return (
//             <div className="relative">
//               <div
//                 className="border-2 border-cyan-400 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm"
//                 style={{
//                   width: `${size}px`,
//                   height: `${size * 0.6}px`,
//                   clipPath: 'polygon(0% 0%, 85% 0%, 100% 15%, 100% 100%, 15% 100%, 0% 85%)',
//                   boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
//                 }}
//               />
//               {/* Tech notches */}
//               <div className="absolute top-0 left-1/4 w-8 h-2 bg-cyan-400 rounded-b" />
//               <div className="absolute bottom-0 right-1/4 w-8 h-2 bg-pink-400 rounded-t" />
//             </div>
//           );
//         case 'data-bar':
//           return (
//             <div className="relative">
//               <div
//                 className="border border-purple-400 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded"
//                 style={{
//                   width: `${size * 1.5}px`,
//                   height: `${size * 0.3}px`,
//                   boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
//                 }}
//               >
//                 {/* Data segments */}
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className={`absolute top-1 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-sm`}
//                     style={{
//                       left: `${5 + i * 18}%`,
//                       width: '12%',
//                       opacity: Math.random() * 0.6 + 0.4,
//                       animation: `dataFlow ${2 + i * 0.5}s ease-in-out infinite`,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           );
//         case 'cyber-border':
//           return (
//             <div className="relative">
//               <div
//                 className="border-2 border-blue-400 bg-blue-900/20 backdrop-blur-sm rounded-lg"
//                 style={{
//                   width: `${size}px`,
//                   height: `${size}px`,
//                   boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
//                 }}
//               >
//                 {/* Scanning line */}
//                 <div
//                   className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
//                   style={{ animation: 'scanLine 3s ease-in-out infinite' }}
//                 />
//               </div>
//             </div>
//           );
//         case 'neon-box':
//           return (
//             <div className="relative">
//               <div
//                 className="border border-pink-400 bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm rounded"
//                 style={{
//                   width: `${size}px`,
//                   height: `${size * 0.8}px`,
//                   boxShadow: '0 0 20px rgba(236, 72, 153, 0.4), inset 0 0 10px rgba(236, 72, 153, 0.1)',
//                 }}
//               >
//                 {/* Neon accent lines */}
//                 <div className="absolute top-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60" />
//                 <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
//               </div>
//             </div>
//           );
//         case 'progress-strip':
//           const progress = Math.floor(Math.random() * 70) + 30; // 30-100%
//           return (
//             <div className="relative">
//               <div
//                 className="border border-violet-400 bg-gray-900/50 backdrop-blur-sm rounded overflow-hidden"
//                 style={{
//                   width: `${size * 1.2}px`,
//                   height: `${size * 0.25}px`,
//                   boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
//                 }}
//               >
//                 <div
//                   className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 rounded-sm relative overflow-hidden"
//                   style={{ width: `${progress}%` }}
//                 >
//                   {/* Animated shine effect */}
//                   <div
//                     className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                     style={{ animation: 'shine 2s ease-in-out infinite' }}
//                   />
//                 </div>
//               </div>
//             </div>
//           );
//         default:
//           return (
//             <div
//               className="border-2 border-cyan-400 bg-cyan-900/20 backdrop-blur-sm rounded-lg"
//               style={{
//                 width: `${size}px`,
//                 height: `${size}px`,
//                 boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)',
//               }}
//             />
//           );
//       }
//     };

//     return (
//       <div
//         key={index}
//         className="absolute cyber-element"
//         style={{
//           left: `${left}%`,
//           top: `${top}%`,
//           transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
//           opacity: opacity,
//           pointerEvents: 'none',
//           animation: `cyberFloat ${animationDuration}s ease-in-out infinite ${animationDelay}s, 
//                          cyberPulse ${animationDuration * 0.6}s ease-in-out infinite ${animationDelay}s`,
//           '--rotation': `${rotation}deg` // Pass the rotation value as a CSS custom property
//         }}
//       >
//         {getCyberpunkElement()}
//       </div>
//     );
//   });

//   return (
//     <>
//       <style jsx>{`
//         @keyframes cyberFloat {
//           0%, 100% { transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(0px); }
//           33% { transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-10px) scale(1.02); }
//           66% { transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(5px) scale(0.98); }
//         }
//         
//         @keyframes cyberPulse {
//           0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
//           50% { filter: brightness(1.2) drop-shadow(0 0 20px currentColor); }
//         }
//         
//         @keyframes dataFlow {
//           0%, 100% { opacity: 0.4; transform: scaleX(1); }
//           50% { opacity: 1; transform: scaleX(1.1); }
//         }
//         
//         @keyframes scanLine {
//           0% { transform: translateY(0); opacity: 0; }
//           50% { opacity: 1; }
//           100% { transform: translateY(100vh); opacity: 0; }
//         }
//         
//         @keyframes shine {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         
//         @keyframes gridPulse {
//           0%, 100% { opacity: 0.1; }
//           50% { opacity: 0.3; }
//         }
//         
//         @keyframes twinkle {
//           0%, 100% { opacity: 0.5; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.5); }
//         }
//         
//         .cyber-element {
//           --rotation: 0deg; /* default value */
//         }
//       `}</style>
//       
//       {/* Updated background with light gradient */}
//       <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "linear-gradient(to bottom, #d2e8ff 0%, #ffffff 100%)" }}>
//         {/* Cyberpunk grid overlay, adjusted for a lighter background */}
//         <div
//           className="absolute inset-0 opacity-40" // Opacity increased for visibility
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
//               radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 70%),
//               radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 70%)
//             `,
//             backgroundSize: '60px 60px, 60px 60px, 400px 400px, 400px 400px',
//             animation: 'gridPulse 4s ease-in-out infinite',
//           }}
//         />

//         {/* Cyberpunk UI elements - these are still vibrant against the light background */}
//         {cyberpunkElements}

//         {/* Corner HUD elements - colors adjusted for visibility */}
//         <div className="absolute top-4 left-4 opacity-60">
//           <div className="w-24 h-16 border-2 border-blue-600 bg-blue-300/20 backdrop-blur-sm rounded"
//             style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
//             <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-blue-600" />
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-blue-600" />
//           </div>
//         </div>

//         <div className="absolute top-4 right-4 opacity-60">
//           <div className="w-24 h-16 border-2 border-purple-600 bg-purple-300/20 backdrop-blur-sm rounded"
//             style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}>
//             <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-purple-600" />
//             <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-purple-600" />
//           </div>
//         </div>

//         <div className="absolute bottom-4 left-4 opacity-60">
//           <div className="w-24 h-16 border-2 border-pink-600 bg-pink-300/20 backdrop-blur-sm rounded"
//             style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)' }}>
//             <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-pink-600" />
//             <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-pink-600" />
//           </div>
//         </div>

//         <div className="absolute bottom-4 right-4 opacity-60">
//           <div className="w-24 h-16 border-2 border-cyan-600 bg-cyan-300/20 backdrop-blur-sm rounded"
//             style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)' }}>
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-600" />
//             <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-600" />
//           </div>
//         </div>

//         {/* Ambient particle effects - color adjusted */}
//         <div className="absolute inset-0 overflow-hidden">
//           {Array.from({ length: 12 }).map((_, i) => (
//             <div
//               key={`particle-${i}`}
//               className="absolute w-1 h-1 bg-blue-600/50 rounded-full"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
//                 boxShadow: '0 0 4px currentColor',
//               }}
//             />
//           ))}
//         </div>

//         {/* Scanning beam effect - color adjusted */}
//         <div
//           className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-600/60 to-transparent"
//           style={{ animation: 'scanLine 8s linear infinite' }}
//         />
//       </div>
//     </>
//   );
// };

// export default BackgroundBubbles;