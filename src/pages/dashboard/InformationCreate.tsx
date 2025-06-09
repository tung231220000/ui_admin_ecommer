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
// import { useSnackbar } from 'notistack';
import {useEffect, useState} from 'react';
import ApiInformationRepository from '@/apis/apiService/information.api';

// ----------------------------------------------------------------------

export default function InformationCreate() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const numericId = id ? Number(id) : 0;
  // const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const [currentInformation, setCurrentInformation] = useState<Information>();

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['fetchInformationDetail', numericId],
    queryFn: () =>  ApiInformationRepository.fetchInformationDetail(numericId),
    enabled: numericId > 0 ,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }
    if (error) {
      console.log(error)
      // enqueueSnackbar(error?.message || 'Không thể lấy chi tiết thông tin!', {
      //   variant: 'error',
      // });
    }
  }, [error, isLoading, isFetching]);

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }
    if (!data?.error && data) {
      console.log('data:', data)
      setCurrentInformation(data);
    } else {
      console.log('data', data)
      console.log(error)
      // enqueueSnackbar(error?.message, {
      //   variant: 'error',
      // });
    }
  }, [data, isLoading, isFetching, error]);

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
            { name: !isEdit ? 'New Information' : capitalCase(String(id)) },
          ]}
        />

        <InformationNewEditForm isEdit={isEdit} currentInformation={currentInformation} />
      </Container>y
    </Page>
  );
}
