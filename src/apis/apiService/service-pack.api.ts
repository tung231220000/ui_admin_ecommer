import { Attribute, ServicePack } from '@/@types/service-pack';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';

export type CreateServicePackPayload = {
  servicePackInput: {
    prices: string[];
    attributes: Attribute[];
  };
};

type CreateServicePackResponse = {
  data: {
    createServicePack: ServicePack;
  };
} & RESTErrorResponse;

type GetServicePacksResponse = {
  data: {
    servicePacks: ServicePack[];
  };
} & RESTErrorResponse;

export type UpdateServicePackPayload = {
  servicePackInput: {
    _id: string;
    prices: string[];
    attributes: Attribute[];
  };
};

type UpdateServicePackResponse = {
  data: {
    updateServicePack: ServicePack;
  };
} & RESTErrorResponse;

export type DeleteServicePackPayload = {
  servicePackInput: {
    _id: string;
  };
};

type DeleteServicePackResponse = {
  data: {
    deleteServicePack: {
      _id: string;
    };
  };
} & RESTErrorResponse;

export type DeleteManyServicePacksPayload = {
  servicePackInput: {
    _ids: string[];
  };
};

type DeleteManyServicePacksResponse = {
  data: {
    deleteManyServicePacks: string;
  };
} & RESTErrorResponse;

const ApiServicePackRepository = {
  async createServicePack(variables: CreateServicePackPayload): Promise<CreateServicePackResponse> {
    const { data } = await apiBackend.post<CreateServicePackResponse>('/create-service-pack', {
      variables,
    });

    return data;
  },
  async fetchServicePacks(): Promise<GetServicePacksResponse> {
    const { data } = await apiBackend.get<GetServicePacksResponse>('/service-packs', {});

    return data;
  },
  async updateServicePack(variables: UpdateServicePackPayload): Promise<UpdateServicePackResponse> {
    const { data } = await apiBackend.post<UpdateServicePackResponse>('/update-service-pack', {
      variables,
    });

    return data;
  },
  async deleteServicePack(variables: DeleteServicePackPayload): Promise<DeleteServicePackResponse> {
    const { data } = await apiBackend.post<DeleteServicePackResponse>('/delete-service-pack', {
      variables,
    });

    return data;
  },
  async deleteManyServicePacks(
    variables: DeleteManyServicePacksPayload,
  ): Promise<DeleteManyServicePacksResponse> {
    const { data } = await apiBackend.post<DeleteManyServicePacksResponse>(
      '/delete-service-packs',
      {
        variables,
      },
    );

    return data;
  },
};

export default ApiServicePackRepository;
