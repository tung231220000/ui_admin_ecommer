import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import ApiPageRepository from '@/apis/apiService/page.api';
import Page from '../../components/Page';
import PageEditForm from '@/sections/@dashboard/page/PageEditForm';
import { Page as TPage } from '@/@types/page';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function PageEdit() {
  const { name = '' } = useParams();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const [currentPage, setCurrentPage] = useState<TPage>();

  useQuery({
    queryKey: ['fetchPageData', name],
    queryFn: async () => {
      try {
        const data = await ApiPageRepository.fetchPageData(name);
        if (!data.error && data.result) {
          setCurrentPage(data.result);
        } else {
          enqueueSnackbar(data.error, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy chi tiết trang!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
    enabled: name.length > 0,
  });

  return (
    <Page title="Page: Edit a page">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit Advantage"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Advantage', href: PATH_DASHBOARD.page.list },
            { name: capitalCase(name) },
          ]}
        />

        {!!currentPage && <PageEditForm currentPage={currentPage} />}
      </Container>
    </Page>
  );
}
