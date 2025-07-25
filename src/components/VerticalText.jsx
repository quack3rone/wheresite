import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const VerticalText = ({ onEnd, isAnimationComplete, scrollY }) => {
  const words = ["Где", "Заказать", "Лучший", "Сайт"];
  const questionMark = "?";

  const animationDuration = 0.8;
  const maxDelay = words.length * 0.3;
  const totalDuration = (animationDuration + maxDelay) * 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onEnd(true);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className="vertical-text-container">
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
              opacity: 1,
              y: isAnimationComplete ? scrollOffset : 0,
              scaleY: 1,
              scaleX: 1,
            }}
            transition={{
              type: !isAnimationComplete ? 'spring' : 'tween',
              stiffness: !isAnimationComplete ? 300 : undefined,
              damping: !isAnimationComplete ? 24 : undefined,
              mass: !isAnimationComplete ? 1 : undefined,
              duration: isAnimationComplete ? 0.6 : undefined,
              delay: isAnimationComplete ? 0 : index * 0.3,
              ease: isAnimationComplete ? 'easeOut' : [0.48, 1, 0.09, 1],
            }}
            style={{
              marginLeft: `${index * 0.1 - 30}px`,
              position: 'relative',
              zIndex: words.length - index,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className="text-word"
          >
            <span
              style={{
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg) scaleX(1.2)',
                display: 'inline-block',
                WebkitTextStroke: '1.5px white',
                textStroke: '1.5px white',
              }}
            >
              {word}
              {isLastWord && (
                <motion.span
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: isAnimationComplete ? 0 : (index * 0.3 + 1.2),
                    duration: 0.8
                  }}
                  style={{
                    display: 'inline-block',
                    marginTop: '0.15em'
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

export default VerticalText;