import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Product } from '@/@types/product';
import ProductNewEditForm from '@/sections/@dashboard/product/ProductNewEditForm';
import { capitalCase } from 'change-case';
import useAdvantage from '@/hooks/useAdvantage';
import useBonusService from '@/hooks/useBonusService';
import useCategory from '@/hooks/useCategory';
import useQaA from '@/hooks/useQaA';
import { useQuery } from '@tanstack/react-query';
import useServicePack from '@/hooks/useServicePack';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiProductRepository from '@/apis/apiService/product.api';

// ----------------------------------------------------------------------

export default function ProductCreate() {
  const { pathname } = useLocation();
  const { key = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { categories } = useCategory();
  const { advantages } = useAdvantage();
  const { QaAs } = useQaA();
  const { servicePacks } = useServicePack();
  const { bonusServices } = useBonusService();

  const [currentProduct, setCurrentProduct] = useState<Product>();

  useQuery({
    queryKey: ['fetchProductDetail', key],
    queryFn: async () => {
      try {
        const data = await ApiProductRepository.fetchProductDetail({
          getProductDetailInput: {
            key,
          },
        });
        if (!data.error) {
          setCurrentProduct(data.data.productDetail.detail);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết sản phẩm!', {
          variant: 'error',
        });
      }
    },

    enabled: key.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Product: Create a new product' : 'Product: Edit a product'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit Product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Product', href: PATH_DASHBOARD.product.list },
            { name: !isEdit ? 'New Product' : capitalCase(key) },
          ]}
        />

        {categories.length &&
          advantages.length &&
          QaAs.length &&
          servicePacks.length &&
          bonusServices.length && (
            <ProductNewEditForm
              categories={categories}
              advantages={advantages}
              QaAs={QaAs}
              servicePacks={servicePacks}
              bonusServices={bonusServices}
              isEdit={isEdit}
              currentProduct={currentProduct}
            />
          )}
      </Container>
    </Page>
  );
}
