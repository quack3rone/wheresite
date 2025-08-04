import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ScrollArrow = ({ onClick, scrollY }) => {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const controlsMain = useAnimation();
  const controlsShadow = useAnimation();
  const isMobile = window.innerWidth <= 768;
  const is2K = window.innerWidth >= 2048;
  const arrowSize = isMobile ? 75 : is2K ? 105 : 85;
  const arrowOffset = isMobile ? '5px' : '50px';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2300);
    return () => clearTimeout(timer);
  }, []);

  // Добавляем обработчик touch-событий для мобильных устройств
  useEffect(() => {
    if (!isMobile) return;

    let startY = 0;
    let isScrollAttempt = false;

    const handleTouchStart = (e) => {
      // Проверяем что пользователь не кликает по элементам UI (кнопки, ссылки и т.д.)
      if (e.target.closest('button, a, [role="button"], .catalog-footer, .footer-link')) {
        return;
      }
      
      startY = e.touches[0].clientY;
      isScrollAttempt = false;
    };

    const handleTouchMove = (e) => {
      if (!startY) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      // Если пользователь попытался скроллить на 30+ пикселей
      if (Math.abs(deltaY) > 30) {
        isScrollAttempt = true;
      }
    };

    const handleTouchEnd = (e) => {
      // Проверяем что пользователь не кликает по элементам UI
      if (e.target.closest('button, a, [role="button"], .catalog-footer, .footer-link')) {
        return;
      }

      if (isScrollAttempt && visible && !clicked && scrollY <= 10) {
        // Имитируем клик по стрелке при попытке скролла
        handleClick();
      }
      
      startY = 0;
      isScrollAttempt = false;
    };

    // Добавляем passive: false чтобы предотвратить стандартное поведение
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, visible, clicked, scrollY]);

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
        y: [0, 8, 0],
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
        strokeWidth="0.3"
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