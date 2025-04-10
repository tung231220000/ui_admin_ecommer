import { CustomFile } from 'src/components/upload';
import apiBackend from "@/apis/connection/api-backend";
import { RESTErrorResponse } from '@/@types/api';
import { Service } from 'src/@types/service';

export type CreateServicePayload = {
  serviceInput: {
    thumbnail: CustomFile | string;
    key: string;
    trademark: string;
  };
};

type CreateServiceResponse = {
  data: {
    createService: Service;
  };
} & RESTErrorResponse;

type GetServicesResponse = {
  data: {
    services: Service[];
  };
} & RESTErrorResponse;

export type GetServiceDetailPayload = {
    _id: string;
};

type GetServiceDetailResponse = {
  data: {
    serviceDetail: Service;
  };
} & RESTErrorResponse;

export type UpdateServicePayload = {
  serviceInput: {
    _id: string;
    thumbnail?: CustomFile | string;
    key?: string;
    trademark?: string;
  };
};

type UpdateServiceResponse = {
  data: {
    updateService: Service;
  };
} & RESTErrorResponse;

export type DeleteServicePayload = {
  serviceInput: {
    _id: string;
  };
};

type DeleteServiceResponse = {
  data: {
    deleteService: Service;
  };
} & RESTErrorResponse;

export type DeleteManyServicesPayload = {
  serviceInput: {
    _ids: string[];
  };
};

type DeleteManyServicesResponse = {
  data: {
    deleteManyServices: string;
  };
} & RESTErrorResponse;

const ServiceApiRepository = {
  async createService(variables: CreateServicePayload): Promise<CreateServiceResponse> {
    const { data } = await apiBackend.post<CreateServiceResponse>('/create-service', {
      variables,
    });

    return data;
  },
  async fetchServices(): Promise<GetServicesResponse> {
    const { data } = await apiBackend.get<GetServicesResponse>('/services', {
    });

    return data;
  },
  async fetchServiceDetail(variables: GetServiceDetailPayload): Promise<GetServiceDetailResponse> {
    const { data } = await apiBackend.get<GetServiceDetailResponse>('/service/' + variables._id, {});
    return data;
  },
  async updateService(variables: UpdateServicePayload): Promise<UpdateServiceResponse> {
    const { data } = await apiBackend.post<UpdateServiceResponse>('/update-service', {
      variables,
    });

    return data;
  },
  async deleteService(variables: DeleteServicePayload): Promise<DeleteServiceResponse> {
    const { data } = await apiBackend.post<DeleteServiceResponse>('/delete-service', {
      variables,
    });

    return data;
  },
  async deleteManyServices(
    variables: DeleteManyServicesPayload
  ): Promise<DeleteManyServicesResponse> {
    const { data } = await apiBackend.post<DeleteManyServicesResponse>('/delete-services', {
      variables,
    });

    return data;
  },
};

export default ServiceApiRepository;
