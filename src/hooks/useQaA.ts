import ApiQaARepository, {
  CreateQaAPayload,
  DeleteManyQaAsPayload,
  DeleteQaAPayload,
  UpdateQaAPayload,
} from '@/apis/apiService/QaA.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { PATH_DASHBOARD } from '@/routes/paths';
import { QaA } from '@/@types/QaA';
import QaAContext from '@/contexts/QaA';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export type UseQaAProps = {
  isLoading: boolean;
  QaAs: QaA[];
  createQaA: (payload: CreateQaAPayload) => Promise<void>;
  refetchQaAs: VoidFunction;
  updateQaA: (payload: UpdateQaAPayload) => Promise<void>;
  deleteQaA: (payload: { questionAndAnswerInput: { _id: string } }) => void;
  deleteManyQaAs: (payload: DeleteManyQaAsPayload) => Promise<void>;
};

export default function useQaA(): UseQaAProps {
  const { dispatch, state } = useContext(QaAContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {mutateAsync: mutateAsyncCreateQaA, isPending: isCreatingQaA} = useMutation({
    mutationFn: (payload: CreateQaAPayload) => ApiQaARepository.createQaA(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo câu hỏi thường gặp!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo câu hỏi thường gặp thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.QaA.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  const {refetch: refetchQaAs, isLoading: isRefreshingQaAs} = useQuery({
    queryKey: ['fetchQaAs'],
    queryFn: async () => {
      try {
        const data = await ApiQaARepository.fetchQaAs();
        console.log("📡 Data từ API:", data);
        if (!data.error) {
          dispatch({
            type: 'SET_QaAS',
            payload: data,
          });
          return data;
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Không thể lấy danh sách câu hỏi thường gặp!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: mutateAsyncUpdateQaA, isPending: isUpdatingQaA } = useMutation({
    mutationFn: (payload: UpdateQaAPayload) => ApiQaARepository.updateQaA(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật câu hỏi thường gặp!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật câu hỏi thường gặp thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.QaA.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    }
  });
  const {mutateAsync: mutateAsyncDeleteQaA, isPending: isDeletingQaA} = useMutation({
      mutationFn: (payload: DeleteQaAPayload) => ApiQaARepository.deleteQaA(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          dispatch({
            type: 'SET_QaAS',
            payload: state.QaAs.filter((QaA) => QaA.id !== data.data.deleteQuestionAndAnswer.id),
          });
          enqueueSnackbar('Xóa câu hỏi thường gặp thành công!', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const {mutateAsync: mutateAsyncDeleteManyQaAs, isPending: isDeletingManyQaAs} = useMutation({
      mutationFn: (payload: DeleteManyQaAsPayload) => ApiQaARepository.deleteManyQaAs(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa nhiều câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
    }
  );

  const createQaA = async (payload: CreateQaAPayload) => {
    await mutateAsyncCreateQaA(payload);
  };

  const updateQaA = async (payload: UpdateQaAPayload) => {
    await mutateAsyncUpdateQaA(payload);
  };

  const deleteQaA = (payload: DeleteQaAPayload) => {
    mutateAsyncDeleteQaA(payload);
  };

  const deleteManyQaAs = async (payload: DeleteManyQaAsPayload) => {
    const response = await mutateAsyncDeleteManyQaAs(payload);

    dispatch({
      type: 'SET_QaAS',
      payload: state.QaAs.filter((QaA) => QaA.id && !payload.questionAndAnswerInput._ids.includes(String(QaA.id))),
    });
    enqueueSnackbar(response.data.deleteManyQuestionsAndAnswers, {
      variant: 'success',
    });
  };


  return {
    isLoading:
      isCreatingQaA || isRefreshingQaAs || isUpdatingQaA || isDeletingQaA || isDeletingManyQaAs,
    QaAs: state.QaAs,
    createQaA,
    refetchQaAs,
    updateQaA,
    deleteQaA,
    deleteManyQaAs,
  };
}
