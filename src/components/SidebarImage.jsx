import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const imagePaths = [
  "/images/4primer.png",
  "/images/2primer.png",
  "/images/3primer.png",
  "/images/1primer.png"
];

const isMobile = window.innerWidth <= 768;

const SidebarImage = ({ scrollY }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const scrollThreshold = window.innerHeight * 0.05;
    const direction = scrollY > prevScrollY ? 1 : -1;
    
    const steps = Math.floor(Math.abs(scrollY - prevScrollY) / scrollThreshold);
    if (steps > 0) {
      let newIndex = currentIndex + (direction * steps);
      
      newIndex = (newIndex % imagePaths.length + imagePaths.length) % imagePaths.length;
      
      setCurrentIndex(newIndex);
      setPrevScrollY(scrollY);
    }
  }, [scrollY]);

  return (
    <motion.div
      className="sidebar-image"
      initial={{ x: 200, opacity: 0, scale: 1, filter: "blur(6px)" }}
      animate={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 2.2
      }}
      style={{
        position: 'fixed',
        left: isMobile
          ? `calc(75% - ${scrollY * 0.6}%)`
          : `calc(85% - ${scrollY * 0.65}%)`,
        willChange: 'left',
        transform: 'translateZ(0)',
        zIndex: 4
      }}
    >
      <img 
        src={imagePaths[currentIndex]} 
        alt="Sidebar Image"
        key={imagePaths[currentIndex]}
      />
    </motion.div>
  );
};

export default SidebarImage;