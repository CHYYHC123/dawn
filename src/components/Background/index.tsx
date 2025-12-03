import { useState } from 'react';
import DefaultBg from '@/assets/default-bg.jpg';
import OverlayPng from '@/assets/overlay-bg.png';
import Fireworks from './Fireworks';

import useSettingStore from '@/store/useSettingStore';

interface BackgroundProps {
  bg: string;
  loading: boolean;
}
export default function Background({ bg }: BackgroundProps) {
  const [loaded, setLoaded] = useState(false);
  // const [isShow, setShow] = useState(false);
  const isShow = useSettingStore(s => s.showSky);
  return (
    <>
      {isShow ? (
        <Fireworks />
      ) : (
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
      )}
    </>
  );
}
