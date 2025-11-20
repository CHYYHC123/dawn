import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from '@/hooks/useQuote';
const Footer: React.FC = () => {
  const { quote, isLoading, error, fetchNewQuote } = useQuote();
  return (
    <AnimatePresence>
      <motion.div className="w-full h-16 flex items-center justify-center" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <div className="text-white/95 font-medium text-base font-sans">{quote?.text}</div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Footer;
