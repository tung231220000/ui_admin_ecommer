import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Service } from '@/@types/service';
import ServiceNewEditForm from '@/sections/@dashboard/service/ServiceNewEditForm';
import { Trademark } from '@/@types/trademark';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiServiceRepository from '@/apis/apiService/service.api';
import ApiTrademarkRepository from '@/apis/apiService/trademark.api';

// ----------------------------------------------------------------------

export default function ServiceCreate() {
  const { pathname } = useLocation();
  const { _id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [trademarks, setTrademarks] = useState<Trademark[]>([]);
  const [currentService, setCurrentService] = useState<Service>();

  useQuery({
    queryKey: ['fetchTrademarks'],
    queryFn: async () => {
      try {
        const data = await ApiTrademarkRepository.fetchTrademarks();
        if (!data.error) {
          setTrademarks(data.trademarks);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách thương hiệu!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ['fetchServiceDetail', _id],
    queryFn: async () => {
      try {
        const data = await ApiServiceRepository.fetchServiceDetail({ _id });
        if (!data.error) {
          setCurrentService(data.data.serviceDetail);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết linh kiện!', {
          variant: 'error',
        });
      }
    },
    enabled: _id.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Service: Create a new service' : 'Service: Edit a service'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new service' : 'Edit Service'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service', href: PATH_DASHBOARD.service.list },
            { name: !isEdit ? 'New Service' : capitalCase(_id) },
          ]}
        />

        {trademarks.length > 0 && (
          <ServiceNewEditForm
            trademarks={trademarks}
            isEdit={isEdit}
            currentService={currentService}
          />
        )}
      </Container>
    </Page>
  );
}
