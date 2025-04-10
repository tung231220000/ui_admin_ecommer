import GraphqlAdvantageRepository, {
  CreateAdvantagePayload,
  DeleteAdvantagePayload,
  DeleteManyAdvantagesPayload,
  UpdateAdvantagePayload,
} from 'src/apis/graphql/advantage';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Advantage } from 'src/@types/advantage';
import AdvantageContext from 'src/contexts/Advantage';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

export type UseAdvantageProps = {
  isLoading: boolean;
  advantages: Advantage[];
  createAdvantage: (payload: CreateAdvantagePayload) => Promise<void>;
  refetchAdvantages: VoidFunction;
  updateAdvantage: (payload: UpdateAdvantagePayload) => Promise<void>;
  deleteAdvantage: (payload: DeleteAdvantagePayload) => void;
  deleteManyAdvantages: (payload: DeleteManyAdvantagesPayload) => Promise<void>;
};

export default function useAdvantage(): UseAdvantageProps {
  const { dispatch, state } = useContext(AdvantageContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreateAdvantage, isLoading: isCreatingAdvantage } = useMutation(
    (payload: CreateAdvantagePayload) => GraphqlAdvantageRepository.createAdvantage(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo ưu điểm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo ưu điểm thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.advantage.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { refetch: refetchAdvantages, isLoading: isRefreshingAdvantages } = useQuery(
    ['fetchAdvantages'],
    () => GraphqlAdvantageRepository.fetchAdvantages(),
    {
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy danh sách ưu điểm!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          dispatch({
            type: 'SET_ADVANTAGES',
            payload: data.data.advantages,
          });
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateAdvantage, isLoading: isUpdatingAdvantage } = useMutation(
    (payload: UpdateAdvantagePayload) => GraphqlAdvantageRepository.updateAdvantage(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật ưu điểm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật ưu điểm thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.advantage.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncDeleteAdvantage, isLoading: isDeletingAdvantage } = useMutation(
    (payload: DeleteAdvantagePayload) => GraphqlAdvantageRepository.deleteAdvantage(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa ưu điểm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          dispatch({
            type: 'SET_ADVANTAGES',
            payload: state.advantages.filter(
              (advantage) => advantage._id !== data.data.deleteAdvantage._id
            ),
          });
          enqueueSnackbar('Xóa ưu điểm thành công!', {
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
  const { mutateAsync: mutateAsyncDeleteManyAdvantages, isLoading: isDeletingManyAdvantages } =
    useMutation(
      (payload: DeleteManyAdvantagesPayload) =>
        GraphqlAdvantageRepository.deleteManyAdvantages(payload),
      {
        onError() {
          enqueueSnackbar('Không thể xóa nhiều ưu điểm!', {
            variant: 'error',
          });
        },
      }
    );

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
        (advantage) => !payload.advantageInput._ids.includes(advantage._id)
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
