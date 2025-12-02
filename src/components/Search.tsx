import { useEffect, useState, KeyboardEvent } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { getTime } from '@/utils/index';
import { useGreeting } from '@/hooks/useGreeting';
import Input from '@/components/common/input';

export default function DawnSearch() {
  const [time, setTime] = useState('--');
  const greeting = useGreeting();

  useEffect(() => {
    const tick = () => {
      const t = getTime();
      setTime(t);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value.trim();
      if (!value) return;
      chrome.search.query({
        text: value,
        disposition: 'CURRENT_TAB'
      });
    }
  };

  const [show, setShow] = useState(false);
  // 页面加载后稍微延迟再显示
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100); // 100ms 延迟
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full flex flex-col items-center justify-center bg-cover bg-center">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 2 }} // 初始状态：透明+向下偏移
            animate={{ opacity: 1, y: 0 }} // 动画到：完全显示，归位
            exit={{ opacity: 0, y: 50 }} // 离开动画，可选
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center w-full"
          >
            <h1 className="text-white text-9xl font-semibold drop-shadow-lg mb-4 select-none">{time}</h1>
            <p className="text-white text-6xl font-bold drop-shadow-md mb-10 select-none">{greeting}</p>

            {/* <motion.div
              variants={searchInputVariants} // 应用搜索框变体
              className="relative w-full max-w-2xl flex items-center gap-3 rounded-full px-3 py-3 shadow-2xl backdrop-blur-md overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 to-white/30 border border-white/30 pointer-events-none"></div>

              <Input type="text" placeholder="Search" className="relative z-10 w-full bg-transparent text-white/90 placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-transparent text-xl border-none font-medium" onKeyDown={handleKeyDown} />
            </motion.div> */}

            <div className="w-full max-w-2xl flex items-center gap-3 bg-white/20 rounded-full px-3 py-3 shadow-2xl border border-white/20 backdrop-blur-sm">
              <Input type="text" placeholder="Search" className="bg-transparent text-white/90  focus:outline-none focus:ring-0 focus:ring-transparent text-xl border-none font-medium" onKeyDown={handleKeyDown} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
