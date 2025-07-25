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

  const [isManualHover, setIsManualHover] = useState(false);
  const [autoProjectIndex, setAutoProjectIndex] = useState(0);
  const [isAutoActive, setIsAutoActive] = useState(false);
  const autoSwitchInterval = useRef(null);
  const manualHoverTimeout = useRef(null);

  const mobileShift = 40;
  const desktopShift = 200;
  const shift = isMobile ? mobileShift : desktopShift;

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
  }
}, [location.pathname, navigationType]);


useEffect(() => {
  // Запускаем переход после анимации
  if (transitionActive && navigationTarget) {
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
}, [transitionActive, navigationTarget, isBackNavigation, navigate]);


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
  }, [outlineOpacity, progress]);

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
  //   const tiffa = projects.find(p => p.name === "TiffaLi");
  //   setActiveProject(tiffa);
  // }, []);


  // Проекты с URL и картинкой
  const projects = [
  {
    name: "Wheresite",
    url: "localhost:3000",
    image: "/images/tiffali123.png",
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
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "mbirthday",
    url: "https://example.com/amvera",
    image: "/images/tiffali123.png",
    hoverColor: "#FF5733",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "Peakstore",
    url: "https://example.com/peakstore",
    image: "/images/tiffali123.png",
    hoverColor: "#FF5733",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com",
    image: "/images/tiffali123.png",
    hoverColor: "#FF5733",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
];


  // Добавьте это состояние после существующих useState
const [hoveredProjectName, setHoveredProjectName] = useState(null);
const autoSwitchIntervalRef = useRef(null);
const resumeTimeoutRef = useRef(null);

// Автопереключение - отдельный useEffect для инициализации
useEffect(() => {
  if (progress >= 1 && !isAutoActive && isMobile) { // Добавили проверку isMobile
    const initTimeout = setTimeout(() => {
      setIsAutoActive(true);
      setAutoProjectIndex(0);
      const firstProject = projects[0];
      setActiveProject(firstProject);
      setHoveredProjectName(firstProject.name);
      
      // Запускаем автопереключение
      autoSwitchIntervalRef.current = setInterval(() => {
        setAutoProjectIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % projects.length;
          const nextProject = projects[nextIndex];
          setActiveProject(nextProject);
          setHoveredProjectName(nextProject.name);
          return nextIndex;
        });
      }, 3000);
    }, 3000);

    return () => clearTimeout(initTimeout);
  }
}, [progress, isAutoActive, projects.length, isMobile]); // Добавили isMobile в зависимости

// Отдельный useEffect для управления остановкой/возобновлением
useEffect(() => {
  if (!isAutoActive || !isMobile) return; // Добавили проверку isMobile

  if (isManualHover) {
    // Останавливаем автопереключение при наведении
    if (autoSwitchIntervalRef.current) {
      clearInterval(autoSwitchIntervalRef.current);
      autoSwitchIntervalRef.current = null;
    }
    // Очищаем таймер возобновления
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  } else {
    // Возобновляем автопереключение через 3 секунды после убирания курсора
    if (!autoSwitchIntervalRef.current) {
      resumeTimeoutRef.current = setTimeout(() => {
        autoSwitchIntervalRef.current = setInterval(() => {
          setAutoProjectIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % projects.length;
            const nextProject = projects[nextIndex];
            setActiveProject(nextProject);
            setHoveredProjectName(nextProject.name);
            return nextIndex;
          });
        }, 3000);
      }, 3000);
    }
  }

  // Очистка при размонтировании
  return () => {
    if (autoSwitchIntervalRef.current) {
      clearInterval(autoSwitchIntervalRef.current);
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };
}, [isManualHover, isAutoActive, projects.length, isMobile]); // Добавили isMobile

// Обработчики событий мыши (остаются без изменений)
const handleProjectMouseEnter = (project) => {
  setIsManualHover(true);
  setActiveProject(project);
  setHoveredProjectName(project.name);
};

const handleProjectMouseLeave = () => {
  setIsManualHover(false);

};

const targetMargin = progress >= 1
  ? 0
  : (1 - smoothedProgress) * -shift;


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
                  x: isMobile ? 0 : -800,
                  y: isMobile ? 800 : 0,
                  scale: 1.6,
                  opacity: 0,
                }}
                animate={{
                  x: -100,
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
              className={`project-item-container ${hoveredProjectName === project.name ? 'auto-hovered' : ''}`}
              onMouseEnter={() => handleProjectMouseEnter(project)}
              onMouseLeave={handleProjectMouseLeave}
              style={{ "--hover-color": project.hoverColor }}
            >
              {/* Обёртка для ограничения размеров обводки */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <motion.div
                  className="project-item-outline"
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
            
                <div className="project-item">
                  {project.name}
                </div>
              </div>
            </a>
            ))}
          </div>

          <motion.div
            className="catalog-footer"
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
              {["О нас", "Заказать сайт", "Наша команда", "Цены"].map((text) => (
                <div
                  key={text}
                  className={`footer-link ${activeLink === text ? "active" : ""}`}
                  onClick={() => {
                    const route = "/about";
                    if (activeLink === text && location.pathname === route) {
                      setTransitionActive(false);
                      setTimeout(() => {
                        navigate('/');
                        setActiveLink(null);
                      }, 800);
                    } else {
                      setTransitionActive(true);
                      setActiveLink(text);
                      setNavigationTarget(route);
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
              style={{
                position: 'fixed',
                top: isMobile ? 'auto' : 0,
                right: 0,
                bottom: 0,
                left: isMobile ? 0 : `${footerWidth}px`,
                height: isMobile ? `${footerHeight}px` : '100%',
                backgroundColor: '#101010',
                zIndex: 8,
                pointerEvents: 'none',
                borderRadius: isMobile ? '36px 36px 0px 0px' : '36px 0px 0px 36px', // ✅ добавлено
                overflow: 'hidden', // 🔒 чтобы контент не вылезал за границы
              }}
            />

        </motion.div>
        <About transitionActive={transitionActive} />

      </motion.div>
    </>
  );
};

export default Catalog;
