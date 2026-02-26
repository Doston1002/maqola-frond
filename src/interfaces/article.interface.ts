import { CollectionType } from './collection.interface';

export interface ArticleType {
  _id: string;
  collectionId: string | CollectionType;
  title: string;
  authors: string;
  abstract: string;
  keywords: string[];
  pdfUrl: string;
  doi?: string;
  slug: string;
  isPublished: boolean;
  viewCount?: number;
  downloadCount?: number;
  createdAt?: string;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  abstract_uz?: string;
  abstract_ru?: string;
  abstract_en?: string;
  keywords_uz?: string;
  keywords_ru?: string;
  keywords_en?: string;
}
