import { Advantage } from '@/@types/advantage';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import {COMMON_API} from "@/utils/constant";

export type CreateAdvantagePayload = {
  advantageInput: {
    title: string;
    content: string;
  };
};

type CreateAdvantageResponse = {
  data: {
    createAdvantage: Advantage;
  };
} & RESTErrorResponse;

type GetAdvantagesResponse = Advantage[] & RESTErrorResponse;

export type UpdateAdvantagePayload = {
  advantageInput: {
    _id: string;
    title: string;
    content: string;
  };
};

type UpdateAdvantageResponse = {
  data: {
    updateAdvantage: Advantage;
  };
} & RESTErrorResponse;

export type DeleteAdvantagePayload = {
  advantageInput: {
    id: string;
  };
};

type DeleteAdvantageResponse = {
  data: {
    deleteAdvantage: Advantage;
  };
} & RESTErrorResponse;

export type DeleteManyAdvantagesPayload = {
  advantageInput: {
    _ids: string[];
  };
};

type DeleteManyAdvantagesResponse = {
  data: {
    deleteManyAdvantages: string;
  };
} & RESTErrorResponse;

const ApiAdvantageRepository = {
  async createAdvantage(variables: CreateAdvantagePayload): Promise<CreateAdvantageResponse> {
    const { data } = await apiBackend.post<CreateAdvantageResponse>('/create-advantage', {
      variables,
    });

    return data;
  },
  async fetchAdvantages(): Promise<GetAdvantagesResponse> {
    const { data } = await apiBackend.get<GetAdvantagesResponse>(COMMON_API + '/advantages', {});

    return data;
  },
  async updateAdvantage(variables: UpdateAdvantagePayload): Promise<UpdateAdvantageResponse> {
    const { data } = await apiBackend.post<UpdateAdvantageResponse>('/update-advantage', {
      variables,
    });

    return data;
  },
  async deleteAdvantage(variables: DeleteAdvantagePayload): Promise<DeleteAdvantageResponse> {
    const { data } = await apiBackend.post<DeleteAdvantageResponse>('/delete-advantage', {
      variables,
    });

    return data;
  },
  async deleteManyAdvantages(
    variables: DeleteManyAdvantagesPayload,
  ): Promise<DeleteManyAdvantagesResponse> {
    const { data } = await apiBackend.post<DeleteManyAdvantagesResponse>('/delete-advantages', {
      variables,
    });

    return data;
  },
};

export default ApiAdvantageRepository;
