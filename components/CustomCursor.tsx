import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    let animationFrameId: number;
    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mousePos.current.x - 16}px, ${mousePos.current.y - 16}px)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('touchstart', updateCursor);
    window.addEventListener('touchmove', updateCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('touchstart', updateCursor);
      window.removeEventListener('touchmove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      <div className="w-8 h-8 music-keyboard-mask white-glow" />
    </div>
  );
};

export default CustomCursor;
