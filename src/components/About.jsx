import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const About = ({ transitionActive }) => {
  const location = useLocation();
  const isActive = location.pathname === '/about';
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Показываем лоадер при входе
  useEffect(() => {
    if (isActive && transitionActive) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, transitionActive]);

  // Прячем контент, когда transitionActive становится false
  useEffect(() => {
    if (!transitionActive) {
      setShowContent(false); // мгновенно убираем при возврате назад
    }
  }, [transitionActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      {showContent && (
      <motion.div
        key="about"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          left: '270px', // ⚠️ важный момент — отступ слева, чтобы не перекрыть футер
          backgroundColor: 'transperent',
          zIndex: 9,
          padding: '2rem',
          color: 'white',
          overflowY: 'auto',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>О нас</h1>
            <p style={{ lineHeight: 1.6 }}>
              Мы создаем современные и уникальные сайты. Наша команда — это разработчики, дизайнеры и проект-менеджеры с вниманием к деталям.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;
