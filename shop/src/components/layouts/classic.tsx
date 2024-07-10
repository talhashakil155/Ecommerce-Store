import Banner from '@/components/banners/banner';
import PromotionSliders from '@/components/promotions/promotions';
import Categories from '@/components/categories/categories';
import { Element } from 'react-scroll';
import FilterBar from './filter-bar';
import ProductGridHome from '@/components/products/grids/home';
import type { HomePageProps } from '@/types';
import { SHOPS_PER_PAGE } from '@/framework/client/variables';
import { useShops } from '@/framework/shop';
import { useEffect } from 'react';
import ReadMore from '@/components/ui/truncate';
import { Image } from '@/components/ui/image';
import { productPlaceholder } from '@/lib/placeholders';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

export default function ClassicLayout({ variables }: HomePageProps) {
  const limit = SHOPS_PER_PAGE;
  const { shops, isLoading, isLoadingMore, hasMore, loadMore, error } =
    useShops({
      limit,
      is_active: 1,
    });
  console.log('shops: ', shops);
  console.log('variables: ', variables);
  const shop = shops[4];
  const { t } = useTranslation('common');

  return (
    <>
      <div className="pt-20"></div>
      <Banner layout="classic" variables={variables.types} />
      {/* <PromotionSliders variables={variables.types} /> */}
      <FilterBar variables={variables.categories} />
      <Element
        name="grid"
        className="flex border-t border-solid border-border-200 border-opacity-70"
      >
        <div className="flex flex-col p-6 border-b border-gray-200">
          <div className="flex items-center justify-start mb-4">
            <div className="flex items-center justify-center w-24 h-24 border border-gray-200 rounded-full shrink-0">
              <div className="relative w-[calc(100%-8px)] h-[calc(100%-8px)] overflow-hidden bg-gray-200 rounded-full">
                <Image
                  alt={t('logo')}
                  src={shop?.logo?.original! ?? productPlaceholder}
                  fill
                  sizes="(max-width: 768px) 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="ltr:pl-2.5 rtl:pr-2.5 ">
              <div className="text-sm text-gray-400">
                Since {dayjs(shop?.created_at).format('YYYY')}
              </div>
              <h3 className="mb-2 overflow-hidden text-lg font-semibold truncate text-heading">
                {shop?.name}
              </h3>

              <div className="flex flex-wrap text-sm rounded gap-x-4">
                <div className="flex justify-center gap-1.5 text-gray-500">
                  <div className="font-medium text-heading">
                    {shop?.products_count}
                  </div>
                  {t('text-products')}
                </div>
                <div className="flex justify-center gap-1.5 text-gray-500">
                  <div className="font-medium text-heading">0</div>
                  reviews
                </div>
              </div>
            </div>
          </div>

          {shop?.description && (
            <div className="text-sm leading-relaxed text-body">
              <ReadMore character={70}>{shop?.description}</ReadMore>
            </div>
          )}
          <Categories layout="classic" variables={variables.categories} />
        </div>

        <ProductGridHome
          bannerVariables={variables.types}
          className="px-4 pt-3.5 pb-16 lg:p-6 xl:p-8"
          variables={variables.products}
        />
      </Element>
    </>
  );
}
