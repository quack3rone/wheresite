import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, delay } from 'framer-motion';
import '../styles/about.css';

  // Добавь перед const About = ({ ... }) => {
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };


const About = ({ transitionActive, footerRef, targetSection, onSectionReached, isAlreadyOnAbout }) => {
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

  const [currentSection, setCurrentSection] = useState("О нас");
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const getDesktopSectionThresholds = (width) => {
    // Базовые значения (можно настроить под ваш дизайн)
    if (width < 1600) return { reviews: 2710, prices: 3735, order: 4965 };
    if (width < 1680) return { reviews: 2770, prices: 3600, order: 4670 };
    if (width < 1920) return { reviews: 3020, prices: 4075, order: 5340 };
    if (width < 2048) return { reviews: 3080, prices: 4170, order: 5490 };
    if (width < 2560) return { reviews: 3500, prices: 4300, order: 6000 };
    return { reviews: 4000, prices: 5000, order: 7000 }; // Для очень больших экранов
  };

  const getMobileSectionThresholds = (width) => {
    if (width < 380) return { reviews: 1790, prices: 2590, order: 3690 };
    if (width < 390) return { reviews: 1800, prices: 2600, order: 3605 };
    if (width < 400) return { reviews: 1910, prices: 2665, order: 3600 };
    if (width < 420) return { reviews: 1910, prices: 2670, order: 3535 };
    if (width < 440) return { reviews: 1825, prices: 2555, order: 3450 };
    return { reviews: 1915, prices: 2630, order: 3440 }; // Примерные значения для мобилок
  };

  // Сброс скролла при выходе с About
  useEffect(() => {
    if (!showContent && scrollRef.current) {
      // Сбрасываем когда контент скрывается (переход на главную)
      scrollRef.current.scrollTop = 0;
      setScrollY(0);
      setCurrentSection("О нас");
    }
  }, [showContent]);

  // Автоскролл к нужной секции
  useEffect(() => {
    if (targetSection && !isAutoScrolling) {
      // Если уже были на About - скролим сразу, если нет - ждем 2 секунды
      const delay = isAlreadyOnAbout ? 0 : 2000;
      
      const timer = setTimeout(() => {
        // Проверяем что About действительно открыт и готов к скроллу
        if (!scrollRef.current || !showContent) return;
        
        setIsAutoScrolling(true);
        
        let targetScrollPosition = 0;
      
        // Получаем текущие пороги с учетом ширины экрана
        const thresholds = isMobile 
          ? getMobileSectionThresholds(window.innerWidth) 
          : getDesktopSectionThresholds(window.innerWidth);
        
        // Добавляем +10 к каждому порогу
        switch (targetSection) {
          case "О нас":
            targetScrollPosition = 1;
            break;
          case "Отзывы":
            targetScrollPosition = isMobile ? thresholds.reviews + 50 : thresholds.reviews + 10;
            break;
          case "Цены":
            targetScrollPosition = isMobile ? thresholds.prices + 50 : thresholds.prices + 10;
            break;
          case "Заказать сайт":
            targetScrollPosition = isMobile ? thresholds.order + 50 : thresholds.order + 10;
            break;
          default:
            targetScrollPosition = 0;
        }

        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }

        // Устанавливаем правильную секцию сразу после начала скролла
        setTimeout(() => {
          setCurrentSection(targetSection);
          if (onSectionReached) {
            onSectionReached(targetSection);
          }
          
          // Отключаем флаг автоскролла
          setTimeout(() => {
            setIsAutoScrolling(false);
          }, 500);
        }, 100);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [targetSection, isAlreadyOnAbout, showContent, onSectionReached]); // Убрали transitionActive из зависимостей

  useEffect(() => {
  const video = videoRef.current;
  if (isActive && video) {
    const tryPlay = () => {
      if (video.readyState >= 3) {
        video.play().catch(e => console.error("Video failed to play:", e));
      } else {
        video.addEventListener("canplaythrough", () => {
          video.play().catch(e => console.error("Video failed to play after canplaythrough:", e));
        }, { once: true });
      }
    };
    tryPlay();
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

    const debouncedResize = debounce(updateFooterWidth, 150);

    updateFooterWidth(); // сразу
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
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

    const debouncedResize = debounce(updateAboutPosition, 150);

    updateAboutPosition();
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
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
    const scrollTop = currentRef.scrollTop;
    setScrollY(scrollTop);

    if (isAutoScrolling) return;

    const thresholds = isMobile 
      ? getMobileSectionThresholds(window.innerWidth) 
      : getDesktopSectionThresholds(window.innerWidth);

    let newSection = "О нас";

    if (scrollTop > thresholds.order) newSection = "Заказать сайт";
    else if (scrollTop > thresholds.prices) newSection = "Цены";
    else if (scrollTop > thresholds.reviews) newSection = "Отзывы";

    if (newSection !== currentSection) {
      setCurrentSection(newSection);
      onSectionReached?.(newSection);
    }
  };

  currentRef.addEventListener('scroll', handleScroll);
  return () => currentRef.removeEventListener('scroll', handleScroll);
}, [scrollRef.current, currentSection, isMobile, onSectionReached, isAutoScrolling]); // Добавили isAutoScrolling в зависимости
  if (!isActive) return null;

  const aboutVariants = {
  hidden: {
    opacity: 0,
    y: isMobile ? 40 : -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier, более плавная кривая
      delay: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: isMobile ? 50 : -30,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.2, 0.7, 0.8], // быстрая анимация исчезновения
    },
  },
};

  

return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          key="about"
          variants={aboutVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
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
            <div className="container-mobile">
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
                <h2 className="glow-title-about-mobile">Умный дизайн. Чистый код.</h2>
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
                  animate={{ y: scrollY * -0.3 }}
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
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`mobile-scroll-text ${i === 8 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
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
              {/* Блок 3 - горизонтальный текст с прокруткой */}
              <motion.div className="mobile-horizontal-scroll-price">
                <motion.div
                  className="mobile-scroll-content-price"
                  animate={{ 
                    x: -scrollY * 1,
                  }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`mobile-scroll-text ${i === 5 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
                    >
                      Цены
                    </div>
                  ))}
                </motion.div>
              </motion.div>
              {/* Блок 3 - цены */}
              <div className="mobile-block-3">
                <h2 className="mobile-glow-title">Ваш бюджет. Наши идеи. Идеальная пара.</h2>

                <div className="mobile-text-content">
                  <p className="mobile-block-3-paragraph">
                    Мы подходим к каждому проекту индивидуально — цена зависит от объёма, задач, функционала и сроков.
                  </p>
                  <p className="mobile-block-3-paragraph">
                    Мы только запустились, и сейчас работаем без жёсткой ценовой сетки, поэтому вы можете получить по-настоящему качественный сайт по гибкой и выгодной стоимости — в зависимости от ваших целей и задач.
                  </p>
                </div>

                <div className="mobile-block-3-list">
                  <p className="mobile-block-3-subtitle">Обратитесь к нам, и мы:</p>
                  <ul className="mobile-block-3-ul">
                    <li>Поймём, что нужно именно вам</li>
                    <li>Придумаем оптимальный формат сайта</li>
                    <li>Согласуем цену и сроки</li>
                  </ul>
                </div>
              </div>
              {/* Блок 4 - горизонтальный текст с прокруткой */}
              <motion.div className="mobile-horizontal-scroll-order">
                <motion.div
                  className="mobile-scroll-content-order"
                  animate={{ 
                    x: -scrollY * 1,
                  }}
                  transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`mobile-scroll-text-order ${i === 5 ? 'vertical-text-active' : 'vertical-text-inactive'}`}
                    >
                      Заказать сайт
                    </div>
                  ))}
                </motion.div>
              </motion.div>
              {/* Блок 4 - заказать сайт */}
              <div className="mobile-telegram-contact-section">
                <div className="mobile-telegram-contact-content">
                  <div className="mobile-telegram-text-block">
                    <p className="mobile-telegram-text-top">Начните с простого шага.</p>
                    <p className="mobile-telegram-text-bottom">Напишите нам.</p>
                  </div>

                  <a href="https://t.me/quack3r1" target="_blank" rel="noopener noreferrer" className="mobile-telegram-icons-line">
                    <img src="/icons/telegram.svg" alt="Telegram" className="mobile-telegram-icon" />
                    <img src="/icons/telegram.svg" alt="Telegram" className="mobile-telegram-icon" style={{ opacity: 0.25 }} />
                    <img src="/icons/telegram.svg" alt="Telegram" className="mobile-telegram-icon" style={{ opacity: 0.25 }} />
                    <img src="/icons/telegram.svg" alt="Telegram" className="mobile-telegram-icon" style={{ opacity: 0.25 }} />
                  </a>

                  <p className="mobile-telegram-description">
                    Без менеджеров. Без автоответов. Только честный диалог и реальные решения.
                  </p>
                </div>

                <div className="mobile-where-site-block">
                  <div className="mobile-where-site-text">WHERE SITE?</div>
                  <div className="mobile-where-site-subtext">Вы уже знаете, где.</div>
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
                    <h2 className="glow-title-about">Умный дизайн. Чистый код.</h2>
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
                      {[...Array(14)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-about ${i === 6? 'vertical-text-active' : 'vertical-text-inactive'}`}
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
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-about ${i === 14? 'vertical-text-active' : 'vertical-text-inactive'}`}
                        >
                          Цены
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                  {/* Блок 3 - цены*/}
                  <div className="block-3-content">
                    <div className="block-3-text">
                      <h2 className="glow-title">Ваш бюджет. Наши идеи. Идеальная пара.</h2>
                    </div>
                    
                    <div className="content-wrapper">
                      <div className="text-content">
                        <p className="block-3-paragraph">
                          Мы подходим к каждому проекту индивидуально — цена зависит от объёма, задач, функционала и сроков.
                        </p>
                        <p className="block-3-paragraph">
                          Мы только запустились, и сейчас работаем без жёсткой ценовой сетки, поэтому вы можете получить по-настоящему качественный сайт по гибкой и выгодной стоимости — в зависимости от ваших целей и задач.
                        </p>
                      </div>
                      
                      <div className="block-3-list">
                        <p className="block-3-subtitle">Обратитесь к нам, и мы:</p>
                        <ul className="block-3-ul">
                          <li>Поймём, что нужно именно вам</li>
                          <li>Придумаем оптимальный формат сайта</li>
                          <li>Согласуем цену и сроки</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Блок 4 — вертикальный текст */}
                  <motion.div className="vertical-text-section-order-about">
                    <motion.div
                      animate={{ 
                        x: 100,
                        y: -scrollY + getYOffset(window.innerWidth) - 750,
                      }}
                      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                      className="vertical-text-container-order-about"
                    >
                      {[...Array(14)].map((_, i) => (
                        <div
                          key={i}
                          className={`vertical-text-order-about ${i === 8? 'vertical-text-active' : 'vertical-text-inactive'}`}
                        >
                          Заказать сайт
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                  {/* Блок 4 — заказать сайт */}
                  <div className="telegram-contact-section">
                    <div className="telegram-contact-content">
                      <div className="telegram-text-block">
                        <p className="telegram-text-top">Начните с простого шага.</p>
                        <p className="telegram-text-bottom">Напишите нам.</p>
                      </div>
                      
                      <a href="https://t.me/wheresite" target="_blank" rel="noopener noreferrer" className="telegram-icons-line">
                        <img src="/icons/telegram.svg" alt="Telegram" className="telegram-icon" />
                        <img src="/icons/telegram.svg" alt="Telegram" className="telegram-icon" style={{opacity: 0.25}} />
                        <img src="/icons/telegram.svg" alt="Telegram" className="telegram-icon" style={{opacity: 0.25}} />
                        <img src="/icons/telegram.svg" alt="Telegram" className="telegram-icon" style={{opacity: 0.25}} />
                      </a>
                      
                      <p className="telegram-description">
                        Без менеджеров. Без автоответов. Только честный диалог и реальные решения.
                      </p>
                    </div>

                    <div className="where-site-block">
                      <div className="where-site-text">WHERE SITE?</div>
                      <div className="where-site-subtext">Вы уже знаете, где.</div>
                    </div>
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