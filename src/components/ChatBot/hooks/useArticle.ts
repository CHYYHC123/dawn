import useSWR from 'swr';
import { ARTICLE, articleFetcher } from '@/api';

export interface UseArticleOptions {
  /** 为 false 时不发起请求（如已有本地缓存时可用） */
  enabled?: boolean;
}

/** 获取文章列表（接口） */
export function useArticle(options?: UseArticleOptions) {
  const enabled = options?.enabled !== false;
  const key = enabled ? ARTICLE.queryArticle : null;

  return useSWR(key, articleFetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
    dedupingInterval: 60000
  });
}
