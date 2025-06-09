import { useMutation, useQuery } from '@tanstack/react-query';
import { PATH_DASHBOARD } from '@/routes/paths';
import { ServicePack } from '@/@types/service-pack';
import ServicePackContext from '@/contexts/ServicePack';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ApiServicePackRepository, {
  CreateServicePackPayload,
  DeleteManyServicePacksPayload,
  DeleteServicePackPayload,
  UpdateServicePackPayload,
} from '@/apis/apiService/service-pack.api';

export type UseServicePackProps = {
  isLoading: boolean;
  servicePacks: ServicePack[];
  createServicePack: (payload: CreateServicePackPayload) => Promise<void>;
  refetchServicePacks: VoidFunction;
  updateServicePack: (payload: UpdateServicePackPayload) => Promise<void>;
  deleteServicePack: (payload: DeleteServicePackPayload) => void;
  deleteManyServicePacks: (payload: DeleteManyServicePacksPayload) => Promise<void>;
};

export default function useServicePack(): UseServicePackProps {
  const { dispatch, state } = useContext(ServicePackContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreateServicePack, isPending: isCreatingServicePack } =
    useMutation({
      mutationFn: (payload: CreateServicePackPayload) =>
        ApiServicePackRepository.createServicePack(payload),

      onError: () => {
        enqueueSnackbar('Không thể tạo gói dịch vụ!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          enqueueSnackbar('Tạo gói dịch vụ thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.servicePack.list);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { refetch: refetchServicePacks, isLoading: isRefreshingServicePacks } = useQuery({
    queryKey: ['fetchServicePacks'],
    queryFn: async () => {
      try {
        const data = await ApiServicePackRepository.fetchServicePacks();
        if (!data.error) {
          dispatch({
            type: 'SET_SERVICE_PACKS',
            payload: data.data.servicePacks,
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách gói dịch vụ!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateAsyncUpdateServicePack, isPending: isUpdatingServicePack } =
    useMutation({
      mutationFn: (payload: UpdateServicePackPayload) =>
        ApiServicePackRepository.updateServicePack(payload),
      onError: () => {
        enqueueSnackbar('Không thể cập nhật gói dịch vụ!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          enqueueSnackbar('Cập nhật gói dịch vụ thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.servicePack.list);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { mutateAsync: mutateAsyncDeleteServicePack, isPending: isDeletingServicePack } =
    useMutation({
      mutationFn: (payload: DeleteServicePackPayload) =>
        ApiServicePackRepository.deleteServicePack(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa gói dịch vụ!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          dispatch({
            type: 'SET_SERVICE_PACKS',
            payload: state.servicePacks.filter(
              (servicePack) => servicePack._id !== data.data.deleteServicePack._id,
            ),
          });
          enqueueSnackbar('Xóa gói dịch vụ thành công!', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { mutateAsync: mutateAsyncDeleteManyServicePacks, isPending: isDeletingManyServicePacks } =
    useMutation({
      mutationFn: (payload: DeleteManyServicePacksPayload) =>
        ApiServicePackRepository.deleteManyServicePacks(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa nhiều gói dịch vụ!', {
          variant: 'error',
        });
      },
    });

  const createServicePack = async (payload: CreateServicePackPayload) => {
    mutateAsyncCreateServicePack(payload);
  };

  const updateServicePack = async (payload: UpdateServicePackPayload) => {
    mutateAsyncUpdateServicePack(payload);
  };

  const deleteServicePack = (payload: DeleteServicePackPayload) => {
    mutateAsyncDeleteServicePack(payload);
  };

  const deleteManyServicePacks = async (payload: DeleteManyServicePacksPayload) => {
    const response = await mutateAsyncDeleteManyServicePacks(payload);

    dispatch({
      type: 'SET_SERVICE_PACKS',
      payload: state.servicePacks.filter(
        (servicePack) =>servicePack._id && !payload.servicePackInput._ids.includes(servicePack._id),
      ),
    });
    enqueueSnackbar(response.data.deleteManyServicePacks, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isCreatingServicePack ||
      isRefreshingServicePacks ||
      isUpdatingServicePack ||
      isDeletingServicePack ||
      isDeletingManyServicePacks,
    servicePacks: state.servicePacks,
    createServicePack,
    refetchServicePacks,
    updateServicePack,
    deleteServicePack,
    deleteManyServicePacks,
  };
}
