import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from '@/hooks/useQuote';
import Tasks from '@/components/Tasks/index';
// move-MoveRight
import { MoveRight } from 'lucide-react';
import { Tooltip } from '@mantine/core';

import useSettingStore from '@/store/useSettingStore';

const Footer: React.FC = () => {
  const { quote } = useQuote();
  const setShowSky = useSettingStore(s => s.setShowSky);

  return (
    <AnimatePresence>
      <motion.div className="w-full h-16 flex items-center justify-between mx-10 mb-5" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <motion.div
          className=""
          animate={{
            x: [0, 10, 0], // 左右移动
            opacity: [0.8, 0.5, 0.8] // 同步透明度变化
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Tooltip label={<div className="text-white/90">starry sky</div>} color="rgba(0,0,0,0.3)">
            <MoveRight
              size={24}
              className="text-white cursor-pointer"
              onClick={() => {
                setShowSky(true);
              }}
            />
          </Tooltip>
        </motion.div>
        <div className="text-white/95 font-medium text-base font-sans">{quote?.text}</div>
        <div className="mb-0">
          <Tasks />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Footer;
