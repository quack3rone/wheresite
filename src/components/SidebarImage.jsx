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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      style={{
        position: 'fixed',
        left: isMobile
          ? `calc(75% - ${scrollY * 0.6}%)`
          : `calc(85% - ${scrollY * 0.65}%)`,
        willChange: 'left',
        transform: 'translateZ(0)',
        
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