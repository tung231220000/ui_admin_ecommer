import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Trademark } from '@/@types/trademark';
import TrademarkNewEditForm from '@/sections/@dashboard/trademark/TrademarkNewEditForm';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiTrademarkRepository from '@/apis/apiService/trademark.api';

// ----------------------------------------------------------------------

export default function TrademarkCreate() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentTrademark, setCurrentTrademark] = useState<Trademark>();

  useQuery({
    queryKey: ['fetchTrademarkDetail', id],
    queryFn: async () => {
      try {
        const data = await ApiTrademarkRepository.fetchTrademarkDetail({ id });
        if (!data.error) {
          setCurrentTrademark(data.data.trademarkDetail);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết thương hiệu!', {
          variant: 'error',
        });
      }
    },
    enabled: id.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Trademark: Create a new trademark' : 'Trademark: Edit a trademark'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new trademark' : 'Edit Trademark'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Trademark', href: PATH_DASHBOARD.trademark.list },
            { name: !isEdit ? 'New Trademark' : capitalCase(id) },
          ]}
        />

        <TrademarkNewEditForm isEdit={isEdit} currentTrademark={currentTrademark} />
      </Container>
    </Page>
  );
}
