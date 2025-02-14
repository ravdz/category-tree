import { INPUT } from './input';

export interface Category {
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  Title: string;
  MetaTagDescription: string;
  children: Category[];
}

export interface GetCategoriesResponse {
  data: Category[];
}

export const getCategories = async (): Promise<GetCategoriesResponse> => ({
  data: INPUT,
});
