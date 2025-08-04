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
    '/images/1primer.jpeg',
    '/images/2primer.jpeg',
    '/images/3primer.jpeg',
    '/images/4primer.jpeg',
  ];

  let loadedCount = 0;
  const totalAssets = criticalAssets.length;
  
  const updateProgress = () => {
    const assetProgress = loadedCount / totalAssets;
    const finalProgress = assetProgress * 100;
    
    setLoadingProgress(Math.floor(finalProgress));
    
    // Убираем загрузку сразу когда все ресурсы готовы
    if (finalProgress >= 100) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100); // Минимальная задержка для плавности
    }
  };

  // Предзагрузка с Promise.all для более точного контроля
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        updateProgress();
        resolve(img);
      };
      img.onerror = () => {
        loadedCount++;
        updateProgress();
        reject(new Error(`Failed to load ${src}`));
      };
      img.src = src;
    });
  };

  // Загружаем все изображения параллельно
  const loadAllImages = criticalAssets.map(loadImage);
  
  Promise.allSettled(loadAllImages).then(() => {
    // Все изображения обработаны (загружены или ошибка)
    if (loadedCount === totalAssets) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  });

  // Cleanup не нужен, так как убрали setInterval
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
