// import React, { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
// import Draggable from '@/components/common/Draggable';

import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import DawnSearch from '@/components/Search';

// import { useInitialPosition } from '@/hooks/useInitialPosition';
// import { useRef } from 'react';

export default function App() {
  const { bg, loading } = useBackgroundImage();

  // const taskRef = useRef<any>(null);
  // const { initialPos, initialLoading } = useInitialPosition(taskRef);
  // console.log('initialPos', initialPos);

  return (
    <DndContext>
      <div className="min-h-screen bg-cover bg-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Layout header={<Header />} footer={<Footer />}>
          <DawnSearch />

          {/* <Draggable id="x1_tasks" initialPosition={initialPos}>
            <div ref={taskRef as React.Ref<HTMLDivElement>}>
              <Tasks />
            </div>
          </Draggable> */}
        </Layout>
        <Background bg={bg} loading={loading} />
      </div>
    </DndContext>
  );
}
