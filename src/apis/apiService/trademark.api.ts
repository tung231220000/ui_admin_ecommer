import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { Trademark } from '@/@types/trademark';
import {COMMON_API, TRADEMARK_SERVICE_UPLOAD_LOGO_ENDPOINT} from '@/utils/constant';
import { CustomFile } from '@/components/upload';

export type UploadLogoPayload = {
  file: CustomFile | string;
};

type UploadLogoResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;
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

type GetTrademarksResponse = Trademark[] & RESTErrorResponse;

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
  async uploadLogo(payload: UploadLogoPayload): Promise<UploadLogoResponse> {
    const { data } = await apiBackend.post<UploadLogoResponse>(
      TRADEMARK_SERVICE_UPLOAD_LOGO_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },
  async createTrademark(variables: CreateTrademarkPayload): Promise<CreateTrademarkResponse> {
    const { data } = await apiBackend.post<CreateTrademarkResponse>('/trademark-new', {
      variables,
    });

    return data;
  },
  async fetchTrademarks(): Promise<GetTrademarksResponse> {
    const { data } = await apiBackend.get<GetTrademarksResponse>(COMMON_API + '/trademarks', {});

    return data;
  },
  async fetchTrademarkDetail(
    variables: GetTrademarkDetailPayload,
  ): Promise<GetTrademarkDetailResponse> {
    const { data } = await apiBackend.get<GetTrademarkDetailResponse>(
      '/trademark-detail/' + variables.id,
    );

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
    variables: DeleteManyTrademarksPayload,
  ): Promise<DeleteManyTrademarksResponse> {
    const { data } = await apiBackend.post<DeleteManyTrademarksResponse>('/trademark-deletes', {
      variables,
    });

    return data;
  },
};

export default ApiTrademarkRepository;
