import { useState } from 'react';
import DefaultBg from '@/assets/default-bg.jpg';
import OverlayPng from '@/assets/overlay-bg.png';

interface BackgroundProps {
  bg: string;
  loading: boolean;
}
export default function Background({ bg }: BackgroundProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* 1. 实际背景图 */}
      <img
        src={bg || DefaultBg}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease',
          filter: 'brightness(0.95)'
        }}
      />
      {/* 2. Overlay：先展示，避免白屏 */}
      <div
        style={{
          backgroundImage: `url(${OverlayPng})`,
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundSize: 'cover',
          opacity: 0.35,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );

  // return (
  //   <div
  //     style={{
  //       position: 'fixed',
  //       inset: 0,
  //       backgroundImage: `url(${bg ?? DefaultBg})`,
  //       backgroundSize: 'cover',
  //       backgroundPosition: 'center',
  //       backgroundRepeat: 'no-repeat',
  //       filter: 'brightness(0.95)'
  //     }}
  //   />
  // );
}
