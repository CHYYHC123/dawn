import { useState, useEffect } from 'react';

// const CACHE_KEY = 'bg_image';
// const CACHE_TIME_KEY = 'bg_image_time';
// const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 小时

type Candidate = { type: 'bing'; url: string } | { type: 'url'; url: string } | { type: 'local'; url: string };

import LOCAL_FALLBACK from '@/assets/default-bg.jpg';
import LOCAL_FALLBACK2 from '@/assets/default-bg2.jpg';

const MOMENTUM_IMAGE = [
  'https://momentum.photos/img/8a3e99bf-36aa-4c84-a0ce-b49e1b47d0c2.jpg?momo_cache_bg_uuid=2d0f5c24-9e80-478e-b25f-c49799e717cb',
  'https://images.unsplash.com/photo-1435783099294-283725c37230?ixlib=rb-0.3.5&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&s=4794ac75c92bc641bdd8d1781cf2e49d?momo_cache_bg_uuid=e952fd10-1887-41da-9f98-c57e097f404a',
  'https://momentum.photos/img/8a3e99bf-36aa-4c84-a0ce-b49e1b47d0c2.jpg',
  'https://farm3.staticflickr.com/2888/33038677584_8f3755dd1c_k.jpg',
  'https://images.unsplash.com/photo-1548022401-6b11ed578cc7?ixlib=rb-1.2.1&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&ixid=eyJhcHBfaWQiOjcwOTV9',
  'https://images.unsplash.com/photo-1435783099294-283725c37230?ixlib=rb-0.3.5&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&s=4794ac75c92bc641bdd8d1781cf2e49d',
  'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?ixlib=rb-0.3.5&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&s=66634d2c2fe8175ab6c9494fde6e9470',
  'https://momentum.photos/img/d607688d-2098-4dc0-a5f1-853b4d87dc1f.jpg',
  'https://images.unsplash.com/photo-1528183087798-c83d848b0ecd?ixlib=rb-1.2.1&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&ixid=eyJhcHBfaWQiOjcwOTV9'
];
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
