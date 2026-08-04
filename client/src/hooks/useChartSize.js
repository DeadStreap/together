import { useState, useEffect } from 'react';
import { getChartSize } from '../config/chartConfig';

export const useChartSize = (type) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return getChartSize(type, windowWidth);
};
