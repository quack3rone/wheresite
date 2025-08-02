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
    if (width < 1680) return -190;
    if (width >= 1680 && width < 1920) return -240;
    if (width >= 1920 && width < 2048) return -290;
    if (width >= 2048 && width < 2560) return -295;
    if (width >= 2560 && width < 3840) return -335;
    if (width >= 3840) return -415;
    return -190; // значение по умолчанию
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
              {/* Блок 1 - горизонтальный текст с прокруткой */}
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

              {/* Блок 1 - видео + текст */}
              <div className="mobile-content-section">
                <div className="video-container-mobile">
                      <video
                        ref={videoRef}
                        src="/video/wheresitemp52white.mp4"
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

              {/* Блок 1 - о нас */}
              <div className="mobile-about-info-wrapper">
                <div className="mobile-info-column">
                  <h5>Почему именно мы</h5>
                  <div className="mobile-info-block">
                    <img src="/icons/user.svg" alt="Индивидуальный подход" className="mobile-info-icon" />
                    <div>
                      <h4>Индивидуальный подход:</h4>
                      <p>никакой работы по шаблону. Мы не подгоняем вас под рамки платформ, мы создаём сайт под вас.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/sensor-alert.svg" alt="Техническая глубина" className="mobile-info-icon" />
                    <div>
                      <h4>Техническая глубина:</h4>
                      <p>работаем с современными и гибкими технологиями - это позволяет нам реализовывать не просто сайты, а настоящие веб-приложения.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/magic-wand.svg" alt="Дизайн" className="mobile-info-icon" />
                    <div>
                      <h4>Дизайн, который выделяет:</h4>
                      <p>мы не используем готовые темы. Каждый макет создаётся вручную, чтобы передать дух вашего бренда.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/key.svg" alt="Полный цикл" className="mobile-info-icon" />
                    <div>
                      <h4>Полный цикл:</h4>
                      <p>от идеи до запуска. Мы настраиваем хостинг, SEO и рекламу. Всё — в одних руках.</p>
                    </div>
                  </div>
                </div>

                <div className="mobile-info-column">
                  <h5>Какие сайты мы разрабатываем</h5>
                  <div className="mobile-info-block">
                    <img src="/icons/money-simple-from-bracket.svg" alt="Лендинги" className="mobile-info-icon" />
                    <div>
                      <h4>Лендинги:</h4>
                      <p>Одностраничные сайты, идеально подходящие для презентации одного продукта или услуги.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/site-browser.svg" alt="Корпоративные сайты" className="mobile-info-icon" />
                    <div>
                      <h4>Корпоративные сайты:</h4>
                      <p>Презентация вашего бизнеса в интернете: услуги, портфолио, команда, кейсы, форма обратной связи.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/apps.svg" alt="Веб-приложения" className="mobile-info-icon" />
                    <div>
                      <h4>Веб-приложения и платформы:</h4>
                      <p>Интеграции с платёжными системами, CRM, аналитикой и складским учётом.</p>
                    </div>
                  </div>
                  <div className="mobile-info-block">
                    <img src="/icons/fingerprint.svg" alt="Интернет-магазины" className="mobile-info-icon" />
                    <div>
                      <h4>Интернет-магазины:</h4>
                      <p>Базы данных, личные кабинеты, фильтрация, аналитика, автоматизация процессов.</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="mobile-question-column"
                  animate={{ y: scrollY * -0.7 }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {'?'.repeat(23).split('').map((char, i) => (
                    <div key={i} className="vertical-question">{char}</div>
                  ))}
                </motion.div>
              </div>
              {/* Блок 2 - горизонтальный текст с прокруткой */}
              <motion.div className="mobile-horizontal-scroll-reviews">
                <motion.div
                  className="mobile-scroll-content-reviews"
                  animate={{ 
                    x: -scrollY * 1,
                  }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`mobile-scroll-text ${i === 7 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
                    >
                      Отзывы
                    </div>
                  ))}
                </motion.div>
              </motion.div>
              {/* Блок 2 — отзывы */}
              <div className="mobile-reviews-section">
                <div className="mobile-review-card">
                  <div className="mobile-review-header-block">
                    <img src="/icons/quote.svg" alt="quote" className="mobile-quote-icon" />
                    <div className="mobile-review-header">
                      <h3 className="mobile-review-name">Людмила</h3>
                      <p className="mobile-review-role">Сайт-приглашение на день рождения</p>
                    </div>
                  </div>
                  <p className="mobile-review-body">
                    Спасибо за качественную, оперативную работу. Работа с моим сайтом из-за моих обстоятельств несколько затягивалась, однако на все мои письма я сразу же получала ответ, работа выполнена качественно.
                  </p>
                  <a className="mobile-review-site" href="https://momsbirthday.ru" target="_blank" rel="noopener noreferrer">
                    momsbirthday.ru
                  </a>
                </div>

                <div className="mobile-review-card">
                  <div className="mobile-review-header-block">
                    <img src="/icons/quote.svg" alt="quote" className="mobile-quote-icon" />
                    <div className="mobile-review-header">
                      <h3 className="mobile-review-name">Надежда</h3>
                      <p className="mobile-review-role">Интернет-магазин цветов с доставкой</p>
                    </div>
                  </div>
                  <p className="mobile-review-body">
                    Все круто. Ребята молодцы. Куча шаблонов на выбор. Грамотные специалисты, быстро реагирующие на просьбы. Я лично в восторге, что у меня личный интернет-магазин. Мегагрупп — это лучшее, с чем я сталкивалась!
                  </p>
                  <a className="mobile-review-site" href="https://tiffali.ru" target="_blank" rel="noopener noreferrer">
                    tiffali.ru
                  </a>
                </div>
              </div>


            </div>
          ) : (
            // Десктоп версия
            <div className="container">
              <div className="sticky-section">
                <div className="scrolling-content" style={{ transform: `translateX(-${scrollY}px)` }}>
                  {/* Блок 1 - вертикальный текст */}
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
                  {/* Блок 1 - видео + текст */}
                  <div className="content-section">
                    <div className="video-container">
                      <video
                        ref={videoRef}
                        src="/video/wheresitemp52white.mp4"
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>
                    <p className="description">
                      Делаем сайты, которые работают. Без шаблонов — только индивидуальные решения с аналитикой,
                      продуманным дизайном и мощным кодом.
                    </p>
                  </div>
                  {/* Блок 1 - о нас */}
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
                          <p>работаем с современными и гибкими технологиями - это позволяет нам реализовывать не просто сайты, а настоящие веб-приложения.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/magic-wand.svg" alt="Дизайн" className="info-icon" />
                        <div>
                          <h4>Дизайн, который выделяет:</h4>
                          <p>мы не не используем готовые темы. Каждый макет создаётся вручную, с нуля, чтобы максимально передать дух вашего бренда.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/key.svg" alt="Полный цикл" className="info-icon" />
                        <div>
                          <h4>Полный цикл:</h4>
                          <p>от идеи до запуска. Мы разрабатываем, подключаем домен, настраиваем хостинг, SEO и рекламу. Вам не нужно искать подрядчиков — всё в одних руках.</p>
                        </div>
                      </div>
                    </div>

                    <div className="info-column">
                      <h5 className="align-title">Какие сайты мы разрабатываем</h5>
                      <div className="info-block">
                        <img src="/icons/money-simple-from-bracket.svg" alt="Лендинги" className="info-icon" />
                        <div>
                          <h4>Лендинги:</h4>
                          <p>Одностраничные сайты, идеально подходящие для презентации одного продукта или услуги.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/site-browser.svg" alt="Корпоративные сайты" className="info-icon" />
                        <div>
                          <h4>Корпоративные сайты:</h4>
                          <p>Презентация вашего бизнеса в интернете: услуги, портфолио, команда, кейсы, форма обратной связи.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/apps.svg" alt="Веб-приложения" className="info-icon" />
                        <div>
                          <h4>Веб-приложения и платформы:</h4>
                          <p>Функциональные, безопасные и удобные в использовании. Интеграции с платёжными системами, CRM, аналитикой и складским учётом.</p>
                        </div>
                      </div>
                      <div className="info-block">
                        <img src="/icons/fingerprint.svg" alt="Интернет-магазины" className="info-icon" />
                        <div>
                          <h4>Интернет-магазины:</h4>
                          <p>Сложные системы: базы данных, личные кабинеты, фильтрация, сортировка, аналитика, автоматизация процессов.</p>
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
                    {'? '.repeat(12)}
                  </motion.div>
                  {/* Блок 2 — вертикальный текст */}
                  <motion.div className="vertical-text-section-reviews-about">
                    <motion.div
                      animate={{ 
                        x: -1900,
                        y: -scrollY + getYOffset(window.innerWidth) - 100,
                      }}
                      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                      className="vertical-text-container-reviews-about"
                    >
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-about ${i === 7? 'vertical-text-active' : 'vertical-text-inactive'}`}
                        >
                          Отзывы
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                  {/* Блок 2 — отзывы */}
                  <div className="reviews-section">
                    <div className="review-card">
                      <div className="review-header-block">
                        <img src="/icons/quote.svg" alt="quote" className="quote-icon" />
                        <div className="review-header">
                          <h3 className="review-name">Людмила</h3>
                          <p className="review-role">Сайт-приглашение на день рождения</p>
                        </div>
                      </div>
                      <p className="review-body">
                        Спасибо за качественную, оперативную работу. Работа с моим сайтом из-за моих обстоятельств несколько затягивалась, однако на все мои письма я сразу же получала ответ, работа выполнена качественно.
                      </p>
                      <a className="review-site" href="https://momsbirthday.ru" target="_blank" rel="noopener noreferrer">
                        momsbirthday.ru
                      </a>
                    </div>

                    <div className="review-card">
                      <div className="review-header-block">
                        <img src="/icons/quote.svg" alt="quote" className="quote-icon" />
                        <div className="review-header">
                          <h3 className="review-name">Надежда</h3>
                          <p className="review-role">Интернет-магазин цветов с доставкой</p>
                        </div>
                      </div>
                      <p className="review-body">
                        Все круто. Ребята молодцы. Куча шаблонов на выбор. Грамотные специалисты, быстро реагирующие на просьбы. Я лично в восторге, что у меня личный интернет-магазин. Мегагрупп — это лучшее, с чем я сталкивалась!
                      </p>
                      <a className="review-site" href="https://tiffali.ru" target="_blank" rel="noopener noreferrer">
                        tiffali.ru
                      </a>
                    </div>
                  </div>
                  {/* Блок 3 — вертикальный текст */}
                  <motion.div className="vertical-text-section-price-about">
                    <motion.div
                      animate={{ 
                        x: 10,
                        y: -scrollY + getYOffset(window.innerWidth),
                      }}
                      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                      className="vertical-text-container-price-about"
                    >
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-about ${i === 14? 'vertical-text-active' : 'vertical-text-inactive'}`}
                        >
                          Цены
                        </div>
                      ))}
                    </motion.div>
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