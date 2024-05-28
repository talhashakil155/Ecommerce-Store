import type { NextPageWithLayout } from '@/types';
import NotFound from '@/components/ui/not-found';
import { useShops } from '@/framework/shop';
import ErrorMessage from '@/components/ui/error-message';
export { getStaticProps } from '@/framework/shops-page.ssr';
import { SHOPS_PER_PAGE } from '@/framework/client/variables';
import { getLayoutWithFooter } from '@/components/layouts/layout-with-footer';
import dynamic from 'next/dynamic';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import { useType } from '@/framework/type';
import { variables } from './constants';

const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false },
);

const Classic = dynamic(() => import('@/components/layouts/classic'));
const Standard = dynamic(() => import('@/components/layouts/standard'));
const Modern = dynamic(() => import('@/components/layouts/modern'));
const Minimal = dynamic(() => import('@/components/layouts/minimal'));
const Compact = dynamic(() => import('@/components/layouts/compact'));

const MAP_LAYOUT_TO_GROUP: Record<string, any> = {
  classic: Classic,
  modern: Modern,
  standard: Standard,
  minimal: Minimal,
  compact: Compact,
  default: Classic,
};

const ShopsPage: NextPageWithLayout = () => {
  const layout = 'classic';
  const { type } = useType(variables.types.type);
  const limit = SHOPS_PER_PAGE;
  const { shops, isLoading, isLoadingMore, hasMore, loadMore, error } =
    useShops({
      limit,
      is_active: 1,
    });

  const { width } = useWindowSize();

  if (error) return <ErrorMessage message={error.message} />;
  if (!isLoading && !shops.length) {
    return (
      <div className="min-h-full bg-gray-100 px-4 pt-6 pb-8 lg:p-8">
        <NotFound text="text-no-shops" />
      </div>
    );
  }
  const Component = MAP_LAYOUT_TO_GROUP[layout];

  return (
    <>
      <Seo
        title={type?.name as string}
        url={type?.slug as string}
        images={type?.banners}
      />
      <Component variables={variables} />
      {!['compact', 'minimal'].includes(layout) && width > 1023 && (
        <CartCounterButton />
      )}
    </>
  );
};
ShopsPage.getLayout = getLayoutWithFooter;

export default ShopsPage;
