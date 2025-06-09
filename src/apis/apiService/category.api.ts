import { CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT } from '@/utils/constant';
import { CustomFile } from '@/components/upload';
import apiBackend from "@/apis/connection/api-backend";
import { RESTErrorResponse } from '@/@types/api';
import { Category } from '@/@types/category';
export type UploadIconPayload = {
  file: CustomFile | string;
};

 export type UploadIconResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreateCategoryPayload = {
  categoryInput: {
    icon: string;
    title: string;
  };
};

export type CreateCategoryResponse = {
  data: {
    createCategory: Category;
  };
} & RESTErrorResponse;

type GetCategoriesResponse = {
  data: {
    categories: Category[];
  };
} & RESTErrorResponse;

export type UpdateCategoryPayload = {
  categoryInput: {
    _id: string;
    icon: string;
    title: string;
  };
};

export type UpdateCategoryResponse = {
  data: {
    updateCategory: Category;
  };
} & RESTErrorResponse;

export type DeleteCategoryPayload = {
  categoryInput: {
    _id: string;
  };
};

type DeleteCategoryResponse = {
  data: {
    deleteCategory: Category;
  };
} & RESTErrorResponse;

export type DeleteManyCategoriesPayload = {
  categoryInput: {
    _ids: string[];
  };
};

type DeleteManyCategoriesResponse = {
  data: {
    deleteManyCategories: string;
  };
} & RESTErrorResponse;

const CategoryRepository = {
  async uploadIcon(payload: UploadIconPayload): Promise<UploadIconResponse> {
    const { data } = await apiBackend.post<UploadIconResponse>(
      CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  async createCategory(variables: CreateCategoryPayload): Promise<CreateCategoryResponse> {
    const { data } = await apiBackend.post<CreateCategoryResponse>('/create-post', {
      variables,
    });

    return data;
  },
  async fetchCategories(): Promise<GetCategoriesResponse> {
    const { data } = await apiBackend.get<GetCategoriesResponse>('/category', {
    });

    return data;
  },
  async updateCategory(variables: UpdateCategoryPayload): Promise<UpdateCategoryResponse> {
    const { data } = await apiBackend.post<UpdateCategoryResponse>('/update-category', {
      variables,
    });

    return data;
  },
  async deleteCategory(variables: DeleteCategoryPayload): Promise<DeleteCategoryResponse> {
    const { data } = await apiBackend.post<DeleteCategoryResponse>('/delete-category', {
      variables,
    });

    return data;
  },
  async deleteManyCategories(
    variables: DeleteManyCategoriesPayload
  ): Promise<DeleteManyCategoriesResponse> {
    const { data } = await apiBackend.post<DeleteManyCategoriesResponse>('/delete-categorys', {
      variables,
    });

    return data;
  },
};

export default CategoryRepository;
