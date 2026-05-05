import { NewsItem, Language } from './constants';

export type { NewsItem, Language };

export interface PageItem {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  slug: string;
  updatedAt?: string;
}
