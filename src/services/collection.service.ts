import axios from 'axios';
import { API_URL, getCollectionsUrl } from 'src/config/api.config';
import { CollectionType } from 'src/interfaces/collection.interface';

export const CollectionService = {
  async getAll(): Promise<CollectionType[]> {
    const { data } = await axios.get<CollectionType[]>(`${API_URL}${getCollectionsUrl('')}`);
    return data;
  },

  async getBySlug(slug: string): Promise<CollectionType> {
    const { data } = await axios.get<CollectionType>(`${API_URL}${getCollectionsUrl('slug/' + slug)}`);
    return data;
  },

  async getStats(): Promise<{ collectionsCount: number; articlesCount: number }> {
    const { data } = await axios.get(`${API_URL}${getCollectionsUrl('stats/counts')}`);
    return data;
  },
};
