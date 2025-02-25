import apiBackend from "@/apis/connection/api-backend";
import { RESTErrorResponse } from "@/@types/api";
import {Trademark} from "@/@types/trademark";

export type CreateTrademarkPayload = {
  trademarkInput: {
    name: string;
    logo: string;
  };
};

type CreateTrademarkResponse = {
  data: {
    createTrademark: Trademark;
  };
} & RESTErrorResponse;

type GetTrademarksResponse = {
  trademarks: Trademark[];
} & RESTErrorResponse;

export type GetTrademarkDetailPayload = {
  id: string;
};

type GetTrademarkDetailResponse = {
  data: {
    trademarkDetail: Trademark;
  };
} & RESTErrorResponse;

export type UpdateTrademarkPayload = {
  trademarkInput: Trademark;
};

type UpdateTrademarkResponse = {
  data: {
    updateTrademark: Trademark;
  };
} & RESTErrorResponse;

export type DeleteTrademarkPayload = {
  id: string;
};

export type DeleteTrademarkResponse = {
  deleteTrademark: Trademark;
} & RESTErrorResponse;

export type DeleteManyTrademarksPayload = {
  ids: string[];
};

export type DeleteManyTrademarksResponse = {
  deleteManyTrademarks: string;
} & RESTErrorResponse;

const ApiTrademarkRepository = {
  async createTrademark(variables: CreateTrademarkPayload): Promise<CreateTrademarkResponse> {
    const { data } = await apiBackend.post<CreateTrademarkResponse>('/trademark-new', {
      variables,
    });

    return data;
  },
  async fetchTrademarks(): Promise<GetTrademarksResponse> {
    const { data } = await apiBackend.get<GetTrademarksResponse>('/trademarks', {
    });

    return data;
  },
  async fetchTrademarkDetail(
    variables: GetTrademarkDetailPayload
  ): Promise<GetTrademarkDetailResponse> {
    const { data } = await apiBackend.get<GetTrademarkDetailResponse>('/trademark-detail/' + variables.id)

    return data;
  },
  async updateTrademark(variables: UpdateTrademarkPayload): Promise<UpdateTrademarkResponse> {
    const { data } = await apiBackend.post<UpdateTrademarkResponse>('/trademark-update', {
      variables,
    });

    return data;
  },
  async deleteTrademark(variables: DeleteTrademarkPayload): Promise<DeleteTrademarkResponse> {
    const { data } = await apiBackend.post<DeleteTrademarkResponse>('/trademark-delete', {
      variables,
    });

    return data;
  },
  async deleteManyTrademarks(
    variables: DeleteManyTrademarksPayload
  ): Promise<DeleteManyTrademarksResponse> {
    const { data } = await apiBackend.post<DeleteManyTrademarksResponse>('/trademark-deletes', {
      variables,
    });

    return data;
  },
};

export default ApiTrademarkRepository;
