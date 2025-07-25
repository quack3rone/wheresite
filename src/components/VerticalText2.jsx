import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const VerticalText2 = ({ isAnimationComplete, scrollY, lastScrollTime }) => {
  const words = ["Где", "Заказать", "Лучший", "Сайт"];
  const questionMark = "?";
  const [isScrolling, setIsScrolling] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const opacity = useMotionValue(0);
  const smoothOpacity = useSpring(opacity, {
    damping: 30,
    stiffness: 120,
    mass: 1.2
  });

  useEffect(() => {
    if (!isAnimationComplete) return;

    const handleScroll = () => {
      opacity.set(1);
      setIsScrolling(true);
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [isAnimationComplete, opacity]);

  useEffect(() => {
    if (!isAnimationComplete) return;

    let timeoutId;
    const checkScrolling = () => {
      const timeSinceLastScroll = Date.now() - lastScrollTime;
      if (timeSinceLastScroll > 300 && isScrolling) {
        setIsScrolling(false);
        opacity.set(0, { 
          duration: 2, 
          ease: [0.16, 1, 0.16, 1] 
        });
      }
      timeoutId = setTimeout(checkScrolling, 100);
    };

    checkScrolling();
    return () => clearTimeout(timeoutId);
  }, [lastScrollTime, isAnimationComplete, isScrolling, opacity]);

  const outlineTextStyle = {
    color: 'transparent',
    WebkitTextStroke: `${isMobile ? '0.5px' : '1px'} rgba(255, 255, 255, 0.8)`,
    textStroke: `${isMobile ? '0.5px' : '1px'} rgba(255, 255, 255, 0.8)`,
    display: 'inline-block'
  };

  return (
    <div
      className="vertical-text-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      {words.map((word, index) => {
        const direction = index % 2 === 0 ? -10 : 10;
        const initialY = index % 2 === 0 ? -1000 : 1000;
        const scrollOffset = scrollY * 0.5 * direction;
        const isLastWord = index === words.length - 1;

        return (
          <motion.div
            key={index}
            initial={
              !isAnimationComplete
                ? {
                    opacity: 0,
                    y: initialY,
                    scaleY: 0.6,
                    scaleX: 1.3,
                  }
                : undefined
            }
            animate={{
              opacity: isAnimationComplete ? undefined : 1,
              y: isAnimationComplete ? scrollOffset : 0,
              scaleY: 1,
              scaleX: 1,
            }}
            style={{
              opacity: isAnimationComplete ? smoothOpacity : undefined,
              marginLeft: `${index * 0.1 - 30}px`,
              position: 'relative',
              zIndex: words.length - index,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            transition={{
              type: !isAnimationComplete ? 'spring' : 'tween',
              stiffness: !isAnimationComplete ? 370 : undefined,
              damping: !isAnimationComplete ? 24 : undefined,
              mass: !isAnimationComplete ? 1 : undefined,
              duration: isAnimationComplete ? 2 : undefined,
              delay: isAnimationComplete ? 0 : index * 0.3,
              ease: isAnimationComplete
                ? [0.2, 1, 0.2, 1]
                : [0.48, 1, 0.09, 1],
            }}
            className="text-word"
          >
            <span
              style={{
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg) scaleX(1.2)',
                ...outlineTextStyle
              }}
            >
              {word}
              {isLastWord && (
                <motion.span
                  initial={{ opacity: 0 }}
                  style={{
                    opacity: isAnimationComplete ? smoothOpacity : undefined,
                    marginTop: '0.15em',
                    ...outlineTextStyle
                  }}
                  transition={{
                    delay: isAnimationComplete ? 0 : (index * 0.01),
                    duration: 0,
                    ease: [0.16, 1, 0.16, 1]
                  }}
                >
                  {questionMark}
                </motion.span>
              )}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default VerticalText2;