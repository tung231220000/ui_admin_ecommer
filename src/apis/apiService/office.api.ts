import apiBackend from "@/apis/connection/api-backend";
import {RESTErrorResponse} from "@/@types/api";
import { Office } from '@/@types/office';


export type CreateOfficePayload = {
  officeInput: {
    name: string;
    hotline: string;
    fax: string;
    address: string;
    email: string;
  };
};

type CreateOfficeResponse = {
  data: {
    createOffice: Office;
  };
} & RESTErrorResponse;

type GetOfficesResponse = {
  offices: Office[];
} & RESTErrorResponse;

export type GetOfficeDetailPayload = {
    id: string;
};

type GetOfficeDetailResponse = {
  data: {
    officeDetail: Office;
  };
} & RESTErrorResponse;

export type UpdateOfficePayload = {
  officeInput: Office;
};

type UpdateOfficeResponse = {
  data: {
    updateOffice: Office;
  };
} & RESTErrorResponse;

export type DeleteOfficePayload = {
  id: string;
};

type DeleteOfficeResponse = {
  deleteOffice: Office;
} & RESTErrorResponse;

export type DeleteManyOfficesPayload = {
  ids: string[];
};

type DeleteManyOfficesResponse = {
  deleteManyOffices: string;
} & RESTErrorResponse;

const ApiOfficeRepository = {
  async createOffice(variables: CreateOfficePayload): Promise<CreateOfficeResponse> {
    const { data } = await apiBackend.post<CreateOfficeResponse>('/create-office', {
      variables,
    });

    return data;
  },
  async fetchOffices(): Promise<GetOfficesResponse> {
    const { data } = await apiBackend.get<GetOfficesResponse>('/offices', {
    });

    return data;
  },
  async fetchOfficeDetail(variables: GetOfficeDetailPayload): Promise<GetOfficeDetailResponse> {
    const { data } = await apiBackend.get<GetOfficeDetailResponse>('/office-detail/' + variables.id, {
    });

    return data;
  },
  async updateOffice(variables: UpdateOfficePayload): Promise<UpdateOfficeResponse> {
    const { data } = await apiBackend.post<UpdateOfficeResponse>('/office-update', {
      variables,
    });

    return data;
  },
  async deleteOffice(variables: DeleteOfficePayload): Promise<DeleteOfficeResponse> {
    const { data } = await apiBackend.post<DeleteOfficeResponse>('/office-delete', {
      variables,
    });

    return data;
  },
  async deleteManyOffices(variables: DeleteManyOfficesPayload): Promise<DeleteManyOfficesResponse> {
    const { data } = await apiBackend.post<DeleteManyOfficesResponse>('/office-deletes', {
      variables,
    });

    return data;
  },
};

export default ApiOfficeRepository;
