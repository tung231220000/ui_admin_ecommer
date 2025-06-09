import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Office } from '@/@types/office';
import OfficeNewEditForm from '@/sections/@dashboard/office/OfficeNewEditForm';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiOfficeRepository from '@/apis/apiService/office.api';

// ----------------------------------------------------------------------

export default function OfficeCreate() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentOffice, setCurrentOffice] = useState<Office>();

  useQuery({
    queryKey: ['fetchOfficeDetail', id],
    queryFn: async () => {
      try {
        const data = await ApiOfficeRepository.fetchOfficeDetail({ id });
        if (!data.error) {
          setCurrentOffice(data.data.officeDetail);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết văn phòng!', {
          variant: 'error',
        });
      }
    },
    enabled: id.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Office: Create a new office' : 'Office: Edit a office'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new office' : 'Edit Office'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Office', href: PATH_DASHBOARD.office.list },
            { name: !isEdit ? 'New Office' : capitalCase(id) },
          ]}
        />

        <OfficeNewEditForm isEdit={isEdit} currentOffice={currentOffice} />
      </Container>
    </Page>
  );
}
