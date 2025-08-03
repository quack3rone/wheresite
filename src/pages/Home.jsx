import React, { useState, useEffect } from 'react';
import { animate } from 'framer-motion';
import VerticalText from '../components/VerticalText';
import VerticalText2 from '../components/VerticalText2';
import SidebarImage from '../components/SidebarImage';
import Catalog from '../components/Catalog';
import ScrollArrow from '../components/ScrollArrow';
import { useLocation } from 'react-router-dom';


const Home = () => {
  const location = useLocation();
  const isCatalogRoute = location.pathname !== '/'; // если не главная

  const [scrollY, setScrollY] = useState(isCatalogRoute ? 250 : 0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(isCatalogRoute);
  const [showCatalog, setShowCatalog] = useState(isCatalogRoute);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Предзагрузка критических ресурсов
  useEffect(() => {
    const criticalAssets = [
      '/images/wheresite4.png',
      '/images/1primer.png',
      '/images/2primer.png',
      '/images/3primer.png',
      '/images/4primer.png',
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length + 1; // +1 для проверки шрифтов
    const minLoadTime = 800; // минимум 800ms для плавности
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
        }, 200);
      }
    };

    // Проверка загрузки шрифтов
    const fontsToCheck = ['Sansation-Bold', 'g', 'NauryzRedKeds'];
    let fontsLoaded = 0;

    fontsToCheck.forEach(fontFamily => {
      if (document.fonts) {
        document.fonts.load(`1em ${fontFamily}`).then(() => {
          fontsLoaded++;
          if (fontsLoaded === fontsToCheck.length) {
            loadedCount++;
            updateProgress();
          }
        }).catch(() => {
          fontsLoaded++;
          if (fontsLoaded === fontsToCheck.length) {
            loadedCount++;
            updateProgress();
          }
        });
      }
    });

    // Fallback для старых браузеров
    if (!document.fonts) {
      setTimeout(() => {
        loadedCount++;
        updateProgress();
      }, 500);
    }

    // Загрузка изображений
    criticalAssets.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        updateProgress();
      };
      img.onerror = () => {
        loadedCount++; // считаем и ошибки, чтобы не зависнуть
        updateProgress();
      };
      img.src = src;
    });

    // Интервал для обновления прогресса по времени
    const progressInterval = setInterval(updateProgress, 50);
    return () => clearInterval(progressInterval);
  }, []);

  // Обработка колёсика мыши
  const handleWheel = (e) => {
    if (!isAnimationComplete || showCatalog) return;

    const step = e.deltaY * 0.1;
    setScrollY(prev => {
      const newValue = prev + step;
      return Math.max(-1, Math.min(newValue, 250));
    });
    setLastScrollTime(Date.now());

    if (scrollY >= 250) {
      setShowCatalog(true);
    }
  };

  // Обработка нажатия на стрелку (заменено на анимацию!)
  const handleArrowClick = () => {
    if (!isAnimationComplete) {
      setIsAnimationComplete(true);
    }

    animate(scrollY, 250, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (latest) => {
        setScrollY(latest);
      },
      onComplete: () => {
        setShowCatalog(true);
      },
    });
  };
  
  if (isLoading) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#101010',
        zIndex: 1000
      }}
    />
  );
}

return (
  <div 
    className="home-page"
    onWheel={handleWheel}
    style={{ 
      pointerEvents: isAnimationComplete ? 'auto' : 'none',
      overflow: 'hidden',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      overscrollBehavior: 'none',
    }}
  >
      {!showCatalog && (
        <>
          <VerticalText 
            onEnd={setIsAnimationComplete} 
            isAnimationComplete={isAnimationComplete} 
            scrollY={scrollY} 
          />
          <VerticalText2 
            isAnimationComplete={isAnimationComplete} 
            scrollY={scrollY} 
            lastScrollTime={lastScrollTime} 
          />
          <SidebarImage scrollY={scrollY} />
          <ScrollArrow onClick={handleArrowClick} scrollY={scrollY} />
          <Catalog 
            scrollY={scrollY} 
            onScrollEnd={setShowCatalog}
            targetSection={null}
          />
        </>
      )}
      {showCatalog && <Catalog scrollY={scrollY} onScrollEnd={setShowCatalog} />}
    </div>
  );
};

export default Home;
