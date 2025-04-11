import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Information } from '@/@types/information';
import InformationNewEditForm from '@/sections/@dashboard/information/InformationNewEditForm';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { capitalCase } from 'change-case';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ApiInformationRepository from '@/apis/apiService/information.api';

// ----------------------------------------------------------------------

export default function InformationCreate() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentInformation, setCurrentInformation] = useState<Information>();

  useQuery({
    queryKey: ['fetchInformationDetail', id],
    queryFn: async () => {
      try {
        const data = await ApiInformationRepository.fetchInformationDetail({ id });
        if (!data.error) {
          setCurrentInformation(data.result);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết thông tin!', {
          variant: 'error',
        });
      }
    },
    enabled: id.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page
      title={!isEdit ? 'Information: Create a new information' : 'Information: Edit a information'}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new information' : 'Edit Information'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Information', href: PATH_DASHBOARD.information.list },
            { name: !isEdit ? 'New Information' : capitalCase(id) },
          ]}
        />

        <InformationNewEditForm isEdit={isEdit} currentInformation={currentInformation} />
      </Container>
    </Page>
  );
}
