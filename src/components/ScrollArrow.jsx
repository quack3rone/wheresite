import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScrollArrow = ({ onClick, scrollY }) => {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const controlsMain = useAnimation();
  const controlsShadow = useAnimation();
  const isMobile = window.innerWidth <= 768;
  const arrowSize = isMobile ? 75 : 85;
  const arrowOffset = isMobile ? '5px' : '50px';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible && !clicked) {
      controlsMain.start({
        y: [0, 10, 0],
        opacity: [1, 0.9, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      });

      controlsShadow.start({
        y: [0, 10, 0],
        opacity: [0.01, 0.8, 0.002],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.25,
        },
      });
    }
  }, [visible, clicked, controlsMain, controlsShadow]);

  useEffect(() => {
    if (scrollY > 10) {
      controlsMain.start({ opacity: 0, transition: { duration: 0.1 } });
      controlsShadow.start({ opacity: 0, transition: { duration: 0.1 } });
    }
  }, [scrollY, controlsMain, controlsShadow]);

  const handleClick = () => {
    setClicked(true);
    controlsMain.start({ opacity: 0, transition: { duration: 0.1 } });
    controlsShadow.start({ opacity: 0, transition: { duration: 0.1 } });
    if (onClick) onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1 }}
      onClick={handleClick}
      style={{
        position: 'fixed',
        zIndex: 1000,
        cursor: 'pointer',
        right: arrowOffset,
        ...(isMobile
          ? { top: '30px' }
          : { bottom: '50px' }
        )
      }}
    >
      <motion.svg
        animate={controlsShadow}
        width={arrowSize}
        height={arrowSize}
        viewBox="0 0 25 25"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.5"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path d="M10 3h4v10h5l-7 8-7-8h5V3z" />
      </motion.svg>

      <motion.svg
        animate={controlsMain}
        width={arrowSize}
        height={arrowSize}
        viewBox="0 0 25 25"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 3h4v10h5l-7 8-7-8h5V3z" />
      </motion.svg>
    </motion.div>
  );
};

export default ScrollArrow;
