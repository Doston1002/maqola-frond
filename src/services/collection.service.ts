import axios from 'axios';
import { API_URL, getBaseUrl, getCollectionsUrl } from 'src/config/api.config';
import { CollectionType } from 'src/interfaces/collection.interface';

// SSR va browser uchun bazaviy API manzilini aniqlash
const getApiBase = () =>
  typeof window === 'undefined' ? `${getBaseUrl()}/api` : API_URL;

export const CollectionService = {
  async getAll(): Promise<CollectionType[]> {
    const { data } = await axios.get<CollectionType[]>(`${getApiBase()}${getCollectionsUrl('')}`);
    return data;
  },

  async getBySlug(slug: string): Promise<CollectionType> {
    const { data } = await axios.get<CollectionType>(`${getApiBase()}${getCollectionsUrl('slug/' + slug)}`);
    return data;
  },

  async getStats(): Promise<{ collectionsCount: number; articlesCount: number }> {
    const { data } = await axios.get(`${getApiBase()}${getCollectionsUrl('stats/counts')}`);
    return data;
  },
};
