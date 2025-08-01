import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/about.css';

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
  const videoRef = useRef(null);

  useEffect(() => {
  if (isActive && videoRef.current) {
    videoRef.current.play().catch((e) => {
      console.error("Video failed to play:", e);
    });
  }
}, [isActive]);



  const getYOffset = (width) => {
    if (width < 1680) return -290;
    if (width >= 1680 && width < 1920) return -240;
    if (width >= 1920 && width < 2048) return -290;
    if (width >= 2048 && width < 2560) return -295;
    if (width >= 2560 && width < 3840) return -335;
    if (width >= 3840) return -415;
    return -290; // значение по умолчанию
  };

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
            <div className="container">
              {/* Блок 1 — горизонтальный текст с прокруткой */}
              <motion.div className="mobile-horizontal-scroll">
                <motion.div
                  className="mobile-scroll-content"
                  animate={{ 
                    x: -scrollY * 1,
                  }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`mobile-scroll-text ${i === 0 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
                    >
                      О нас
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Блок 2 — видео + текст */}
              <div className="mobile-content-section">
                <div className="video-container-mobile">
                      <video
                        ref={videoRef}
                        src="/video/wheresiteMOVTRAN.mp4"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>
                <p className="mobile-description">
                  Делаем сайты, которые работают. Без шаблонов — только индивидуальные решения с аналитикой,
                  продуманным дизайном и мощным кодом. Для бизнеса, а не для галочки.
                </p>
              </div>

              {/* Блок 3 */}
              <div className="mobile-continue-section">
                Продолжение "О нас"...
              </div>
            </div>
          ) : (
            // Десктоп версия
            <div className="container">
              <div className="sticky-section">
                <div className="scrolling-content" style={{ transform: `translateX(-${scrollY}px)` }}>
                  {/* Блок 1 — вертикальный текст */}
                  <motion.div className="vertical-text-section-about">
                    <motion.div
                      animate={{ 
                        x: -100,
                        y: -scrollY + getYOffset(window.innerWidth),
                      }}
                      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                      className="vertical-text-container-about"
                    >
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-about ${i === 4 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
                        >
                          О нас
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Блок 2 — видео + текст */}
                  <div className="content-section">
                    <div className="video-container">
                      <video
                        ref={videoRef}
                        src="/video/wheresiteMOVTRAN.mp4"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>
                    <p className="description">
                      Делаем сайты, которые работают. Без шаблонов — только индивидуальные решения с аналитикой,
                      продуманным дизайном и мощным кодом. Для бизнеса, а не для галочки.
                    </p>
                  </div>
                  {/* Блок 3 — заглушка под следующее */}
                  <div className="about-info-section">
                    <div className="info-column">
                      <h5>Почему именно мы</h5>
                      <div className="info-block">
                        <img src="/icons/user.svg" alt="Индивидуальный подход" className="info-icon" />
                        <div>
                          <h4>Индивидуальный подход:</h4>
                          <p>никакой работы по шаблону. Мы не подгоняем вас под рамки платформ, мы создаём сайт под вас.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/sensor-alert.svg" alt="Техническая глубина" className="info-icon" />
                        <div>
                          <h4>Техническая глубина:</h4>
                          <p>работаем с современными и гибкими технологиями — это позволяет нам реализовывать не просто сайты, а настоящие веб-приложения.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/magic-wand.svg" alt="Дизайн" className="info-icon" />
                        <div>
                          <h4>Дизайн, который выделяет:</h4>
                          <p>мы не используем готовые темы. Каждый макет создаётся вручную, с нуля, чтобы максимально передать дух вашего бренда.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/key.svg" alt="Полный цикл" className="info-icon" />
                        <div>
                          <h4>Полный цикл:</h4>
                          <p>от идеи до запуска. Всё — в одних руках. Вам не нужно искать подрядчиков.</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-column">
                      <h5>Какие сайты мы разрабатываем</h5>
                      <div className="info-block">
                        <img src="/icons/money-simple-from-bracket.svg" alt="Лендинги" className="info-icon" />
                        <div>
                          <h4>Лендинги:</h4>
                          <p>одностраничные сайты для презентации одного продукта или услуги.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/site-browser.svg" alt="Корпоративные сайты" className="info-icon" />
                        <div>
                          <h4>Корпоративные сайты:</h4>
                          <p>представляют ваш бизнес: услуги, команда, портфолио, кейсы.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/apps.svg" alt="Веб-приложения" className="info-icon" />
                        <div>
                          <h4>Веб-приложения и платформы:</h4>
                          <p>интеграции с CRM, аналитикой, платёжками. Удобство и безопасность.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/fingerprint.svg" alt="Интернет-магазины" className="info-icon" />
                        <div>
                          <h4>Интернет-магазины:</h4>
                          <p>сложные системы: фильтрация, сортировка, аналитика, личные кабинеты.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Вопросительные знаки */}
                  <motion.div
                    className="question-line"
                    animate={{ x: Math.min(scrollY * -1, -500) }} // ограничим до 4 блоков
                    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                  >
                    {'? '.repeat(14)}
                  </motion.div>
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