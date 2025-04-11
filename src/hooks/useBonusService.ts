import { useMutation, useQuery } from '@tanstack/react-query';

import { BonusService } from 'src/@types/bonus-service';
import BonusServiceContext from 'src/contexts/BonusService';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import ApiBonusServiceRepository, {
  CreateBonusServicePayload,
  DeleteBonusServicePayload, DeleteManyBonusServicesPayload,
  UpdateBonusServicePayload
} from "@/apis/apiService/bonus-service.api";

export type UseBonusServiceProps = {
  isLoading: boolean;
  bonusServices: BonusService[];
  createBonusService: (payload: CreateBonusServicePayload) => Promise<void>;
  refetchBonusServices: VoidFunction;
  updateBonusService: (payload: UpdateBonusServicePayload) => Promise<void>;
  deleteBonusService: (payload: DeleteBonusServicePayload) => void;
  deleteManyBonusServices: (payload: DeleteManyBonusServicesPayload
  ) => Promise<void>;
};

export default function useBonusService(): UseBonusServiceProps {
  const { dispatch, state } = useContext(BonusServiceContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreateBonusService, isPending: isCreatingBonusService } =
    useMutation({
      mutationFn: (payload: CreateBonusServicePayload) =>
        ApiBonusServiceRepository.createBonusService(payload),
      onError: () => {
        enqueueSnackbar('Không thể tạo tài nguyên tự chọn!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          enqueueSnackbar('Tạo tài nguyên tự chọn thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.bonusService.list);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { refetch: refetchBonusServices, isLoading: isRefreshingBonusServices } = useQuery({
    ['fetchBonusServices'],
    () => ApiBonusServiceRepository.fetchBonusServices(),
    {
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy danh sách tài nguyên tự chọn!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          dispatch({
            type: 'SET_BONUS_SERVICES',
            payload: data.data.bonusServices,
          });
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateBonusService, isPending: isUpdatingBonusService } =
    useMutation(
      (payload: UpdateBonusServicePayload) =>
        ApiBonusServiceRepository.updateBonusService(payload),
      {
        onError() {
          enqueueSnackbar('Không thể cập nhật tài nguyên tự chọn!', {
            variant: 'error',
          });
        },
        onSuccess(data) {
          if (!data.errors) {
            enqueueSnackbar('Cập nhật tài nguyên tự chọn thành công!', {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.bonusService.list);
          } else {
            enqueueSnackbar(data.errors[0].message, {
              variant: 'error',
            });
          }
        },
      }
    );
  const { mutateAsync: mutateAsyncDeleteBonusService, isPending: isDeletingBonusService } =
    useMutation(
      (payload: DeleteBonusServicePayload) =>
        ApiBonusServiceRepository.deleteBonusService(payload),
      {
        onError() {
          enqueueSnackbar('Không thể xóa tài nguyên tự chọn!', {
            variant: 'error',
          });
        },
        onSuccess(data) {
          if (!data.errors) {
            dispatch({
              type: 'SET_BONUS_SERVICES',
              payload: state.bonusServices.filter(
                (service) => service._id !== data.data.deleteBonusService._id
              ),
            });
            enqueueSnackbar('Xóa tài nguyên tự chọn thành công!', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar(data.errors[0].message, {
              variant: 'error',
            });
          }
        },
      }
    );
  const {
    mutateAsync: mutateAsyncDeleteManyBonusServices,
    isPending: isDeletingManyBonusServices,
  } = useMutation(
    (payload: DeleteManyBonusServicesPayload) =>
      ApiBonusServiceRepository.deleteManyBonusServices(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa nhiều tài nguyên tự chọn!', {
          variant: 'error',
        });
      },
    }
  );

  const createBonusService = async (payload: CreateBonusServicePayload) => {
    mutateAsyncCreateBonusService(payload);
  };

  const updateBonusService = async (payload: UpdateBonusServicePayload) => {
    mutateAsyncUpdateBonusService(payload);
  };

  const deleteBonusService = (payload: DeleteBonusServicePayload) => {
    mutateAsyncDeleteBonusService(payload);
  };

  const deleteManyBonusServices = async (payload: DeleteManyBonusServicesPayload) => {
    const response = await mutateAsyncDeleteManyBonusServices(payload);

    dispatch({
      type: 'SET_BONUS_SERVICES',
      payload: state.bonusServices.filter(
        (service) => !payload.bonusServiceInput._ids.includes(service._id)
      ),
    });
    enqueueSnackbar(response.data.deleteManyBonusServices, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isCreatingBonusService ||
      isRefreshingBonusServices ||
      isUpdatingBonusService ||
      isDeletingBonusService ||
      isDeletingManyBonusServices,
    bonusServices: state.bonusServices,
    createBonusService,
    refetchBonusServices,
    updateBonusService,
    deleteBonusService,
    deleteManyBonusServices,
  };
}
