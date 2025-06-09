import { useLocation, useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '@/routes/paths';
import Page from '../../components/Page';
import { Service } from '@/@types/service';
import { Solution } from '@/@types/solution';
import SolutionNewEditForm from '@/sections/@dashboard/solution/SolutionNewEditForm';
import { capitalCase } from 'change-case';
import useAdvantage from '@/hooks/useAdvantage';
import { useQuery } from '@tanstack/react-query';
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useSolutionCategory from '@/hooks/useSolutionCategory';
import { useState } from 'react';
import ServiceApiRepository from '@/apis/apiService/service.api';
import ApiSolutionRepository from '@/apis/apiService/solution.api';

// ----------------------------------------------------------------------

export default function SolutionCreate() {
  const { pathname } = useLocation();
  const { key = '' } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const { solutionCategories } = useSolutionCategory();
  const { advantages } = useAdvantage();

  const [services, setServices] = useState<Service[]>([]);
  const [currentSolution, setCurrentSolution] = useState<Solution>();

  useQuery({
    queryKey: ['fetchServices'],
    queryFn: async () => {
      try {
        const data = await ServiceApiRepository.fetchServices();
        {
          if (!data.error) {
            setServices(data.data.services);
          } else {
            enqueueSnackbar(data.message, {
              variant: 'error',
            });
          }
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách linh kiện!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: ['fetchSolutionDetail', key],
    queryFn: async () => {
      try {
        const data = await ApiSolutionRepository.fetchSolutionDetail({
          solutionInput: {
            key,
          },
        });
        if (!data.error) {
          setCurrentSolution(data.data.solutionDetail);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy chi tiết giải pháp!', {
          variant: 'error',
        });
      }
    },
    enabled: key.length > 0,
    refetchOnWindowFocus: false,
  });

  const isEdit = pathname.includes('edit');

  return (
    <Page title={!isEdit ? 'Solution: Create a new solution' : 'Solution: Edit a solution'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new solution' : 'Edit Solution'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Solution', href: PATH_DASHBOARD.solution.list },
            { name: !isEdit ? 'New Solution' : capitalCase(key) },
          ]}
        />

        {solutionCategories.length && advantages.length && services.length > 0 && (
          <SolutionNewEditForm
            categories={solutionCategories}
            advantages={advantages}
            services={services}
            isEdit={isEdit}
            currentSolution={currentSolution}
          />
        )}
      </Container>
    </Page>
  );
}
