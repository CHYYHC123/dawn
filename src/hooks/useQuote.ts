// useRandomQuote.ts
import { useState, useEffect, useCallback } from 'react';
// import { Quote, UseQuoteResult, ApiSource } from './types';
// 确保 types.ts 在同一目录下

export interface Quote {
  text: string;
  author: string;
}
// 默认的名言，用于初始状态和 API 获取失败时
const DEFAULT_QUOTE: Quote = {
  text: '无论你走了多远，你都可以走得更远。',
  author: '默认名言'
};

/**
 * 随机选择一个 API，并统一数据结构的函数。
 */
export interface ApiSource {
  name: string;
  url: string;
  parser: (data: any) => Quote; // 解析函数，将原始响应转换为统一的 Quote 结构
}
const fetchRandomQuoteData = async (): Promise<Quote> => {
  // 定义所有可用的 API 及其处理函数
  const apiSources: ApiSource[] = [
    {
      name: 'ZenQuotes (EN)',
      url: 'https://zenquotes.io/api/random',
      parser: data => ({
        // ZenQuotes 返回一个数组
        text: data[0]?.q || DEFAULT_QUOTE.text,
        author: data[0]?.a || 'Unknown'
      })
    },
    {
      name: 'Hitokoto 一言 (CN)',
      url: 'https://v1.hitokoto.cn/?c=all', // 常用分类
      parser: data => ({
        text: data.hitokoto || DEFAULT_QUOTE.text,
        // 优先使用作者 (from_who)，其次使用出处 (from)
        author: data.from_who || data.from || 'Unknown'
      })
    }
    // 可以在这里添加更多 API，并编写对应的解析器 (parser)
  ];

  // 随机选择一个 API
  const randomIndex = Math.floor(Math.random() * apiSources.length);
  // console.log('randomIndex', randomIndex);
  const selectedApi = apiSources[randomIndex];

  try {
    const response = await fetch(selectedApi.url);

    if (!response.ok) {
      // throw new Error(`API ${selectedApi.name} 返回状态码 ${response.status}`);
    }

    const data = await response.json();

    // 使用该 API 的特定解析器来标准化数据
    const quote = selectedApi.parser(data);

    if (!quote.text || !quote.author) {
      throw new Error('API 返回数据结构不完整或无效');
    }

    return quote;
  } catch (error) {
    // console.info(`[useRandomQuote] 获取名言失败 (${selectedApi.name}):`, error);
    // 失败时返回默认名言
    return DEFAULT_QUOTE;
  }
};

/**
 * React TypeScript 自定义 Hook：随机获取一条名言。
 * @param autoFetch 是否在组件挂载时自动获取 (默认为 true)
 * @returns {UseQuoteResult} 名言数据、状态和重新获取函数
 */
export interface UseQuoteResult {
  quote: Quote;
  isLoading: boolean;
  error: string | null;
  fetchNewQuote: () => Promise<void>; // 重新获取名言的函数
}
export function useQuote(autoFetch: boolean = true): UseQuoteResult {
  const [quote, setQuote] = useState<Quote>(DEFAULT_QUOTE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback 确保 fetchNewQuote 不会不必要地重建
  const fetchNewQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newQuote = await fetchRandomQuoteData();
      setQuote(newQuote);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setQuote(DEFAULT_QUOTE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自动获取逻辑
  useEffect(() => {
    if (autoFetch) {
      fetchNewQuote();
    }
    // ⚠️ 可以在这里添加 chrome.storage 的缓存检查和每日更新逻辑
    // 只有当缓存失效时才调用 fetchNewQuote();
  }, [autoFetch, fetchNewQuote]);

  return { quote, isLoading, error, fetchNewQuote };
}
