import $axios from 'src/api/axios';
import { getArticlesUrl } from 'src/config/api.config';
import { ArticleType } from 'src/interfaces/article.interface';

export const AdminArticleService = {
  async getAll(collectionId?: string) {
    const q = collectionId ? `?collectionId=${collectionId}` : '';
    const { data } = await $axios.get<ArticleType[]>(getArticlesUrl('admin/all') + q);
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
    const { data } = await $axios.post<ArticleType>(getArticlesUrl(''), body);
    return data;
  },

  async update(id: string, body: Partial<ArticleType>) {
    const { data } = await $axios.patch<ArticleType>(getArticlesUrl(id), body);
    return data;
  },

  async delete(id: string) {
    await $axios.delete(getArticlesUrl(id));
  },
};
