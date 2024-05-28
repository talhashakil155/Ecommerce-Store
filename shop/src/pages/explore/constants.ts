export const variables = {
  popularProducts: {
    type_slug: 'grocery',
    limit: 10,
    with: 'type;author',
    language: 'en',
  },
  products: {
    type: 'grocery',
    limit: 30,
  },
  categories: {
    type: 'grocery',
    limit: 1000,
    language: 'en',
    parent: 'null',
  },
  bestSellingProducts: {
    type_slug: 'grocery',
    limit: 10,
    with: 'type;author',
    language: 'en',
  },
  layoutSettings: {
    isHome: false,
    productCard: 'helium',
    layoutType: 'classic',
  },
  types: {
    type: 'grocery',
  },
};
