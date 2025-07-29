import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const About = ({ transitionActive }) => {
  const location = useLocation();
  const isActive = location.pathname === '/about';
  const [showContent, setShowContent] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isActive && transitionActive) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isActive, transitionActive]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const handleScroll = () => {
      setScrollY(scrollRef.current.scrollTop);
    };

    scrollRef.current.addEventListener('scroll', handleScroll);
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isActive) return null;
  

  // ширина горизонтального контента
  const contentWidth = 8000; // px
  const scrollAreaHeight = contentWidth; // 1px скролла = 1px движения по X

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          ref={scrollRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '315px',
            right: 0,
            bottom: 0,
            overflowY: isMobile ? 'auto' : 'scroll',
            overflowX: 'hidden',
            zIndex: 10,
            backgroundColor: 'transparent ',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              height: isMobile ? 'auto' : `${scrollAreaHeight}px`,
              position: 'relative',
            }}
          >
            <div
              ref={containerRef}
              style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  transform: isMobile
                    ? 'none'
                    : `translateX(-${scrollY}px)`,
                  transition: 'transform 0.1s linear',
                  height: '100%',
                  width: isMobile ? '100%' : `${contentWidth}px`,
                }}
              >
                {/* Блок 1 — вертикальный текст */}
              <motion.div
                  style={{
                    minWidth: '100vw',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{ 
                      x: -870,            // 👈 начальный сдвиг влево
                      y: -scrollY + -140,  // 👈 скроллинг + начальный вверх
                    }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '220px',
                      fontFamily: 'NauryzRedKeds',
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          transform: 'rotate(-90deg)',
                          whiteSpace: 'nowrap',
                          fontSize: '85px',
                          fontWeight: 'bold',
                          lineHeight: 1,
                          color: i === 4 ? 'white' : 'rgba(255,255,255,0.25)',
                        }}
                      >
                        О нас
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Блок 2 — видео + текст */}
                <div
                  style={{
                    minWidth: '100vw',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    padding: '2rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#ccc',
                      width: '100vw',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#101010',
                    }}
                  >
                    ВИДЕО
                  </div>
                  <p
                    style={{
                      marginTop: '2rem',
                      fontSize: '1.2rem',
                      maxWidth: '600px',
                      textAlign: 'center',
                      lineHeight: 1.6,
                    }}
                  >
                    Делаем сайты, которые работают. Без шаблонов — только индивидуальные решения с аналитикой,
                    продуманным дизайном и мощным кодом. Для бизнеса, а не для галочки.
                  </p>
                </div>

                {/* Блок 3 — заглушка под следующее */}
                <div
                  style={{
                    minWidth: '100vw',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '2rem',
                  }}
                >
                  Продолжение “О нас”...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;
