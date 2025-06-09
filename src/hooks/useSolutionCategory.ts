import SolutionCategoryRepository, {
  CreateSolutionCategoryPayload,
  DeleteManySolutionCategoriesPayload,
  DeleteSolutionCategoryPayload,
  UpdateSolutionCategoryPayload,
  UploadIconPayload,
} from '@/apis/apiService/solution-category.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { CustomFile } from '@/components/upload';
import { API_DOMAIN } from '@/utils/constant';
import { PATH_DASHBOARD } from '@/routes/paths';
import { SolutionCategory } from '@/@types/solution-category';
import SolutionCategoryContext from '@/contexts/SolutionCategory';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export type UseCategoryProps = {
  isLoading: boolean;
  solutionCategories: SolutionCategory[];
  createSolutionCategory: (payload: { file: CustomFile | string; title: string }) => void;
  refetchSolutionCategories: VoidFunction;
  updateSolutionCategory: (payload: {
    _id: string;
    file: CustomFile | string;
    title: string;
  }) => void;
  deleteSolutionCategory: (_id: string) => void;
  deleteManySolutionCategories: (_ids: string[]) => void;
};

export default function useSolutionCategory(): UseCategoryProps {
  const { dispatch, state } = useContext(SolutionCategoryContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: mutateAsyncUploadIcon, isPending: isUploadingIcon } = useMutation({
    mutationFn: (payload: UploadIconPayload) => SolutionCategoryRepository.uploadIcon(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload icon!', {
        variant: 'error',
      });
    },
  });
  const { mutateAsync: mutateAsyncCreateSolutionCategory, isPending: isCreatingSolutionCategory } =
    useMutation({
      mutationFn: (payload: CreateSolutionCategoryPayload) =>
        SolutionCategoryRepository.createSolutionCategory(payload),
      onError: () => {
        enqueueSnackbar('Không thể tạo danh mục giải pháp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          enqueueSnackbar('Tạo danh mục giải pháp thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.solutionCategory.list);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { refetch: refetchSolutionCategories, isLoading: isRefreshingSolutionCategories } =
    useQuery({
      queryKey: ['fetchSolutionCategories'],
      queryFn: async () => {
        try {
          const data = await SolutionCategoryRepository.fetchSolutionCategories();
          if (!data.error) {
            dispatch({
              type: 'SET_SOLUTION_CATEGORIES',
              payload: data.data.solutionCategories,
            });
          } else {
            enqueueSnackbar(data.message, {
              variant: 'error',
            });
          }
        } catch (e) {
          enqueueSnackbar('Không thể lấy danh sách danh mục giải pháp!', {
            variant: 'error',
          });
        }
      },
      refetchOnWindowFocus: false,
    });
  const { mutateAsync: mutateAsyncUpdateSolutionCategory, isPending: isUpdatingSolutionCategory } =
    useMutation({
      mutationFn: (payload: UpdateSolutionCategoryPayload) =>
        SolutionCategoryRepository.updateSolutionCategory(payload),
      onError: () => {
        enqueueSnackbar('Không thể cập nhật danh mục giải pháp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          enqueueSnackbar('Cập nhật danh mục giải pháp thành công!', {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.solutionCategory.list);
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const { mutateAsync: mutateAsyncDeleteSolutionCategory, isPending: isDeletingSolutionCategory } =
    useMutation({
      mutationFn: (payload: DeleteSolutionCategoryPayload) =>
        SolutionCategoryRepository.deleteSolutionCategory(payload),
      onError: () => {
        enqueueSnackbar('Không thể xóa danh mục giải pháp!', {
          variant: 'error',
        });
      },
      onSuccess: (data) => {
        if (!data.error) {
          dispatch({
            type: 'SET_SOLUTION_CATEGORIES',
            payload: state.solutionCategories.filter(
              (category) => category._id !== data.data.deleteSolutionCategory._id,
            ),
          });
          enqueueSnackbar('Xóa danh mục giải pháp thành công!', {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      },
    });
  const {
    mutateAsync: mutateAsyncDeleteManySolutionCategories,
    isPending: isDeletingManySolutionCategories,
  } = useMutation({
    mutationFn: (payload: DeleteManySolutionCategoriesPayload) =>
      SolutionCategoryRepository.deleteManySolutionCategories(payload),
    onError: () => {
      enqueueSnackbar('Không thể xóa nhiều danh mục giải pháp!', {
        variant: 'error',
      });
    },
  });

  const createSolutionCategory = async (payload: { file: CustomFile | string; title: string }) => {
    const { file, title } = payload;
    const response = await mutateAsyncUploadIcon({ file });

    const pl = {
      solutionCategoryInput: {
        icon: `${API_DOMAIN}/${response.path}`,
        title,
      },
    };
    await mutateAsyncCreateSolutionCategory(pl);
  };

  const updateSolutionCategory = async (payload: {
    _id: string;
    file: CustomFile | string;
    title: string;
  }) => {
    const { _id, file, title } = payload;
    if (typeof file === 'string') {
      const pl = {
        solutionCategoryInput: {
          _id,
          icon: file,
          title,
        },
      };
      await mutateAsyncUpdateSolutionCategory(pl);
    } else {
      const response = await mutateAsyncUploadIcon({ file });

      const pl = {
        solutionCategoryInput: {
          _id,
          icon: `${API_DOMAIN}/${response.path}`,
          title,
        },
      };
      await mutateAsyncUpdateSolutionCategory(pl);
    }
  };

  const deleteSolutionCategory = (_id: string) => {
    const pl = {
      solutionCategoryInput: {
        _id,
      },
    };
    mutateAsyncDeleteSolutionCategory(pl);
  };

  const deleteManySolutionCategories = async (_ids: string[]) => {
    const pl = {
      solutionCategoryInput: {
        _ids,
      },
    };
    const response = await mutateAsyncDeleteManySolutionCategories(pl);

    dispatch({
      type: 'SET_SOLUTION_CATEGORIES',
      payload: state.solutionCategories.filter((category) => category._id && !_ids.includes(category._id)),
    });
    enqueueSnackbar(response.data.deleteManySolutionCategories, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isUploadingIcon ||
      isCreatingSolutionCategory ||
      isRefreshingSolutionCategories ||
      isUpdatingSolutionCategory ||
      isDeletingSolutionCategory ||
      isDeletingManySolutionCategories,
    solutionCategories: state.solutionCategories,
    createSolutionCategory,
    refetchSolutionCategories,
    updateSolutionCategory,
    deleteSolutionCategory,
    deleteManySolutionCategories,
  };
}
