import $axios from 'src/api/axios';
import { getArticlesUrl } from 'src/config/api.config';
import { ArticleType } from 'src/interfaces/article.interface';
import { API_URL } from 'src/config/api.config';

export const AdminArticleService = {
  async getAll(collectionId?: string) {
    const url = collectionId
      ? `${API_URL}${getArticlesUrl('admin/all')}?collectionId=${collectionId}`
      : `${API_URL}${getArticlesUrl('admin/all')}`;
    const { data } = await $axios.get<ArticleType[]>(url);
    return data;
  },

  async create(body: {
    collectionId: string;
    title: string;
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
    authors?: string;
    abstract?: string;
    abstract_uz?: string;
    abstract_ru?: string;
    abstract_en?: string;
    keywords?: string[];
    keywords_uz?: string;
    keywords_ru?: string;
    keywords_en?: string;
    pdfUrl: string;
    doi?: string;
    isPublished?: boolean;
  }) {
    const { data } = await $axios.post<ArticleType>(`${API_URL}/articles`, body);
    return data;
  },

  async update(id: string, body: Partial<ArticleType>) {
    const { data } = await $axios.patch<ArticleType>(`${API_URL}/articles/${id}`, body);
    return data;
  },

  async delete(id: string) {
    await $axios.delete(`${API_URL}/articles/${id}`);
  },
};
