import { Category, GetCategoriesResponse } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export const categoryTree = async (
  getCategories: () => Promise<GetCategoriesResponse>
): Promise<CategoryListElement[]> => {
  const { data } = await getCategories();
  if (!data) return [];

  const getOrderNumber = ({ id, Title }: Category): number => {
    const match = Title.match(/^(\d+)/);
    return match ? parseInt(match[0], 10) : id;
  };

  const getShowOnHome = (
    categories: CategoryListElement[],
    toShowOnHome: number[]
  ): CategoryListElement[] => {
    return categories.map((category, index) => {
      let showOnHome = category.showOnHome;
      if (categories.length <= 5) {
        showOnHome = true;
      } else if (toShowOnHome.length) {
        showOnHome = toShowOnHome.includes(category.id);
      } else {
        showOnHome = index < 3;
      }
      return {
        ...category,
        showOnHome,
      };
    });
  };

  const processCategories = (
    categories: Category[],
    currentLevel: number | undefined = 0
  ): CategoryListElement[] => {
    const toShowOnHome: number[] = [];
    const result = categories
      .map((category) => {
        const { id, MetaTagDescription, name, Title, children } = category;
        const order = getOrderNumber(category);
        if (currentLevel === 0 && Title.includes('#')) toShowOnHome.push(id);
        const processedChildren = processCategories(children, currentLevel + 1);
        return {
          id,
          image: MetaTagDescription,
          name,
          order,
          children: processedChildren,
          showOnHome: false,
        };
      })
      .sort((a, b) => a.order - b.order);
    if (currentLevel === 0) {
      return getShowOnHome(result, toShowOnHome);
    }
    return result;
  };
  return processCategories(data);
};
