import { BonusService } from '@/@types/bonus-service';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';

export type CreateBonusServicePayload = {
  bonusServiceInput: BonusService;
};

type CreateBonusServiceResponse = {
  data: {
    createBonusService: BonusService;
  };
} & RESTErrorResponse;

type GetBonusServicesResponse = {
  data: {
    bonusServices: BonusService[];
  };
} & RESTErrorResponse;

export type UpdateBonusServicePayload = {
  bonusServiceInput: BonusService;
};

type UpdateBonusServiceResponse = {
  data: {
    updateBonusService: BonusService;
  };
} & RESTErrorResponse;

export type DeleteBonusServicePayload = {
  bonusServiceInput: {
    _id: string;
  };
};

type DeleteBonusServiceResponse = {
  data: {
    deleteBonusService: BonusService;
  };
} & RESTErrorResponse;

export type DeleteManyBonusServicesPayload = {
  bonusServiceInput: {
    _ids: string[];
  };
};

type DeleteManyBonusServicesResponse = {
  data: {
    deleteManyBonusServices: string;
  };
} & RESTErrorResponse;

const ApiBonusServiceRepository = {
  async createBonusService(
    variables: CreateBonusServicePayload,
  ): Promise<CreateBonusServiceResponse> {
    const { data } = await apiBackend.post<CreateBonusServiceResponse>('/create-bonusService', {
      variables,
    });

    return data;
  },
  async fetchBonusServices(): Promise<GetBonusServicesResponse> {
    const { data } = await apiBackend.get<GetBonusServicesResponse>('/bonusServices', {});

    return data;
  },
  async updateBonusService(
    variables: UpdateBonusServicePayload,
  ): Promise<UpdateBonusServiceResponse> {
    const { data } = await apiBackend.post<UpdateBonusServiceResponse>('/update-bonusService', {
      variables,
    });

    return data;
  },
  async deleteBonusService(
    variables: DeleteBonusServicePayload,
  ): Promise<DeleteBonusServiceResponse> {
    const { data } = await apiBackend.post<DeleteBonusServiceResponse>('/delete-bonusService', {
      variables,
    });

    return data;
  },
  async deleteManyBonusServices(
    variables: DeleteManyBonusServicesPayload,
  ): Promise<DeleteManyBonusServicesResponse> {
    const { data } = await apiBackend.post<DeleteManyBonusServicesResponse>(
      '/delete-bonusServices',
      {
        variables,
      },
    );

    return data;
  },
};

export default ApiBonusServiceRepository;
