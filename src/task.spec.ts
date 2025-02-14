import test from 'ava';

import { CORRECT } from './correctResult';
import { INCORRECT } from './currentResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

test('return of categoryTree function matches correct result', async (t) => {
  const result = await categoryTree(getCategories);
  t.deepEqual(result, CORRECT);
});

test('return of categoryTree function no more matches old result', async (t) => {
  const result = await categoryTree(getCategories);
  t.notDeepEqual(result, INCORRECT);
});

test('return empty array when no categories', async (t) => {
  const result = await categoryTree(async () => ({ data: [] }));
  t.deepEqual(result, []);
});

test('correctly processes category without children', async (t) => {
  const result = await categoryTree(async () => ({
    data: [
      {
        id: 1,
        name: 'Single Category',
        hasChildren: false,
        url: 'https://example.com/single-category',
        children: [],
        Title: 'Single Category',
        MetaTagDescription: 'Single Category',
      },
    ],
  }));
  t.deepEqual(result, [
    {
      id: 1,
      name: 'Single Category',
      image: 'Single Category',
      order: 1,
      children: [],
      showOnHome: true,
    },
  ]);
});

test('correctly processes category with children', async (t) => {
  const result = await categoryTree(async () => ({
    data: [
      {
        id: 1,
        name: 'Category',
        hasChildren: true,
        url: 'https://example.com/category',
        children: [
          {
            id: 4,
            name: 'Category',
            hasChildren: false,
            url: 'https://example.com/category',
            children: [],
            Title: '1 Category',
            MetaTagDescription: 'Category',
          },
          {
            id: 3,
            name: 'Category',
            hasChildren: false,
            url: 'https://example.com/category',
            children: [],
            Title: 'Category',
            MetaTagDescription: 'Category',
          },
        ],
        Title: '3# Category',
        MetaTagDescription: 'Category',
      },
      {
        id: 2,
        name: 'Category',
        hasChildren: false,
        url: 'https://example.com/category',
        children: [],
        Title: '2 Category',
        MetaTagDescription: 'Category',
      },
    ],
  }));
  t.deepEqual(result, [
    {
      id: 2,
      name: 'Category',
      image: 'Category',
      order: 2,
      children: [],
      showOnHome: true,
    },
    {
      id: 1,
      name: 'Category',
      image: 'Category',
      order: 3,
      children: [
        {
          id: 4,
          name: 'Category',
          image: 'Category',
          order: 1,
          children: [],
          showOnHome: false,
        },
        {
          id: 3,
          name: 'Category',
          image: 'Category',
          order: 3,
          children: [],
          showOnHome: false,
        },
      ],
      showOnHome: true,
    },
  ]);
});

test('correctly processes category with more than 2 levels of children', async (t) => {
  const result = await categoryTree(async () => ({
    data: [
      {
        id: 1,
        name: 'Category',
        hasChildren: true,
        url: 'https://example.com/category',
        children: [
          {
            id: 2,
            name: 'Category',
            hasChildren: false,
            url: 'https://example.com/category',
            children: [
              {
                id: 3,
                name: 'Category',
                hasChildren: false,
                url: 'https://example.com/category',
                children: [
                  {
                    id: 4,
                    name: 'Category',
                    hasChildren: false,
                    url: 'https://example.com/category',
                    children: [],
                    Title: 'Category',
                    MetaTagDescription: 'Category',
                  },
                  {
                    id: 5,
                    name: 'Category',
                    hasChildren: false,
                    url: 'https://example.com/category',
                    children: [],
                    Title: '2 Category',
                    MetaTagDescription: 'Category',
                  },
                ],
                Title: 'Category',
                MetaTagDescription: 'Category',
              },
            ],
            Title: 'Category',
            MetaTagDescription: 'Category',
          },
        ],
        Title: 'Category',
        MetaTagDescription: 'Category',
      },
    ],
  }));

  t.deepEqual(result, [
    {
      id: 1,
      name: 'Category',
      image: 'Category',
      order: 1,
      children: [
        {
          id: 2,
          name: 'Category',
          image: 'Category',
          order: 2,
          children: [
            {
              id: 3,
              name: 'Category',
              image: 'Category',
              order: 3,
              children: [
                {
                  id: 5,
                  name: 'Category',
                  image: 'Category',
                  order: 2,
                  children: [],
                  showOnHome: false,
                },
                {
                  id: 4,
                  name: 'Category',
                  image: 'Category',
                  order: 4,
                  children: [],
                  showOnHome: false,
                },
              ],
              showOnHome: false,
            },
          ],
          showOnHome: false,
        },
      ],
      showOnHome: true,
    },
  ]);
});

test('category without number in title will be ordered by id', async (t) => {
  const result = await categoryTree(async () => ({
    data: [
      {
        id: 999,
        name: 'No number title category',
        hasChildren: false,
        url: 'https://example.com/no-number-title',
        children: [],
        Title: '#1 No number title category', // in this case number shouldn't be catched as an order number
        MetaTagDescription: 'No number title category',
      },
      {
        id: 998,
        name: 'No number title category',
        hasChildren: false,
        url: 'https://example.com/no-number-title',
        children: [],
        Title: 'No number title category',
        MetaTagDescription: 'No number title category',
      },
    ],
  }));
  t.deepEqual(result, [
    {
      id: 998,
      name: 'No number title category',
      image: 'No number title category',
      order: 998,
      children: [],
      showOnHome: true,
    },
    {
      id: 999,
      name: 'No number title category',
      image: 'No number title category',
      order: 999,
      children: [],
      showOnHome: true,
    },
  ]);
});

test('category with number in title will be ordered by this number ', async (t) => {
  const result = await categoryTree(async () => ({
    data: [
      {
        id: 1,
        name: 'Category 2',
        hasChildren: false,
        url: 'https://example.com/category-2',
        children: [],
        Title: '2 Category 2',
        MetaTagDescription: 'Category 2',
      },
      {
        id: 2,
        name: 'Category 3',
        hasChildren: false,
        url: 'https://example.com/category-3',
        children: [],
        Title: '3# Category 3',
        MetaTagDescription: 'Category 3',
      },
      {
        id: 3,
        name: 'Category 1',
        hasChildren: false,
        url: 'https://example.com/category-1',
        children: [],
        Title: '1# Category 1',
        MetaTagDescription: 'Category 1',
      },
    ],
  }));
  t.deepEqual(result, [
    {
      id: 3,
      name: 'Category 1',
      image: 'Category 1',
      order: 1,
      children: [],
      showOnHome: true,
    },
    {
      id: 1,
      name: 'Category 2',
      image: 'Category 2',
      order: 2,
      children: [],
      showOnHome: true,
    },
    {
      id: 2,
      name: 'Category 3',
      image: 'Category 3',
      order: 3,
      children: [],
      showOnHome: true,
    },
  ]);
});

test('all categories got showOnHome = true, when there are 5 or less categories', async (t) => {
  const getData = (length: number) => {
    const getRandomTitle = (i: number) => {
      const titles = [
        `Category ${i + 1}`,
        `${i + 1} Category ${i + 1}`,
        `${i + 1}# Category ${i + 1}`,
      ];
      return titles[Math.floor(Math.random() * titles.length)];
    };
    const input = Array.from({ length }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      hasChildren: false,
      url: `https://example.com/category-${i + 1}`,
      Title: getRandomTitle(i),
      MetaTagDescription: `Category ${i + 1}`,
      children: [],
    }));
    const output = Array.from({ length }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      image: `Category ${i + 1}`,
      order: i + 1,
      children: [],
      showOnHome: true,
    }));
    return { input, output };
  };
  // equally 5 categories case
  const dataTest1 = getData(5);
  const result1 = await categoryTree(async () => ({
    data: dataTest1.input,
  }));
  t.deepEqual(result1, dataTest1.output);
  // less than 5 categories case
  const dataTest2 = getData(4);
  const result2 = await categoryTree(async () => ({
    data: dataTest2.input,
  }));
  t.deepEqual(result2, dataTest2.output);
});

test('when there are more than 5 categories, and there include categories with n# at the beginning of the title, then only that categories got showOnHome = true', async (t) => {
  const getData = () => {
    const input = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      hasChildren: false,
      url: `https://example.com/category-${i + 1}`,
      Title: `${i > 3 ? `${i + 1}#` : ''}Category ${i + 1}`,
      MetaTagDescription: `Category ${i + 1}`,
      children: [],
    }));
    const output = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      image: `Category ${i + 1}`,
      order: i + 1,
      children: [],
      showOnHome: i > 3,
    }));
    return { input, output };
  };
  const { input, output } = getData();
  const result = await categoryTree(async () => ({
    data: input,
  }));
  t.deepEqual(result, output);
});

test('when there are more than 5 categories, and no categories with n# at the beginning of the title, then only first 3 categories got showOnHome = true', async (t) => {
  const getData = () => {
    const input = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      hasChildren: false,
      url: `https://example.com/category-${i + 1}`,
      Title: `Category ${i + 1}`,
      MetaTagDescription: `Category ${i + 1}`,
      children: [],
    }));
    const output = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      image: `Category ${i + 1}`,
      order: i + 1,
      children: [],
      showOnHome: i < 3,
    }));
    return { input, output };
  };
  const { input, output } = getData();
  const result = await categoryTree(async () => ({
    data: input,
  }));
  t.deepEqual(result, output);
});
