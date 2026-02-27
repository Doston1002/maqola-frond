import axios from 'axios';
import { API_URL, getBaseUrl, getArticlesUrl } from 'src/config/api.config';
import { ArticleType } from 'src/interfaces/article.interface';

// SSR va browser uchun bazaviy API manzilini aniqlash
const getApiBase = () =>
  typeof window === 'undefined' ? `${getBaseUrl()}/api` : API_URL;

export const ArticleService = {
  async getAll(collectionId?: string): Promise<ArticleType[]> {
    const base = getApiBase();
    const url = collectionId
      ? `${base}${getArticlesUrl('')}?collectionId=${collectionId}`
      : `${base}${getArticlesUrl('')}`;
    const { data } = await axios.get<ArticleType[]>(url);
    return data;
  },

  async getBySlug(slug: string): Promise<ArticleType> {
    const { data } = await axios.get<ArticleType>(`${getApiBase()}${getArticlesUrl('slug/' + slug)}`);
    return data;
  },

  async search(params: { q?: string; year?: string; collectionId?: string }): Promise<ArticleType[]> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.year) searchParams.set('year', params.year);
    if (params.collectionId) searchParams.set('collectionId', params.collectionId);
    const { data } = await axios.get<ArticleType[]>(
      `${getApiBase()}${getArticlesUrl('search')}?${searchParams.toString()}`
    );
    return data;
  },

  async recordDownload(slug: string): Promise<void> {
    await axios.get(`${getApiBase()}${getArticlesUrl('slug/' + slug + '/download')}`);
  },
};
