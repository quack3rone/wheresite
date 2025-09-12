import React from 'react';
import { motion } from 'framer-motion';

const VinesEffect = ({ isVisible, isMobile }) => {
  if (!isVisible) return null;

  // 10 лиан для десктопа - разной длины от правого края с разным количеством листьев
  const vinesData = [
    {
      id: 1,
      path: "M1200,30 C 1000,10 800,50 500,25",
      strokeDasharray: "950",
      delay: 0,
      leaves: [
        { x: 1100, y: 20, rotation: -25, scale: 1.4, delay: 1.2 },
        { x: 900, y: 30, rotation: 30, scale: 1.2, delay: 1.4 }
      ]
    },
    {
      id: 2,
      path: "M1200,70 C 980,90 760,50 350,80",
      strokeDasharray: "1200",
      delay: 0.1,
      leaves: [
        { x: 1080, y: 80, rotation: 35, scale: 1.3, delay: 1.3 },
        { x: 880, y: 70, rotation: -30, scale: 1.5, delay: 1.5 },
        { x: 680, y: 65, rotation: 25, scale: 1.2, delay: 1.7 },
        { x: 480, y: 75, rotation: -40, scale: 1.4, delay: 1.9 },
        { x: 380, y: 78, rotation: 20, scale: 1.1, delay: 2.1 }
      ]
    },
    {
      id: 3,
      path: "M1200,110 C 1020,130 820,90 650,120",
      strokeDasharray: "780",
      delay: 0.15,
      leaves: [
        { x: 1120, y: 120, rotation: -35, scale: 1.6, delay: 1.4 },
        { x: 920, y: 110, rotation: 40, scale: 1.3, delay: 1.6 },
        { x: 780, y: 105, rotation: -25, scale: 1.4, delay: 1.8 }
      ]
    },
    {
      id: 4,
      path: "M1200,150 C 1000,170 800,130 400,160",
      strokeDasharray: "1100",
      delay: 0.2,
      leaves: [
        { x: 1100, y: 160, rotation: 30, scale: 1.5, delay: 1.5 }
      ]
    },
    {
      id: 5,
      path: "M1200,190 C 980,210 760,170 550,200",
      strokeDasharray: "890",
      delay: 0.25,
      leaves: [
        { x: 1080, y: 200, rotation: -30, scale: 1.4, delay: 1.6 },
        { x: 880, y: 190, rotation: 25, scale: 1.3, delay: 1.8 },
        { x: 720, y: 185, rotation: -35, scale: 1.5, delay: 2.0 },
        { x: 630, y: 195, rotation: 15, scale: 1.2, delay: 2.2 }
      ]
    },
    {
      id: 6,
      path: "M1200,230 C 1020,250 820,210 300,240",
      strokeDasharray: "1250",
      delay: 0.3,
      leaves: [
        { x: 1120, y: 240, rotation: 40, scale: 1.2, delay: 1.7 },
        { x: 920, y: 230, rotation: -25, scale: 1.6, delay: 1.9 },
        { x: 720, y: 225, rotation: 30, scale: 1.3, delay: 2.1 },
        { x: 520, y: 235, rotation: -35, scale: 1.4, delay: 2.3 },
        { x: 420, y: 238, rotation: 25, scale: 1.1, delay: 2.5 },
        { x: 350, y: 240, rotation: -20, scale: 1.3, delay: 2.7 }
      ]
    },
    {
      id: 7,
      path: "M1200,270 C 1000,290 800,250 450,280",
      strokeDasharray: "1050",
      delay: 0.35,
      leaves: [
        { x: 1100, y: 280, rotation: -40, scale: 1.5, delay: 1.8 },
        { x: 900, y: 270, rotation: 35, scale: 1.4, delay: 2.0 },
        { x: 650, y: 265, rotation: -30, scale: 1.2, delay: 2.2 }
      ]
    },
    {
      id: 8,
      path: "M1200,310 C 980,330 760,290 600,320",
      strokeDasharray: "820",
      delay: 0.4,
      leaves: [
        { x: 1080, y: 320, rotation: 25, scale: 1.3, delay: 1.9 },
        { x: 880, y: 310, rotation: -35, scale: 1.6, delay: 2.1 }
      ]
    },
    {
      id: 9,
      path: "M1200,350 C 1020,370 820,330 250,360",
      strokeDasharray: "1300",
      delay: 0.45,
      leaves: [
        { x: 1120, y: 360, rotation: -25, scale: 1.5, delay: 2.0 },
        { x: 920, y: 350, rotation: 30, scale: 1.2, delay: 2.2 },
        { x: 720, y: 345, rotation: -40, scale: 1.3, delay: 2.4 },
        { x: 520, y: 355, rotation: 35, scale: 1.4, delay: 2.6 },
        { x: 380, y: 358, rotation: -30, scale: 1.1, delay: 2.8 }
      ]
    },
    {
      id: 10,
      path: "M1200,390 C 1000,410 800,370 500,400",
      strokeDasharray: "980",
      delay: 0.5,
      leaves: [
        { x: 1100, y: 400, rotation: 35, scale: 1.4, delay: 2.1 },
        { x: 900, y: 390, rotation: -30, scale: 1.6, delay: 2.3 },
        { x: 700, y: 385, rotation: 25, scale: 1.5, delay: 2.5 },
        { x: 600, y: 395, rotation: -25, scale: 1.2, delay: 2.7 }
      ]
    }
  ];

  // Мобильные лианы - из нижней части экрана к середине, разной длины
  const mobileVinesData = [
    {
      id: 1,
      path: "M50,350 C 150,320 250,280 200,200",
      strokeDasharray: "280",
      delay: 0,
      leaves: [
        { x: 100, y: 335, rotation: -25, scale: 1.2, delay: 1.2 },
        { x: 175, y: 280, rotation: 30, scale: 1.3, delay: 1.4 }
      ]
    },
    {
      id: 2,
      path: "M100,380 C 200,340 300,300 320,180",
      strokeDasharray: "350",
      delay: 0.1,
      leaves: [
        { x: 150, y: 360, rotation: 35, scale: 1.4, delay: 1.3 },
        { x: 250, y: 320, rotation: -30, scale: 1.2, delay: 1.5 },
        { x: 310, y: 240, rotation: 25, scale: 1.3, delay: 1.7 }
      ]
    },
    {
      id: 3,
      path: "M150,400 C 250,360 350,320 250,220",
      strokeDasharray: "320",
      delay: 0.15,
      leaves: [
        { x: 200, y: 380, rotation: -35, scale: 1.3, delay: 1.4 },
        { x: 300, y: 340, rotation: 40, scale: 1.5, delay: 1.6 }
      ]
    },
    {
      id: 4,
      path: "M200,420 C 300,380 400,340 380,160",
      strokeDasharray: "380",
      delay: 0.2,
      leaves: [
        { x: 250, y: 400, rotation: 30, scale: 1.2, delay: 1.5 },
        { x: 350, y: 360, rotation: -40, scale: 1.4, delay: 1.7 },
        { x: 380, y: 250, rotation: 35, scale: 1.6, delay: 1.9 }
      ]
    },
    {
      id: 5,
      path: "M250,440 C 350,400 450,360 300,240",
      strokeDasharray: "360",
      delay: 0.25,
      leaves: [
        { x: 300, y: 420, rotation: -30, scale: 1.4, delay: 1.6 },
        { x: 400, y: 380, rotation: 25, scale: 1.3, delay: 1.8 }
      ]
    },
    {
      id: 6,
      path: "M300,460 C 400,420 500,380 420,200",
      strokeDasharray: "400",
      delay: 0.3,
      leaves: [
        { x: 350, y: 440, rotation: 35, scale: 1.4, delay: 1.7 },
        { x: 450, y: 400, rotation: -30, scale: 1.2, delay: 1.9 },
        { x: 420, y: 290, rotation: 40, scale: 1.5, delay: 2.1 }
      ]
    },
    {
      id: 7,
      path: "M250,440 C 350,400 450,360 300,240",
      strokeDasharray: "360",
      delay: 0.25,
      leaves: [
        { x: 300, y: 420, rotation: -30, scale: 1.4, delay: 1.6 },
        { x: 400, y: 380, rotation: 25, scale: 1.3, delay: 1.8 }
      ]
    },
  ];

  const currentVinesData = isMobile ? mobileVinesData : vinesData;
  const containerHeight = isMobile ? '480px' : '420px';
  const viewBoxWidth = isMobile ? 500 : 1200;
  const viewBoxHeight = isMobile ? 480 : 420;
  const topPosition = isMobile ? '10%' : '20%';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: topPosition,
        right: 0,
        left: 0,
        height: containerHeight,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible'
        }}
      >
        <defs>
          <path id="leafShape" d="M0,-10 C10,-4 10,4 0,10 C-10,4 -10,-4 0,-10Z" />
          
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="20%" stopColor="#017c3b">
              <animate attributeName="offset" values="0.2;1.4;0.2" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="40%" stopColor="#4caf50">
              <animate attributeName="offset" values="0;1.3;0" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="80%" stopColor="#017c3b">
              <animate attributeName="offset" values="0.2;1.4;0.2" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#004d1f" />
          </linearGradient>
        </defs>

        {currentVinesData.map((vine) => (
          <g key={vine.id}>
            {/* Основная лиана */}
            <path
              d={vine.path}
              fill="none"
              stroke="#009846"
              strokeWidth={isMobile ? "4" : "6"}
              strokeLinecap="round"
              filter="drop-shadow(0 1px 0 rgba(0,0,0,.25))"
              strokeDasharray={vine.strokeDasharray}
              strokeDashoffset={vine.strokeDasharray}
              style={{
                animation: `vine-draw 2.2s ease forwards`,
                animationDelay: `${0.9 + vine.delay}s`
              }}
            />
            
            {/* Светящийся эффект */}
            <path
              d={vine.path}
              fill="none"
              stroke="#00c062"
              strokeWidth={isMobile ? "2" : "3"}
              strokeLinecap="round"
              opacity="0.65"
              strokeDasharray={vine.strokeDasharray}
              strokeDashoffset={vine.strokeDasharray}
              style={{
                animation: `vine-draw 2.2s ease forwards`,
                animationDelay: `${0.9 + vine.delay}s`
              }}
            />

            {/* Листья */}
            {vine.leaves.map((leaf, index) => (
              <g
                key={index}
                transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rotation}) scale(${leaf.scale})`}
              >
                <use
                  href="#leafShape"
                  fill="url(#leafGradient)"
                  opacity="0"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: `leaf-grow 0.9s cubic-bezier(.2,.8,.2,1) forwards`,
                    animationDelay: `${leaf.delay}s`
                  }}
                />
                
                {/* Анимация покачивания листьев */}
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  values={`${leaf.rotation - 10} 0 0; ${leaf.rotation + 20} 0 0; ${leaf.rotation - 10} 0 0`}
                  dur="3s"
                  begin={`${leaf.delay + 1}s`}
                  additive="sum"
                  repeatCount="indefinite"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>

      <style jsx>{`
        @keyframes vine-draw {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes leaf-grow {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </motion.div>
  );
};

export default VinesEffect;