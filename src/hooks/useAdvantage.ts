import { useMutation, useQuery } from '@tanstack/react-query';
import { Advantage } from '@/@types/advantage';
import AdvantageContext from '@/contexts/Advantage';
import { PATH_DASHBOARD } from '@/routes/paths';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ApiAdvantageRepository, {
  CreateAdvantagePayload,
  DeleteAdvantagePayload,
  DeleteManyAdvantagesPayload,
  UpdateAdvantagePayload,
} from '@/apis/apiService/advantage.api';

export type UseAdvantageProps = {
  isLoading: boolean;
  advantages: Advantage[];
  createAdvantage: (payload: CreateAdvantagePayload) => Promise<void>;
  refetchAdvantages: VoidFunction;
  updateAdvantage: (payload: UpdateAdvantagePayload) => Promise<void>;
  deleteAdvantage: (payload: { advantageInput: { _id: number } }) => void;
  deleteManyAdvantages: (payload: DeleteManyAdvantagesPayload) => Promise<void>;
};

export default function useAdvantage(): UseAdvantageProps {
  const { dispatch, state } = useContext(AdvantageContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreateAdvantage, isPending: isCreatingAdvantage } = useMutation({
    mutationFn: (payload: CreateAdvantagePayload) =>
      ApiAdvantageRepository.createAdvantage(payload),

    onError: () => {
      enqueueSnackbar('Không thể tạo ưu điểm!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo ưu điểm thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.advantage.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { refetch: refetchAdvantages, isLoading: isRefreshingAdvantages } = useQuery({
    queryKey: ['fetchAdvantages'],
    queryFn: async () => {
      try {
        console.log('📡 Đang gọi API refetchAdvantages...');
        const data = await ApiAdvantageRepository.fetchAdvantages();
        if (!data.error) {
          dispatch({
            type: 'SET_ADVANTAGES',
            payload: data,
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách ưu điểm!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateAsyncUpdateAdvantage, isPending: isUpdatingAdvantage } = useMutation({
    mutationFn: (payload: UpdateAdvantagePayload) =>
      ApiAdvantageRepository.updateAdvantage(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật ưu điểm!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật ưu điểm thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.advantage.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteAdvantage, isPending: isDeletingAdvantage } = useMutation({
    mutationFn: (payload: DeleteAdvantagePayload) =>
      ApiAdvantageRepository.deleteAdvantage(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa ưu điểm!', {
        variant: 'error',
      });
    },
    onSuccess(data) {
      if (!data.error) {
        dispatch({
          type: 'SET_ADVANTAGES',
          payload: state.advantages.filter(
            (advantage) => advantage.id !== data.data.deleteAdvantage.id,
          ),
        });
        enqueueSnackbar('Xóa ưu điểm thành công!', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });
  const { mutateAsync: mutateAsyncDeleteManyAdvantages, isPending: isDeletingManyAdvantages } =
    useMutation({
      mutationFn: (payload: DeleteManyAdvantagesPayload) =>
        ApiAdvantageRepository.deleteManyAdvantages(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa nhiều ưu điểm!', {
          variant: 'error',
        });
      },
    });

  const createAdvantage = async (payload: CreateAdvantagePayload) => {
    mutateAsyncCreateAdvantage(payload);
  };

  const updateAdvantage = async (payload: UpdateAdvantagePayload) => {
    mutateAsyncUpdateAdvantage(payload);
  };

  const deleteAdvantage = (payload: DeleteAdvantagePayload) => {
    mutateAsyncDeleteAdvantage(payload);
  };

  const deleteManyAdvantages = async (payload: DeleteManyAdvantagesPayload) => {
    const response = await mutateAsyncDeleteManyAdvantages(payload);

    dispatch({
      type: 'SET_ADVANTAGES',
      payload: state.advantages.filter(
        (advantage) => !payload.advantageInput._ids.includes(String(advantage.id)),
      ),
    });
    enqueueSnackbar(response.data.deleteManyAdvantages, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isCreatingAdvantage ||
      isRefreshingAdvantages ||
      isUpdatingAdvantage ||
      isDeletingAdvantage ||
      isDeletingManyAdvantages,
    advantages: state.advantages,
    createAdvantage,
    refetchAdvantages,
    updateAdvantage,
    deleteAdvantage,
    deleteManyAdvantages,
  };
}
