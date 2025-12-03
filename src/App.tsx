import { DndContext } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';

import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import DawnSearch from '@/components/Search';

import useSettingStore from '@/store/useSettingStore';

export default function App() {
  const { bg, loading } = useBackgroundImage();
  const isShow = useSettingStore(s => s.showSky);

  return (
    <DndContext>
      <div className="min-h-screen bg-cover bg-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <AnimatePresence mode="wait">
          <motion.div key="layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            {!isShow && (
              <Layout header={<Header />} footer={<Footer />}>
                <DawnSearch />
              </Layout>
            )}
            <Background bg={bg} loading={loading} />
          </motion.div>
        </AnimatePresence>
      </div>
    </DndContext>
  );
}
