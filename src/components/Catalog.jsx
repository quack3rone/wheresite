import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLocation, useNavigationType} from 'react-router-dom';
import About from '../components/About';

const Catalog = ({ scrollY, onScrollEnd, isInteractive }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [offset, setOffset] = useState(0);
  const [autoScrollProgress, setAutoScrollProgress] = useState(0);
  const [autoScrollStart, setAutoScrollStart] = useState(null);
  const [activeProject, setActiveProject] = useState(null); // <--- Текущий hover
  const lastScrollY = useRef(0);
  const [transitionActive, setTransitionActive] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [navigationTarget, setNavigationTarget] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const footerWidth = 268;
  const [footerShift, setFooterShift] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const footerRef = useRef(null); // ✅ добавлено

  const mobileShift = 40;
  const desktopShift = 200;
  const shift = isMobile ? mobileShift : desktopShift;

  const [targetSection, setTargetSection] = useState(null);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Динамическое вычисление left в зависимости от ширины экрана
  const leftPosition = window.innerWidth <= 450
    ? "30px"
    : window.innerWidth >= 451 && window.innerWidth <= 768
    ? "60px" // сдвигаем на 20px влево для ширины от 451px до 768px
    : "60px"; // для ширины больше 768px, оставляем как было

  useEffect(() => {
  const updateMobileShift = () => {
    const footerBaseHeight = 186; // базовая расчетная высота (как 268 у ширины)
    const screenHeight = window.innerHeight;

    const adjustedHeight = screenHeight; // никаких zoom-факторов
    const shift = Math.max(adjustedHeight - footerBaseHeight, 0);
    setFooterHeight(shift);
  };

  if (window.innerWidth <= 768) {
    updateMobileShift();
    window.addEventListener("resize", updateMobileShift);
    return () => window.removeEventListener("resize", updateMobileShift);
  }
}, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
  const updateShift = () => {
    const footerWidth = 268;
    const screenWidth = window.innerWidth;

    // Динамический zoomFactor
    let zoomFactor = 1;
    if (screenWidth >= 3840) {
      zoomFactor = 2.273;
    } else if (screenWidth >= 2560) {
      zoomFactor = 1.540;
    } else if (screenWidth >= 2048) {
      zoomFactor = 1.204;
    } else if (screenWidth >= 1920) {
      zoomFactor = 1.123;
    } else if (screenWidth >= 1680) {
      zoomFactor = 1.175;
    } else if (screenWidth >= 1600) {
      zoomFactor = 1.001;
    } 

    const adjustedWidth = screenWidth / zoomFactor;
    const shift = Math.max(adjustedWidth - footerWidth, 0);
    setFooterShift(shift);
  };

  updateShift(); // сразу
  window.addEventListener("resize", updateShift);
  return () => window.removeEventListener("resize", updateShift);
}, []);



// 👉 если на about, сразу активируем transition
useEffect(() => {
  const handleClickOutside = (event) => {
    // Проверяем, был ли клик вне футера
    if (footerRef.current && !footerRef.current.contains(event.target)) {
      // Если мы не на about странице и есть активная ссылка - сбрасываем
      if (location.pathname !== '/about' && activeLink) {
        setActiveLink(null);
        setTargetSection(null);
      }
    }
  };

  // Добавляем обработчик только на мобильных устройствах
  if (isMobile) {
    document.addEventListener('touchstart', handleClickOutside);
    return () => document.removeEventListener('touchstart', handleClickOutside);
  }
}, [activeLink, location.pathname, isMobile]);


useEffect(() => {
  // Обработка прямого перехода на /about
  if (location.pathname === '/about') {
    if (navigationType === 'POP') {
      // Нажата стрелка "вперёд" из истории
      setTransitionActive(true);
      setActiveLink("О нас");
    } else {
      // Обычный переход с кнопки
      setTransitionActive(true);
      setActiveLink("О нас");
    }
  }

  if (location.pathname === '/' && navigationType === 'POP') {
    // Назад по стрелке браузера
    setIsBackNavigation(true);
    setTransitionActive(false); // проигрываем анимацию обратно
    setActiveLink(null);
    setTargetSection(null); // Добавить эту строку
  }
}, [location.pathname, navigationType]);

// Сброс при программном переходе на главную
useEffect(() => {
  if (location.pathname === '/' && !transitionActive && !isBackNavigation) {
    setTargetSection(null);
    setActiveLink(null);
  }
}, [location.pathname, transitionActive, isBackNavigation]);


useEffect(() => {
  // Запускаем переход после анимации
  if (transitionActive && navigationTarget && !isLoading) { 
    const timeout = setTimeout(() => {
      navigate(navigationTarget);
    }, 800);
    return () => clearTimeout(timeout);
  }

  if (isBackNavigation) {
    const timeout = setTimeout(() => {
      // Просто сбрасываем флаг — переход уже был браузером
      setIsBackNavigation(false);
    }, 800);
    return () => clearTimeout(timeout);
  }
}, [transitionActive, navigationTarget, isBackNavigation, navigate, isLoading]);


  const baseProgress = Math.pow(Math.min(Math.max(scrollY / 220, 0), 1), 1.4); 
  const progress = autoScrollStart !== null 
    ? autoScrollStart + (1 - autoScrollStart) * autoScrollProgress
    : Math.min(baseProgress, 1);

  const outlineOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(outlineOpacity, {
    damping: 30,
    stiffness: 120,
    mass: 1.2
  });

  useEffect(() => {
    if (progress >= 1) {
      onScrollEnd(true);
    }
  }, [progress, onScrollEnd]);

  useEffect(() => {
    const handleScroll = (e) => {
      // ❗ Не обрабатываем скролл, если progress == 1 и мы не на главной
      if (progress >= 1 && location.pathname !== '/') return;

      const direction = e.deltaY > 0 ? 1 : -1;
      setLastScrollTime(Date.now());
      setIsScrolling(true);
      outlineOpacity.set(1);

      if (progress >= 0.3) {
        setOffset(prev => Math.max(Math.min(prev + direction * 1, 5), -5));
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [outlineOpacity, progress, location.pathname]);


  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastScrollTime > 300 && isScrolling) {
        setIsScrolling(false);
        outlineOpacity.set(0);
        setOffset(0);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastScrollTime, isScrolling, outlineOpacity]);
  
  const [smoothedProgress, setSmoothedProgress] = useState(0);

  useEffect(() => {
  let animationFrame;

  const animate = () => {
    setSmoothedProgress(prev => {
      const diff = progress - prev;
      const speed = 0.1; // 0.05 — медленно, 0.2 — быстро
      if (Math.abs(diff) < 0.001) return progress;
      return prev + diff * speed;
    });
    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationFrame);
}, [progress]);


  // useEffect(() => {
  //   const tiffa = projects.find(p => p.name === "mbirthday");
  //   setActiveProject(tiffa);
  // }, []);


  // Проекты с URL и картинкой
  const projects = [
  {
    name: "Wheresite",
    url: "localhost:3000",
    image: "/images/wheresite.png",
    hoverColor: "#FF0733",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "TiffaLi",
    url: "https://tiffali.ru",
    image: "/images/tttt.png",
    hoverColor: "#ffa5e5",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "10%", top: "30%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "mbirthday",
    url: "https://momsbirthday.online",
    image: "/images/mbirthday.jpg",
    hoverColor: "#00751bff",
    position: { left: "50%", top: "15%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "380px", height: "auto" },
    mobilePosition: { left: "20%", top: "25%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "250px", height: "auto" }
  },
  {
    name: "buysoon",
    url: "https://example.com",
    image: "/images/.png",
    hoverColor: "#808080ff",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" },
    disabled: true,
  },
  {
    name: "Comesoon",
    url: "https://example.com",
    image: "/images/.png",
    hoverColor: "#808080ff",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" },
    disabled: true,
  },
];

// Обработчики событий мыши (остаются без изменений)
const handleProjectMouseEnter = (project) => {
  setActiveProject(project);
};

const handleProjectMouseLeave = () => {
  setActiveProject(null);
};

// Сброс targetSection при переходе на главную
useEffect(() => {
  if (location.pathname === '/' && !transitionActive) {
    setTargetSection(null);
  }
}, [location.pathname, transitionActive]);

const targetMargin = progress >= 1
  ? 0
  : (1 - smoothedProgress) * -shift;

  useEffect(() => {
  if (!isLoading) return;

  const assetsToLoad = [
    '/video/wheresitemp52white.mp4',
    '/icons/user.svg',
    '/icons/sensor-alert.svg',
    '/icons/magic-wand.svg',
    '/icons/key.svg',
    '/icons/money-simple-from-bracket.svg',
    '/icons/site-browser.svg',
    '/icons/apps.svg',
    '/icons/fingerprint.svg',
    '/icons/quote.svg',
    '/icons/telegram.svg'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToLoad.length;
  const minLoadTime = 2000;
  const startTime = Date.now();

  const updateProgress = () => {
    const elapsedTime = Date.now() - startTime;
    const timeProgress = Math.min(elapsedTime / minLoadTime, 1);
    const assetProgress = loadedCount / totalAssets;
    const finalProgress = Math.min(timeProgress, assetProgress) * 100;
    setLoadingProgress(Math.floor(finalProgress));

    if (finalProgress >= 100) {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 200);
    }
  };

  assetsToLoad.forEach(src => {
    if (src.includes('.mp4')) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = src;
      video.oncanplaythrough = () => {
        loadedCount++;
        updateProgress();
      };
      video.onerror = () => {
        loadedCount++;
        updateProgress();
      };
    } else {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        updateProgress();
      };
      img.onerror = () => {
        loadedCount++;
        updateProgress();
      };
      img.src = src;
    }
  });

  const progressInterval = setInterval(updateProgress, 50);
  return () => clearInterval(progressInterval);
}, [isLoading]);


  return (
    <>
      {/* Белый фон */}
      <motion.div
        className="catalog-background"
        initial={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 2,
          opacity: progress * 0.1,
          pointerEvents: 'none',
        }}
      />

      {/* Каталог */}
      <motion.div
        className="catalog-container"
        style={{
          position: 'fixed',
          top: 0,
          left: `${140 - progress * 150}%`,
          width: '110vw',
          height: 'calc(100vh - 2rem + 1px)',
          backgroundColor: 'white',
          zIndex: 4,
          padding: '1rem',
          overflow: 'hidden',
          pointerEvents: progress >= 1 ? 'auto' : 'none', // ✅ Вот это главное

          overflow: 'hidden', // 🔒 чтобы контент не вылезал за границы
        }}
      >
        <div className="left-rounded-bar"></div>

        <div className="grid-overlay">
          {/* Горизонтальные */}
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />

          {/* Вертикальные */}
          <div className="vertical-line center" />
          <div className="vertical-line left-1" />
          <div className="vertical-line left-2" />
          <div className="vertical-line right-1" />
          <div className="vertical-line right-2" />
        </div>

                
        <motion.div
          className="catalog-content"
          animate={{ marginLeft: `${targetMargin}px` }}
          transition={{
            type: "tween",
            duration: progress >= 1 ? 0 : 0.4,
            ease: "easeOut"
          }}
        >


          <div className="catalog-title-container" style={{ position: 'relative' }}>
            <motion.h2
              className="catalog-title-outline"
              animate={{ x: offset }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: smoothOpacity
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 5
              }}
            >
              Наши проекты
            </motion.h2>

            <h2 className="catalog-title" style={{ position: 'relative', zIndex: 1 }}>
              Наши проекты
            </h2>
          </div>
          {/* ВСТАВИТЬ СЮДА */}
          <AnimatePresence>
            {activeProject && (
              <motion.div
                key={activeProject.name}
                initial={{
                  x: isMobile ? 0 : 800,
                  y: isMobile ? 800 : 0,
                  scale: 1.6,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  x: isMobile ? 0 : 800,
                  y: isMobile ? 800 : 0,
                  scale: 1.6,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 20,
                  mass: 0.8,
                }}
                style={{
                  position: "fixed",
                  left: isMobile
                    ? activeProject.mobilePosition?.left
                    : activeProject.position.left,
                  top: isMobile
                    ? activeProject.mobilePosition?.top
                    : activeProject.position.top,
                  transform: "translateX(-50%)",
                  width: isMobile
                    ? activeProject.mobileSize?.width
                    : activeProject.size.width,
                  height: isMobile
                    ? activeProject.mobileSize?.height
                    : activeProject.size.height,
                  zIndex: 1,
                  pointerEvents: "none",
                  overflow: "hidden",
                  clipPath: "inset(0 0 0 0)",
                  transformOrigin: "right center",
                }}
              >
                <motion.img
                  src={activeProject.image}
                  alt={activeProject.name}
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: isMobile
                      ? activeProject.mobileImageSize?.width
                      : activeProject.imageSize?.width,
                    height: isMobile
                      ? activeProject.mobileImageSize?.height
                      : activeProject.imageSize?.height,
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

           {/* Блюр-зона справа */}
           <motion.div
              className="blur-zone"
              animate={
                isMobile
                  ? {
                      y: transitionActive ? -footerHeight : 0,
                      backdropFilter: transitionActive ? 'blur(6px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)',
                      WebkitBackdropFilter: transitionActive ? 'blur(6px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)', // Safari
                    }
                  : {
                      x: transitionActive ? -footerShift : 0,
                      backdropFilter: transitionActive ? 'blur(9px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)',
                      WebkitBackdropFilter: transitionActive ? 'blur(9px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)', // Safari
                    }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                zIndex: 1,
                filter: 'url(#liquid-distortion)', // Применяем искажения
                WebkitFilter: 'url(#liquid-distortion)', // Для Safari
                borderRadius: '36px', // Скругление углов
                ...(isMobile
                  ? {
                      bottom: 0,
                      left: leftPosition,

                      right: 0,
                      height: '187px',
                      width: `calc(100% - (${parseInt(leftPosition, 10) * 1.6}px))`,
                    }
                  : {
                      top: 0,
                      right: "30px",
                      width: '270px',
                      height: '100%',
                    }),
              }}
            />

            {/* Новый блок для обводки */}
            <motion.div
              className="border-overlay"
              animate={
                isMobile
                  ? {
                      y: transitionActive ? -footerHeight : 0,
                    }
                  : {
                      x: transitionActive ? -footerShift : 0,
                    }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                zIndex: 2, // Это выше, чем основной блок, чтобы быть поверх
                borderRadius: '36px', // Скругление углов
                border: '2.5px solid rgba(197, 197, 197, 0.7)', // Обводка
                boxShadow: '0 1px 20px rgba(0, 0, 0, 0.25)', // Тень к обводке
                pointerEvents: 'none',
                ...(isMobile
                  ? {
                      bottom: 0,
                      left: leftPosition,
                      right: 0,
                      height: '187px',
                      width: `calc(100% - (${parseInt(leftPosition, 10) * 1.6}px))`,
                    }
                  : {
                      top: 0,
                      right: "30px",
                      width: '269px',
                      height: '100%',
                    }),
              }}
            />

            {/* Второй блок для обводки без тени, сдвинутый на 1 пиксель вправо */}
            <motion.div
              className="border-overlay-2"
              animate={
                isMobile
                  ? {
                      y: transitionActive ? -footerHeight : 0,
                    }
                  : {
                      x: transitionActive ? -footerShift : 0,
                    }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                zIndex: 3, // Это выше, чем первый блок, но ниже основного
                borderRadius: '36px', // Скругление углов
                border: '2px solid rgba(255, 255, 255, 0.7)', // Обводка
                pointerEvents: 'none', // Блок с обводкой не блокирует клики
                ...(isMobile
                  ? {
                      bottom: 0,
                      left: leftPosition,
                      right: 0,
                      height: '184px',
                      width: `calc(100% - (${parseInt(leftPosition, 10) * 1.6}px))`,
                    }
                  : {
                      top: 0,
                      right: "28px", // Сдвигаем на 1 пиксель вправо
                      width: '270px',
                      height: '100%',
                    }),
              }}
            />

            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
              <defs>
                <filter id="liquid-distortion" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                  <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                  <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>
            
          <div className="projects-list">
            {projects.map((project, index) => (
              <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-item-container"
              onMouseEnter={() => handleProjectMouseEnter(project)}
              onMouseLeave={handleProjectMouseLeave}
              style={{ "--hover-color": project.hoverColor, pointerEvents: transitionActive ? 'none' : (progress >= 1 ? 'auto' : 'none'), }}
            >
              {/* Обёртка для ограничения размеров обводки */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <motion.div
                  className={`project-item-outline ${project.disabled ? 'project-item--disabled' : ''}`}
                  animate={{ x: offset }}
                  style={{
                    opacity: smoothOpacity
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 5
                  }}
                >
                  {project.name}
                </motion.div>
            
                <div
                  className={`project-item ${project.disabled ? 'project-item--disabled' : ''}`}
                >
                  {project.name}
                </div>
              </div>
            </a>
            ))}
          </div>

          <motion.div
            className="catalog-footer"
            ref={footerRef}  // 👈 Вот он!
            animate={
              isMobile
                ? { y: transitionActive ? -footerHeight : 0 }
                : { x: transitionActive ? -footerShift : 0 }
            }
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {isMobile ? (
              <div className="footer-logo-block">
                <img src="/images/wheresite4.png" className="footer-logo" />
                <div className="footer-label">WHERE SITE?</div>
                <div className="footer-meta">
                  <div>2025, Where is site?</div>
                  <div>wheresite9@gmail.com</div>
                </div>
              </div>
            ) : (
              <div className="footer-box">
                <div className="footer-logo-block">
                  <img src="/images/wheresite4.png" className="footer-logo" />
                  <div className="footer-label">WHERE SITE?</div>
                </div>
              </div>
            )}

            <div className="footer-links">
              {["О нас", "Отзывы", "Цены", "Заказать сайт"].map((text) => (
                <div
                  key={text}
                  className={`footer-link ${activeLink === text ? "active" : ""}`}
                  onClick={() => {
                    const route = "/about";
                    const isCurrentlyOnAbout = location.pathname === route;
                    
                    console.log('Click:', { text, activeLink, isCurrentlyOnAbout, transitionActive }); // Для отладки
                    
                    if (activeLink === text && isCurrentlyOnAbout && transitionActive) {
                      // Если уже активная ссылка на About И мы там И transition активен - закрываем
                      setTransitionActive(false);
                      setActiveLink(null);
                      setTargetSection(null);
                      setTimeout(() => {
                        navigate('/');
                      }, 800);
                    } else if (activeLink === text && !isCurrentlyOnAbout) {
                      // Если ссылка активна, но мы НЕ на about странице - деактивируем
                      setActiveLink(null);
                      setTargetSection(null);
                      setTransitionActive(false);
                    } else if (activeLink === text && isCurrentlyOnAbout && !transitionActive) {
                      // Если активна и мы на about но transition неактивен - деактивируем
                      setActiveLink(null);
                      setTargetSection(null);
                    } else if (isCurrentlyOnAbout && activeLink !== text) {
                      // Если уже на About, но другая ссылка - меняем активную секцию
                      setActiveLink(text);
                      setTargetSection(text);
                    } else {
                      // Обычный переход - активируем ссылку и переходим
                      setIsLoading(true); // Добавить
                      setLoadingProgress(0); // Добавить
                      setTransitionActive(true);
                      setActiveLink(text);
                      setNavigationTarget(route);
                      setTargetSection(text);
                    }
                  }}
                >
                  <span className={activeLink === text ? "active" : ""}>{text}</span>
                </div>
              ))}
            </div>

            {!isMobile && (
              <div className="footer-meta">
                <div>2025</div>
                <div>Where is site?</div>
                <div>wheresite9@gmail.com</div>
              </div>
            )}

          </motion.div>
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={
                isMobile
                  ? { y: transitionActive ? 1 : '100%' }
                  : { x: transitionActive ? 1 : '100%' }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`transition-panel ${isMobile ? 'mobile' : 'desktop'}`}
              style={{
                '--footer-width': `${footerWidth}px`,
                '--footer-height': `${footerHeight}px`
              }}
            />
        </motion.div>
        <About 
          transitionActive={transitionActive && !isLoading} // Изменить эту строку
          footerRef={footerRef}
          targetSection={targetSection}
          isAlreadyOnAbout={location.pathname === '/about'}
          onSectionReached={(section) => {
            setActiveLink(section);
            if (section === targetSection) {
              setTargetSection(null);
            }
          }}
        />

      </motion.div>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'transparent',
              zIndex: 100,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              pointerEvents: 'auto'
            }}
          >
            <motion.div
              initial={isMobile ? 
                { x: '100vw', scaleX: 0.5, scaleY: 1.5 } : 
                { y: '-100vh', scaleX: 0.01, scaleY: 18}
              }
              animate={isMobile ? 
                { x: '-20px', scaleX: 1, scaleY: 1 } : 
                { y: '20px', scaleX: 1, scaleY: 1 }
              }
              exit={isMobile ? 
                { x: '100vw', scaleX: 0.5, scaleY: 0.4, opacity: 0 } : 
                { y: '-100vh', scaleX: 0.01, scaleY: 18, opacity: 0 }
              }
              transition={{ 
                type: 'spring',
                duration: 1,
                damping: isMobile ? 14 : 13,
                stiffness: isMobile ? 80 : 120,
                mass: isMobile ? 2 : 0.6,
                delay: 0.1,
              }}
              style={{
                position: 'absolute',
                top: isMobile ? '200px' : '0px',
                right: isMobile ? '0px' : '50px',
                transformOrigin: 'center'
              }}
            >
              <div
                className="loading-text"
                style={{
                  fontSize: isMobile ? '50px' : '70px',
                  fontWeight: '200',
                  color: 'transparent',
                  WebkitTextStroke: '1px white',
                  textStroke: '1px white',
                  fontFamily: 'WS'
                }}
              >
                {loadingProgress}%
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Catalog;
