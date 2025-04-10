import GraphqlQaARepository, {
  CreateQaAPayload,
  DeleteManyQaAsPayload,
  DeleteQaAPayload,
  UpdateQaAPayload,
} from 'src/apis/graphql/QaA';
import { useMutation, useQuery } from '@tanstack/react-query';

import { PATH_DASHBOARD } from 'src/routes/paths';
import { QaA } from 'src/@types/QaA';
import QaAContext from 'src/contexts/QaA';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

export type UseQaAProps = {
  isLoading: boolean;
  QaAs: QaA[];
  createQaA: (payload: CreateQaAPayload) => Promise<void>;
  refetchQaAs: VoidFunction;
  updateQaA: (payload: UpdateQaAPayload) => Promise<void>;
  deleteQaA: (payload: DeleteQaAPayload) => void;
  deleteManyQaAs: (payload: DeleteManyQaAsPayload) => Promise<void>;
};

export default function useQaA(): UseQaAProps {
  const { dispatch, state } = useContext(QaAContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncCreateQaA, isLoading: isCreatingQaA } = useMutation(
    (payload: CreateQaAPayload) => GraphqlQaARepository.createQaA(payload),
    {
      onError() {
        enqueueSnackbar('Không thể tạo câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Tạo câu hỏi thường gặp thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.QaA.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { refetch: refetchQaAs, isLoading: isRefreshingQaAs } = useQuery(
    ['fetchQaAs'],
    () => GraphqlQaARepository.fetchQaAs(),
    {
      refetchOnWindowFocus: false,
      onError() {
        enqueueSnackbar('Không thể lấy danh sách câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.errors) {
          dispatch({
            type: 'SET_QaAS',
            payload: data.data.questionsAndAnswers,
          });
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncUpdateQaA, isLoading: isUpdatingQaA } = useMutation(
    (payload: UpdateQaAPayload) => GraphqlQaARepository.updateQaA(payload),
    {
      onError() {
        enqueueSnackbar('Không thể cập nhật câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          enqueueSnackbar('Cập nhật câu hỏi thường gặp thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.QaA.list);
        } else {
          enqueueSnackbar(data.errors[0].message, {
            variant: 'error',
          });
        }
      },
    }
  );
  const { mutateAsync: mutateAsyncDeleteQaA, isLoading: isDeletingQaA } = useMutation(
    (payload: DeleteQaAPayload) => GraphqlQaARepository.deleteQaA(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.errors) {
          dispatch({
            type: 'SET_QaAS',
            payload: state.QaAs.filter((QaA) => QaA._id !== data.data.deleteQuestionAndAnswer._id),
          });
          enqueueSnackbar('Xóa câu hỏi thường gặp thành công!', {
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
  const { mutateAsync: mutateAsyncDeleteManyQaAs, isLoading: isDeletingManyQaAs } = useMutation(
    (payload: DeleteManyQaAsPayload) => GraphqlQaARepository.deleteManyQaAs(payload),
    {
      onError() {
        enqueueSnackbar('Không thể xóa nhiều câu hỏi thường gặp!', {
          variant: 'error',
        });
      },
    }
  );

  const createQaA = async (payload: CreateQaAPayload) => {
    mutateAsyncCreateQaA(payload);
  };

  const updateQaA = async (payload: UpdateQaAPayload) => {
    mutateAsyncUpdateQaA(payload);
  };

  const deleteQaA = (payload: DeleteQaAPayload) => {
    mutateAsyncDeleteQaA(payload);
  };

  const deleteManyQaAs = async (payload: DeleteManyQaAsPayload) => {
    const response = await mutateAsyncDeleteManyQaAs(payload);

    dispatch({
      type: 'SET_QaAS',
      payload: state.QaAs.filter((QaA) => !payload.questionAndAnswerInput._ids.includes(QaA._id)),
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
