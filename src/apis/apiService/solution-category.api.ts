import { CustomFile } from '@/components/upload';
import { RESTErrorResponse } from '@/@types/api';
import apiBackend from '@/apis/connection/api-backend';
import { SOLUTION_CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT } from '@/utils/constant';
import { SolutionCategory } from '@/@types/solution-category';

export type UploadIconPayload = {
  file: CustomFile | string;
};

type UploadIconResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreateSolutionCategoryPayload = {
  solutionCategoryInput: {
    icon: string;
    title: string;
  };
};

type CreateSolutionCategoryResponse = {
  data: {
    createSolutionCategory: SolutionCategory;
  };
} & RESTErrorResponse;

type GetSolutionCategoriesResponse = {
  data: {
    solutionCategories: SolutionCategory[];
  };
} & RESTErrorResponse;

export type UpdateSolutionCategoryPayload = {
  solutionCategoryInput: {
    _id: string;
    icon: string;
    title: string;
  };
};

type UpdateSolutionCategoryResponse = {
  data: {
    updateSolutionCategory: SolutionCategory;
  };
} & RESTErrorResponse;

export type DeleteSolutionCategoryPayload = {
  solutionCategoryInput: {
    _id: string;
  };
};

type DeleteSolutionCategoryResponse = {
  data: {
    deleteSolutionCategory: SolutionCategory;
  };
} & RESTErrorResponse;

export type DeleteManySolutionCategoriesPayload = {
  solutionCategoryInput: {
    _ids: string[];
  };
};

type DeleteManySolutionCategoriesResponse = {
  data: {
    deleteManySolutionCategories: string;
  };
} & RESTErrorResponse;

const SolutionCategoryRepository = {
  async uploadIcon(payload: UploadIconPayload): Promise<UploadIconResponse> {
    const { data } = await apiBackend.post<UploadIconResponse>(
      SOLUTION_CATEGORY_SERVICE_UPLOAD_ICON_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },

  async createSolutionCategory(
    variables: CreateSolutionCategoryPayload,
  ): Promise<CreateSolutionCategoryResponse> {
    const { data } = await apiBackend.post<CreateSolutionCategoryResponse>(
      '/create-solution-category',
      {
        variables,
      },
    );

    return data;
  },
  async fetchSolutionCategories(): Promise<GetSolutionCategoriesResponse> {
    const { data } = await apiBackend.get<GetSolutionCategoriesResponse>('/solution-categorys', {});

    return data;
  },
  async updateSolutionCategory(
    variables: UpdateSolutionCategoryPayload,
  ): Promise<UpdateSolutionCategoryResponse> {
    const { data } = await apiBackend.post<UpdateSolutionCategoryResponse>(
      '/update-solution-category',
      {
        variables,
      },
    );

    return data;
  },
  async deleteSolutionCategory(
    variables: DeleteSolutionCategoryPayload,
  ): Promise<DeleteSolutionCategoryResponse> {
    const { data } = await apiBackend.post<DeleteSolutionCategoryResponse>(
      '/delete-solution-category',
      {
        variables,
      },
    );

    return data;
  },
  async deleteManySolutionCategories(
    variables: DeleteManySolutionCategoriesPayload,
  ): Promise<DeleteManySolutionCategoriesResponse> {
    const { data } = await apiBackend.post<DeleteManySolutionCategoriesResponse>(
      '/update-solution-categorys',
      {
        variables,
      },
    );

    return data;
  },
};

export default SolutionCategoryRepository;
