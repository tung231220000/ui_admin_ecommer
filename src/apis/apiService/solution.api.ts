import { CustomFile } from '@/components/upload';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { Solution } from '@/@types/solution';
import { SOLUTION_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT } from '@/utils/constant';

export type UploadBannerImagePayload = FormData;

type UploadBannerImageResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreateSolutionPayload = {
  solutionInput: {
    key: string;
    category: string;
    banner: CustomFile | string;
    intro: string;
    title: string;
    description: string;
    advantages?: string[];
    services: string[];
  };
};

type CreateSolutionResponse = {
  data: {
    createSolution: Solution;
  };
} & RESTErrorResponse;

type GetSolutionsResponse = {
  data: {
    solutions: Solution[];
  };
} & RESTErrorResponse;

export type GetSolutionDetailPayload = {
  solutionInput: {
    key: string;
  };
};

type GetSolutionDetailResponse = {
  data: {
    solutionDetail: Solution;
  };
} & RESTErrorResponse;

export type UpdateSolutionPayload = {
  solutionInput: {
    _id: string;
    key?: string;
    category?: string;
    banner?: CustomFile | string;
    intro?: string;
    title?: string;
    description?: string;
    advantages?: string[];
    services?: string[];
  };
};

type UpdateSolutionResponse = {
  data: {
    updateSolution: Solution;
  };
} & RESTErrorResponse;

export type DeleteSolutionPayload = {
  solutionInput: {
    _id: string;
  };
};

type DeleteSolutionResponse = {
  data: {
    deleteSolution: Solution;
  };
} & RESTErrorResponse;

export type DeleteManySolutionsPayload = {
  solutionInput: {
    _ids: string[];
  };
};

type DeleteManySolutionsResponse = {
  data: {
    deleteManySolutions: string;
  };
} & RESTErrorResponse;

const ApiSolutionRepository = {
  async uploadBannerImage(payload: UploadBannerImagePayload): Promise<UploadBannerImageResponse> {
    const { data } = await apiBackend.post<UploadBannerImageResponse>(
      SOLUTION_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },

  async createSolution(variables: CreateSolutionPayload): Promise<CreateSolutionResponse> {
    const { data } = await apiBackend.post<CreateSolutionResponse>('/create-solution', {
      variables,
    });

    return data;
  },
  async fetchSolutions(): Promise<GetSolutionsResponse> {
    const { data } = await apiBackend.get<GetSolutionsResponse>('/solutions', {});

    return data;
  },
  async fetchSolutionDetail(
    variables: GetSolutionDetailPayload,
  ): Promise<GetSolutionDetailResponse> {
    const { data } = await apiBackend.get<GetSolutionDetailResponse>(
      '/solution/' + variables.solutionInput.key,
      {},
    );

    return data;
  },
  async updateSolution(variables: UpdateSolutionPayload): Promise<UpdateSolutionResponse> {
    const { data } = await apiBackend.post<UpdateSolutionResponse>('/update-solution', {
      variables,
    });

    return data;
  },
  async deleteSolution(variables: DeleteSolutionPayload): Promise<DeleteSolutionResponse> {
    const { data } = await apiBackend.post<DeleteSolutionResponse>('/delete-solution', {
      variables,
    });

    return data;
  },
  async deleteManySolutions(
    variables: DeleteManySolutionsPayload,
  ): Promise<DeleteManySolutionsResponse> {
    const { data } = await apiBackend.post<DeleteManySolutionsResponse>('/delete-solutions', {
      variables,
    });

    return data;
  },
};

export default ApiSolutionRepository;
