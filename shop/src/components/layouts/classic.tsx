import Banner from '@/components/banners/banner';
import PromotionSliders from '@/components/promotions/promotions';
import Categories from '@/components/categories/categories';
import { Element } from 'react-scroll';
import FilterBar from './filter-bar';
import ProductGridHome from '@/components/products/grids/home';
import type { HomePageProps } from '@/types';

export default function ClassicLayout({ variables }: HomePageProps) {
  return (
    <>
      <div className="pt-20"></div>
      {/* <Banner layout="classic" variables={variables.types} /> */}
      {/* <PromotionSliders variables={variables.types} /> */}
      <FilterBar variables={variables.categories} />
      <Element
        name="grid"
        className="flex border-t border-solid border-border-200 border-opacity-70"
      >
        <Categories layout="classic" variables={variables.categories} />
        <ProductGridHome
          bannerVariables={variables.types}
          className="px-4 pt-3.5 pb-16 lg:p-6 xl:p-8"
          variables={variables.products}
        />
      </Element>
    </>
  );
}
