import { useEffect, useMemo, useState } from 'react';
import type { Article } from '@/types/article';
import { getArticleByDate, getArticleMeta, getTodayDateStr, setArticleBatch } from '@/components/ChatBot/utils/articleStorage';
import { useArticle } from '@/components/ChatBot/hooks/useArticle';

/**
 * 获取「当日」一道面试题，优先从本地按日期读取，无缓存或已过缓存范围时再请求接口并写入本地。
 * @returns todayArticle 今日面试题；isLoading 是否在请求中；refetch 强制重新拉取并更新缓存
 */
export function useTodayArticle() {
  const today = useMemo(() => getTodayDateStr(), []);
  console.log('today', today);
  const [todayArticle, setTodayArticle] = useState<Article | null>(() => getArticleByDate(today));
  // console.log('todayArticle', todayArticle);

  const needFetch = useMemo(() => {
    const cached = getArticleByDate(today);
    if (cached) return false;
    const meta = getArticleMeta();
    if (!meta) return true;
    return today > meta.endDate;
  }, [today]);
  // console.log('needFetch', needFetch);

  const { data, isLoading, mutate } = useArticle({ enabled: needFetch });

  useEffect(() => {
    if (!needFetch) {
      setTodayArticle(getArticleByDate(today));
      return;
    }
    if (!data?.data?.length) return;
    const articles = data.data as Article[];
    console.log('articles',articles)
    setArticleBatch(today, articles);
    setTodayArticle(getArticleByDate(today));
  }, [needFetch, today, data]);

  const refetch = () => mutate();

  return {
    todayArticle,
    isLoading: needFetch && isLoading,
    refetch
  };
}
