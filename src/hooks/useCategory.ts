import CategoryRepository, {
  CreateCategoryPayload,
  CreateCategoryResponse,
  DeleteCategoryPayload,
  DeleteManyCategoriesPayload,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
  UploadIconPayload,
  UploadIconResponse
} from '@/apis/apiService/category.api';
import {useMutation, useQuery} from '@tanstack/react-query';

import {Category} from '@/@types/category';
import CategoryContext from '@/contexts/Category';
import {CustomFile} from '@/components/upload';
import {PATH_DASHBOARD} from '@/routes/paths';
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {AxiosError} from "axios";
import {RESTErrorResponse} from "@/@types/api";
import {API_DOMAIN} from "@/utils/constant";

export type UseCategoryProps = {
  isLoading: boolean;
  categories: Category[];
  createCategory: (payload: { file: CustomFile | string; title: string }) => void;
  refetchCategories: VoidFunction;
  updateCategory: (payload: { _id: string; file: CustomFile | string; title: string }) => void;
  deleteCategory: (_id: number) => void;
  deleteManyCategories: (_ids: string[]) => void;
};

export default function useCategory(): UseCategoryProps {
  const {dispatch, state} = useContext(CategoryContext);

  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const {
    mutateAsync: mutateAsyncUploadIcon,
    isPending: isUploadingIcon
  } = useMutation<UploadIconResponse, AxiosError<RESTErrorResponse>, UploadIconPayload>({
    mutationFn: (payload: UploadIconPayload) => CategoryRepository.uploadIcon(payload),
    onError: () => {
      enqueueSnackbar('Không thể upload icon!', {
        variant: 'error',
      });
    }
  });


  const {
    mutateAsync: mutateAsyncCreateCategory,
    isPending: isCreatingCategory
  } = useMutation<CreateCategoryResponse, AxiosError<RESTErrorResponse>, CreateCategoryPayload>({
    mutationFn: (payload: CreateCategoryPayload) => CategoryRepository.createCategory(payload),
    onError: () => {
      enqueueSnackbar('Không thể tạo danh mục sản phẩm!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Tạo danh mục sản phẩm thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.category.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    }
  })

  const {refetch: refetchCategories, isLoading: isRefreshingCategories} = useQuery({
    queryKey: ['fetchCategories'],
    queryFn: async () => {
      try {
        const data = await CategoryRepository.fetchCategories();
        if (!data.error) {
          dispatch({
            type: 'SET_CATEGORIES',
            payload: data,
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: 'error',
          });
        }
      } catch (error) {
        enqueueSnackbar('Không thể lấy danh sách danh mục!', {
          variant: 'error',
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: mutateAsyncUpdateCategory,
    isPending: isUpdatingCategory
  } = useMutation<UpdateCategoryResponse, AxiosError<RESTErrorResponse>, UpdateCategoryPayload>({
    mutationFn: (payload: UpdateCategoryPayload) => CategoryRepository.updateCategory(payload),
    onError: () => {
      enqueueSnackbar('Không thể cập nhật danh mục sản phẩm!', {
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data.error) {
        enqueueSnackbar('Cập nhật danh mục sản phẩm thành công!', {
          variant: 'success',
        });
        navigate(PATH_DASHBOARD.category.list);
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        });
      }
    },
  });

  const {mutateAsync: mutateAsyncDeleteCategory, isPending: isDeletingCategory} = useMutation({
    mutationFn: (payload: DeleteCategoryPayload) => CategoryRepository.deleteCategory(payload),
      onError() {
        enqueueSnackbar('Không thể xóa danh mục sản phẩm!', {
          variant: 'error',
        });
      },
      onSuccess(data) {
        if (!data.error) {
          dispatch({
            type: 'SET_CATEGORIES',
            payload: state.categories.filter(
              (category) => category.id !== data.data.deleteCategory.id
            ),
          });
          enqueueSnackbar('Xóa danh mục sản phẩm thành công!', {
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
  const {mutateAsync: mutateAsyncDeleteManyCategories, isPending: isDeletingManyCategories} =
    useMutation({
        mutationFn: (payload: DeleteManyCategoriesPayload) =>
          CategoryRepository.deleteManyCategories(payload),
        onError: () => {
          enqueueSnackbar('Không thể xóa nhiều danh mục sản phẩm!', {
            variant: 'error',
          });
        },
    });

  const createCategory = async (payload: { file: CustomFile | string; title: string }) => {
    const {file, title} = payload;
    const response = await mutateAsyncUploadIcon({file});

    const pl = {
      categoryInput: {
        icon: `${API_DOMAIN}/${response.path}`,
        title,
      },
    };
    mutateAsyncCreateCategory(pl);
  };

  const updateCategory = async (payload: {
    _id: string;
    file: CustomFile | string;
    title: string;
  }) => {
    const {_id, file, title} = payload;
    if (typeof file === 'string') {
      const pl = {
        categoryInput: {
          _id,
          icon: file,
          title,
        },
      };
      mutateAsyncUpdateCategory(pl);
    } else {
      const response = await mutateAsyncUploadIcon({file});

      const pl = {
        categoryInput: {
          _id,
          icon: `${API_DOMAIN}/${response.path}`,
          title,
        },
      };
      mutateAsyncUpdateCategory(pl);
    }
  };

  const deleteCategory = (_id: string) => {
    const pl = {
      categoryInput: {
        _id,
      },
    };
    mutateAsyncDeleteCategory(pl);
  };

  const deleteManyCategories = async (_ids: string[]) => {
    const pl = {
      categoryInput: {
        _ids,
      },
    };
    const response = await mutateAsyncDeleteManyCategories(pl);

    dispatch({
      type: 'SET_CATEGORIES',
      payload: state.categories.filter( (category) => category.id && !_ids.includes(String(category.id))),
    });
    enqueueSnackbar(response.data.deleteManyCategories, {
      variant: 'success',
    });
  };

  return {
    isLoading:
      isUploadingIcon ||
      isCreatingCategory ||
      isRefreshingCategories ||
      isUpdatingCategory ||
      isDeletingCategory ||
      isDeletingManyCategories,
    categories: state.categories,
    createCategory,
    refetchCategories,
    updateCategory,
    deleteCategory,
    deleteManyCategories,
  };
}
