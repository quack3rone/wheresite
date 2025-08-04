import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLocation, useNavigationType} from 'react-router-dom';
import About from '../components/About';

const MatrixEffect = ({ isVisible, isMobile }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateSize = () => {
      canvas.width = isMobile ? window.innerWidth : window.innerWidth / 2;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const characters = "SO0N?#@son";
    const fontSize = isMobile ? 14 : 15;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#000';

    const maxHeights = isMobile
      ? null
      : drops.map((_, i) => {
          const progress = i / columns;
          return Math.floor(canvas.height * (0.005 + 3 * progress));
        });

    const draw = () => {
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.clearRect(x, y - fontSize, fontSize, fontSize * 1.2);

        if (!isMobile || Math.random() > 0.5) {
          const char = characters[Math.floor(Math.random() * characters.length)];
          ctx.fillText(char, x, y);
        }

        if (!isMobile && y > maxHeights[i] && Math.random() > 0.5) {
          drops[i] = 0;
        }

        if (isMobile && y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, isMobile]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: isMobile ? '100%' : '50%',
        height: '100vh',
        zIndex: 1,
        backgroundColor: 'transparent',
        pointerEvents: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', background: 'transparent', filter: isMobile ? 'drop-shadow(0 4px 12px rgba(0,0,0,10))' : 'none' }}
      />
    </motion.div>
  );
};

const MultipleFolders = ({ project, isMobile }) => {
  if (!project || !project.isMultiple) return null;

  return (
    <div style={{ position: 'relative' }}>
      {project.folders.map((folder, index) => (
        <motion.div
          key={folder.name}
          initial={{
            x: isMobile ? 0 : 800,
            y: isMobile ? 800 : 0,
            scale: 0.6,
            opacity: 0,
          }}
          animate={{
            x: isMobile ? folder.mobileHeight : folder.distance,
            y: isMobile ? folder.mobileDistance : folder.height,
            scale: 1,
            opacity: 1,
          }}
          exit={{
            x: isMobile ? 0 : 800,
            y: isMobile ? 800 : 0,
            scale: 0.6,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 15,
            mass: 1,
            delay: folder.delay,
            bounce: 0.3,
          }}
          style={{
            position: "absolute",
            left: isMobile
              ? project.mobilePosition?.left
              : project.position.left,
            top: isMobile
              ? project.mobilePosition?.top
              : project.position.top,
            transform: "translateX(-50%)",
            zIndex: 3 - index,
            pointerEvents: "none",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.img
            src={project.image}
            alt={folder.name}
            animate={{
              rotateY: [0, 3, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: folder.delay + 1,
            }}
            style={{
              width: isMobile ? "100px" : "200px",
              height: isMobile ? "100px" : "200px",
              objectFit: "contain",
              filter: isMobile ? "drop-shadow(0 4px 6px rgba(0,0,0,1))" : "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              delay: folder.delay + 0.3,
              duration: 0.4,
            }}
            style={{
              marginTop: isMobile ? "-15px" : "-28px",
              fontSize: isMobile ? "16px" : "20px",
              fontWeight: "900",
              color: "#333",
              textAlign: "center",
              fontFamily: "g",
              filter: isMobile ? "drop-shadow(1px 1px 1px 3px rgba(255, 255, 255, 1))" : "none",
            }}
          >
            {folder.name}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const Catalog = ({ scrollY, onScrollEnd, isInteractive }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [offset, setOffset] = useState(0);
  const [autoScrollProgress, setAutoScrollProgress] = useState(0);
  const [autoScrollStart, setAutoScrollStart] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
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

  const footerRef = useRef(null);

  const mobileShift = 40;
  const desktopShift = 200;
  const shift = isMobile ? mobileShift : desktopShift;

  const [targetSection, setTargetSection] = useState(null);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const leftPosition = window.innerWidth <= 450
    ? "30px"
    : window.innerWidth >= 451 && window.innerWidth <= 768
    ? "60px"
    : "60px";

  useEffect(() => {
    const updateMobileShift = () => {
      const footerBaseHeight = 186;
      const screenHeight = window.innerHeight;

      const adjustedHeight = screenHeight;
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

    updateShift();
    window.addEventListener("resize", updateShift);
    return () => window.removeEventListener("resize", updateShift);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        if (location.pathname !== '/about' && activeLink) {
          setActiveLink(null);
          setTargetSection(null);
        }
      }
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleClickOutside);
      return () => document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [activeLink, location.pathname, isMobile]);


  useEffect(() => {
    if (location.pathname === '/about') {
      if (navigationType === 'POP') {
        setTransitionActive(true);
        setActiveLink("О нас");
      } else {
        setTransitionActive(true);
        setActiveLink("О нас");
      }
    }

    if (location.pathname === '/' && navigationType === 'POP') {
      setIsBackNavigation(true);
      setTransitionActive(false);
      setActiveLink(null);
      setTargetSection(null);
    }
  }, [location.pathname, navigationType]);

  useEffect(() => {
    if (location.pathname === '/' && !transitionActive && !isBackNavigation) {
      setTargetSection(null);
      setActiveLink(null);
    }
  }, [location.pathname, transitionActive, isBackNavigation]);


  useEffect(() => {
    if (transitionActive && navigationTarget && !isLoading) { 
      const timeout = setTimeout(() => {
        navigate(navigationTarget);
      }, 800);
      return () => clearTimeout(timeout);
    }

    if (isBackNavigation) {
      const timeout = setTimeout(() => {
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
        const speed = 0.1;
        if (Math.abs(diff) < 0.001) return progress;
        return prev + diff * speed;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress]);

  const projects = [
  {
    name: "Wheresite",
    url: "https://wheresite.ru",
    image: "/images/wheresitefolder.png",
    hoverColor: "#4faed6ff",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "30%", top: "50%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" },
    isMultiple: true,
    folders: [
      { 
        name: "wheresite?", 
        distance: 20, 
        delay: 0, 
        height: -215,
        mobileDistance: 150,
        mobileHeight: 150
      },
      { 
        name: "tiffali?", 
        distance: 240, 
        delay: 0.1, 
        height: 55,
        mobileDistance: -120,
        mobileHeight: 30
      },
      { 
        name: "mbirthday?", 
        distance: 140, 
        delay: 0.2, 
        height: 300,
        mobileDistance: -20,
        mobileHeight: 140
      },
      { 
        name: "soon?", 
        distance: 400, 
        delay: 0.3, 
        height: 225,
        mobileDistance: 320,
        mobileHeight: 20
      }
    ]
  },
  {
    name: "TiffaLi",
    url: "https://tiffali.ru",
    image: "/images/tttt.png",
    hoverColor: "#f2879cff",
    position: { left: "50%", top: "10%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "640px", height: "auto" },
    mobilePosition: { left: "10%", top: "35%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "320px", height: "auto" }
  },
  {
    name: "mbirthday",
    url: "https://momsbirthday.ru",
    image: "/images/mbirthday.jpg",
    hoverColor: "#548647ff",
    position: { left: "60%", top: "25%" },
    size: { width: "640px", height: "auto" },
    imageSize: { width: "350px", height: "auto" },
    mobilePosition: { left: "30%", top: "45%" },
    mobileSize: { width: "320px", height: "auto" },
    mobileImageSize: { width: "230px", height: "auto" }
  },
  {
    name: "buysoon",
    url: "https://wheresite.ru",
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
    url: "https://wheresite.ru",
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

  const handleProjectMouseEnter = (project) => {
    setActiveProject(project);
  };

  const handleProjectMouseLeave = () => {
    setActiveProject(null);
  };

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
      '/video/wheresitemp52whitefast.mp4',
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
    const minLoadTime = 2500;
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
        video.onloadeddata = () => {
          loadedCount++;
          updateProgress();
        };
        video.onerror = () => {
          loadedCount++;
          updateProgress();
        };
        video.src = src;
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
          pointerEvents: progress >= 1 ? 'auto' : 'none',

          overflow: 'hidden',
        }}
      >
        <div className="left-rounded-bar"></div>

        <div className="grid-overlay">
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />
          <div className="horizontal-line" />

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
 
          <AnimatePresence>
            {activeProject && activeProject.disabled && (
              <MatrixEffect 
                key="matrix-effect"
                isVisible={true} 
                isMobile={isMobile} 
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {activeProject && !activeProject.disabled && (
              <>
                {activeProject.isMultiple ? (
                  <MultipleFolders 
                    key={activeProject.name}
                    project={activeProject} 
                    isMobile={isMobile} 
                  />
                ) : (
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
                        borderRadius: activeProject.name === 'mbirthday' ? '20px' : 'none',
                        boxShadow: activeProject.name === 'mbirthday'
                        ? '5px 3px 3px 0px rgba(0, 0, 0, 0.1)'
                        : 'none'
                      }}
                    />
                  </motion.div>
                )}
              </>
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
                      WebkitBackdropFilter: transitionActive ? 'blur(6px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)',
                    }
                  : {
                      x: transitionActive ? -footerShift : 0,
                      backdropFilter: transitionActive ? 'blur(9px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)',
                      WebkitBackdropFilter: transitionActive ? 'blur(9px) saturate(180%) contrast(90%)' : 'blur(3px) saturate(180%) contrast(90%)',
                    }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                zIndex: 1,
                filter: 'url(#liquid-distortion)',
                WebkitFilter: 'url(#liquid-distortion)',
                borderRadius: '36px',
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
                boxShadow: '0 1px 20px rgba(0, 0, 0, 0.3)', // Тень к обводке
                pointerEvents: 'none',
                ...(isMobile
                  ? {
                      bottom: 0,
                      left: leftPosition,
                      right: 0,
                      height: '185.5px',
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
                border: '3px solid rgba(255, 255, 255, 0.7)', // Обводка
                pointerEvents: 'none', // Блок с обводкой не блокирует клики
                ...(isMobile
                  ? {
                      bottom: 0,
                      left: leftPosition,
                      right: 0,
                      height: '182px',
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
                  <div>
                  <a 
                    href="https://t.me/wheresite" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    t.me/wheresite
                  </a>
                </div>
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
                <div>
                  <a 
                    href="https://t.me/wheresite" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    t.me/wheresite
                  </a>
                </div>
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
