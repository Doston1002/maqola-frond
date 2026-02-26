export interface CollectionType {
  _id: string;
  title: string;
  description: string;
  year: number;
  coverImage?: string;
  slug: string;
  isPublished: boolean;
  createdAt?: string;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
}
