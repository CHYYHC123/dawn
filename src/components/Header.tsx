import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWeatherTime } from '@/hooks/useWeatherTime';

const Header: React.FC = () => {
  const weather = useWeatherTime();
  console.log('weather', weather);
  if (!weather) return null; // 或 loading UI

  const { city, icon, temp, temperature } = weather;

  return (
    <AnimatePresence>
      <motion.div className="grid grid-cols-[1fr_auto] px-6 py-4" initial={{ opacity: 0, y: -1 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <div className="text-white col-start-2 h-12">
          <div className="flex items-center text-xl">
            <i className={`${icon} font-bold`}></i>
            <span className="text-white text-xl ml-2">
              {temp}
              {temperature}
            </span>
          </div>
          <span className="text-white text-sm font-medium">{city}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Header;
