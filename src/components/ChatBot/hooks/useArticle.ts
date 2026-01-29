import useSWR from 'swr';
import { env } from '@/config/env';
import { articleFetcher } from '@/components/ChatBot/api';

const DEFAULT_ARTICLE_API = `${env.AI_API_LOCAL}/api/article/queryArticle`;

export function useArticle(articleUrl?: string) {
  const key = articleUrl ?? DEFAULT_ARTICLE_API;

  return useSWR(key, articleFetcher, {
    revalidateOnFocus: false, // 切回页面不自动刷新
    refreshInterval: 0, // 关闭轮询
    dedupingInterval: 60000 // 1 分钟内重复请求去重
  });
}
