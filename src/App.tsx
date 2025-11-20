// import React, { useEffect, useState } from 'react';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';
import DawnSearch from '@/components/Search';

export default function App() {
  const { bg, loading } = useBackgroundImage();
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Layout header={<Header />} footer={<Footer />}>
        <DawnSearch />
      </Layout>
      <Background bg={bg} loading={loading} />
    </div>
  );
}
