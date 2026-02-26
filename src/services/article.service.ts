import axios from 'axios';
import { API_URL, getArticlesUrl } from 'src/config/api.config';
import { ArticleType } from 'src/interfaces/article.interface';

export const ArticleService = {
  async getAll(collectionId?: string): Promise<ArticleType[]> {
    const url = collectionId
      ? `${API_URL}${getArticlesUrl('')}?collectionId=${collectionId}`
      : `${API_URL}${getArticlesUrl('')}`;
    const { data } = await axios.get<ArticleType[]>(url);
    return data;
  },

  async getBySlug(slug: string): Promise<ArticleType> {
    const { data } = await axios.get<ArticleType>(`${API_URL}${getArticlesUrl('slug/' + slug)}`);
    return data;
  },

  async search(params: { q?: string; year?: string; collectionId?: string }): Promise<ArticleType[]> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.year) searchParams.set('year', params.year);
    if (params.collectionId) searchParams.set('collectionId', params.collectionId);
    const { data } = await axios.get<ArticleType[]>(
      `${API_URL}${getArticlesUrl('search')}?${searchParams.toString()}`
    );
    return data;
  },

  async recordDownload(slug: string): Promise<void> {
    await axios.get(`${API_URL}${getArticlesUrl('slug/' + slug + '/download')}`);
  },
};
