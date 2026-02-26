import $axios from 'src/api/axios';
import { getCollectionsUrl } from 'src/config/api.config';
import { CollectionType } from 'src/interfaces/collection.interface';

export const AdminCollectionService = {
  async getAll() {
    const { data } = await $axios.get<CollectionType[]>(getCollectionsUrl('admin/all'));
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await $axios.get<CollectionType>(getCollectionsUrl('admin/slug/' + slug));
    return data;
  },

  async create(body: {
    title: string;
    title_uz?: string;
    title_ru?: string;
    title_en?: string;
    description?: string;
    description_uz?: string;
    description_ru?: string;
    description_en?: string;
    year: number;
    coverImage?: string;
    isPublished?: boolean;
  }) {
    const { data } = await $axios.post<CollectionType>(getCollectionsUrl(''), body);
    return data;
  },

  async update(id: string, body: Partial<CollectionType>) {
    const { data } = await $axios.patch<CollectionType>(getCollectionsUrl(id), body);
    return data;
  },

  async delete(id: string) {
    await $axios.delete(getCollectionsUrl(id));
  },
};
