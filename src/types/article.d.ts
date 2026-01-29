/** 单条面试题（与接口 data 项一致） */
export interface Article {
  id: string;
  order: number;
  title: string;
  rawTitle: string;
  contentHtml: string;
}

/** 文章列表接口返回 */
export interface ArticleApiResponse {
  data: Article[];
  msg?: string;
  error?: string;
}

/** 本地缓存元数据：当前缓存覆盖的日期范围 */
export interface ArticleStorageMeta {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
