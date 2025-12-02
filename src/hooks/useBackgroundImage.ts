import { useState, useEffect } from 'react';

// const CACHE_KEY = 'bg_image';
// const CACHE_TIME_KEY = 'bg_image_time';
// const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 小时

type Candidate = { type: 'bing'; url: string } | { type: 'url'; url: string } | { type: 'local'; url: string };

import LOCAL_FALLBACK from '@/assets/default-bg.jpg';
import LOCAL_FALLBACK2 from '@/assets/default-bg2.jpg';

import { MOMENTUM_IMAGE } from '@/assets/js/config';

const LOCAL_IMAGE = [LOCAL_FALLBACK, LOCAL_FALLBACK2];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getBingWallpaper() {
  try {
    const res = await fetch('https://bing.biturl.top/?resolution=1920&format=json');
    const data = await res.json();
    return data.url; // 直接就是高清图
  } catch (err) {
    return null;
  }
}

export function useBackgroundImage() {
  const [bg, setBg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  // 'bing' | 'momentum' | 'local' | null
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 构建候选数组：把 bing 作为一项，其它 URL / 本地图片作为各自项
  const buildCandidates = (): Candidate[] => {
    const candidates: Candidate[] = [];

    // 把 bing 作为一个候选类型（仅占一项）
    candidates.push({ type: 'bing', url: '' });

    // 把 momentum URL 加入候选
    for (const url of MOMENTUM_IMAGE) {
      candidates.push({ type: 'url', url });
    }

    // 把本地图加入候选
    for (const url of LOCAL_IMAGE) {
      candidates.push({ type: 'local', url });
    }

    return candidates;
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    setSource(null);
    const candidates = buildCandidates();
    const choice = pickRandom(candidates);
    if (['url', 'local'].includes(choice.type)) {
      setBg(choice.url);
      setSource(choice.type === 'url' ? 'momentum' : 'local');
      setLoading(false);
      return;
    }
    setSource('bing');
    const url = await getBingWallpaper();
    if (url) {
      setBg(url);
      setLoading(false);
      return;
    }
    // fallback 池（Momentum + local）
    const fallbackPool = [...MOMENTUM_IMAGE, ...LOCAL_IMAGE];
    const fallbackUrl = pickRandom(fallbackPool);
    setBg(fallbackUrl);
    // 设置正确的 source 标识（momentum 或 local）
    setSource(MOMENTUM_IMAGE.includes(fallbackUrl) ? 'momentum' : 'local');
    setLoading(false);
    setError('Bing 请求失败，使用 fallback 图片');
    return;
  };

  useEffect(() => {
    load();
    // 只在 mount 时运行一次，每次打开新标签页会重新 mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { bg, loading, source, error, reload: load };
}
