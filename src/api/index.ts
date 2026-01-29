import { env } from '@/config/env';
import { request } from '@/utils/http';

/** 统一管理请求接口 base */
const API_BASE = env.AI_API_LOCAL;

/** 文章相关 */
export const ARTICLE = {
  /** 默认文章列表接口，供 useArticle 等使用 */
  queryArticle: `${API_BASE}/api/article/queryArticle`
} as const;

/**
 * 文章列表 fetcher，供 useSWR 使用
 * GET 请求，返回 res.data
 */
export const articleFetcher = (url: string) => request<{ data: unknown[] }>(url);
