import type { Article, ArticleStorageMeta } from '@/types/article';

const KEY_PREFIX = 'dawn-article-';
const META_KEY = 'dawn-article-meta';

function getKey(date: string): string {
  return `${KEY_PREFIX}${date}`;
}

/** 按日期读取当日面试题 */
export function getArticleByDate(date: string): Article | null {
  try {
    const raw = localStorage.getItem(getKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}

/** 按日期写入单日面试题 */
export function setArticleForDate(date: string, article: Article): void {
  localStorage.setItem(getKey(date), JSON.stringify(article));
}

/** 读取缓存元数据 */
export function getArticleMeta(): ArticleStorageMeta | null {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ArticleStorageMeta;
  } catch {
    return null;
  }
}

/** 写入缓存元数据 */
function setArticleMeta(meta: ArticleStorageMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

/**
 * 将 YYYY-MM-DD 字符串加 n 天，返回 YYYY-MM-DD（按本地日期计算，避免时区导致重复键）
 */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 批量写入：从 startDate 起，按顺序把 articles 依次写入连续日期，并更新 meta。
 * 写入前会先清空旧的面试题缓存，避免过期文章一直占用本地存储。
 */
export function setArticleBatch(startDate: string, articles: Article[]): void {
  if (!articles.length) return;
  clearArticleStorage();
  let cur = startDate;
  for (const article of articles) {
    setArticleForDate(cur, article);
    cur = addDays(cur, 1);
  }
  const endDate = addDays(startDate, articles.length - 1);
  setArticleMeta({ startDate, endDate });
}

/** 获取今日日期 YYYY-MM-DD（本地日期，与 addDays 一致） */
export function getTodayDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 清空所有面试题相关缓存（调试/重置用） */
export function clearArticleStorage(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEY_PREFIX)) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
}
