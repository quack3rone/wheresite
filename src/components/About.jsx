import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const About = ({ transitionActive, footerRef }) => {
  const location = useLocation();
  const isActive = location.pathname === '/about';
  const [showContent, setShowContent] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [footerWidth, setFooterWidth] = useState(268); // начальное значение
  const [aboutLeftShift, setAboutLeftShift] = useState(0);

   // Получаем ширину футера через footerRef
  useEffect(() => {
    const updateFooterWidth = () => {
      if (footerRef.current) {
        const computedStyle = window.getComputedStyle(footerRef.current);
        const width = parseFloat(computedStyle.width);
        setFooterWidth(width);
      }
    };

    updateFooterWidth(); // сразу
    window.addEventListener('resize', updateFooterWidth);

    return () => {
      window.removeEventListener('resize', updateFooterWidth);
    };
  }, [footerRef]);

  // Также можно использовать ResizeObserver для более точного отслеживания
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setFooterWidth(width);
      }
    });

    observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [footerRef]);

  useEffect(() => {
  const updateAboutPosition = () => {
    const width = window.innerWidth;
    let shift = 0;

    if (width < 1680) {
      shift = -31; // левее на 10px
    } else if (width >= 1680 && width < 1920) {
      shift = 15; // правее на 5px
    } else if (width >= 1920 && width < 2048) {
      shift = 1;
    } else if (width >= 2048 && width < 2560) {
      shift = 22; // примерно правее
    } else if (width >= 2560 && width < 3840) {
      shift = 111; // ещё правее
    } else if (width >= 3840) {
      shift = 305; // ещё правее
    }


    setAboutLeftShift(shift);
  };

  updateAboutPosition();
  window.addEventListener('resize', updateAboutPosition);

    return () => {
      window.removeEventListener('resize', updateAboutPosition);
    };
  }, []);

  useEffect(() => {
    if (isActive && transitionActive) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isActive, transitionActive]);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (!currentRef) return;

    const handleScroll = () => {
      setScrollY(currentRef.scrollTop);
    };

    currentRef.addEventListener('scroll', handleScroll);
    return () => currentRef.removeEventListener('scroll', handleScroll);
  }, [scrollRef.current]); // Добавьте зависимость

  if (!isActive) return null;
  

return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          key="about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            top: isMobile ? "187px" : 0,
            left: isMobile ? 0 : `${footerWidth + aboutLeftShift}px`,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 10,
            backgroundColor: 'transparent',
            borderRadius: isMobile ? '36px 36px 0px 0px' : '36px 0px 0px 36px', // ✅ добавлено
          }}
          ref={scrollRef}
        >
          {isMobile ? (
            // Мобильная версия
            <div style={{ height: '8000px', position: 'relative' }}>
              {/* Блок 1 — горизонтальный текст с прокруткой */}
              <motion.div 
                style={{
                  width: '100vw',
                  height: '10vh',
                  position: 'relative',
                  top: "10px",
                  overflowY: 'hidden',
                  scrollbarWidth: 'none', // Скрываем скроллбар в Firefox
                  msOverflowStyle: 'none', // Скрываем скроллбар в IE
                  '&::-webkit-scrollbar': { // Скрываем скроллбар в Chrome/Safari
                    display: 'none',
                    width: 0,
                    height: 0,
                    background: 'transparent'
                  }
                }}
              >
                <motion.div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '3vw', // Начальное смещение для центрирования
                    gap: '20px',
                    fontFamily: 'NauryzRedKeds',
                  }}
                  animate={{ 
                    x: -scrollY * 1, // Коэффициент можно регулировать
                  }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        color: i === 0 ? 'white' : 'rgba(255,255,255,0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      О нас
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Блок 2 — видео + текст */}
              <div style={{
                padding: '2rem',
                color: 'white',
              }}>
                <div style={{
                  backgroundColor: '#ccc',
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#101010',
                  marginBottom: '2rem'
                }}>
                  ВИДЕО
                </div>
                <p style={{
                  fontSize: '1rem',
                  textAlign: 'left',
                  lineHeight: 1.6,
                }}>
                  Делаем сайты, которые работают. Без шаблонов — только индивидуальные решения с аналитикой,
                  продуманным дизайном и мощным кодом. Для бизнеса, а не для галочки.
                </p>
              </div>

              {/* Блок 3 */}
              <div style={{
                padding: '2rem',
                color: 'white',
                fontSize: '1.5rem',
                textAlign: 'center',
                minHeight: '50vh'
              }}>
                Продолжение "О нас"...
              </div>
            </div>
          ) : (
            // Десктопная версия
            <div style={{ height: '8000px', position: 'relative' }}>
              <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  transform: `translateX(-${scrollY}px)`,
                  transition: 'transform 0.1s linear',
                  height: '100%',
                }}>
                  {/* Блок 1 — вертикальный текст */}
                  <motion.div style={{
                    minWidth: '20vw',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      animate={{ 
                        x: -100,
                        y: -scrollY + -170,
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
                    minWidth: '50vw',
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
                      width: '50vw',
                      height: '500px',
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
                      marginRight: "25rem",
                      fontSize: '1.2rem',
                      maxWidth: '600px',
                      textAlign: 'left',
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;