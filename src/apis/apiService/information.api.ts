import { Information, InformationVariant } from 'src/@types/information';
import { CustomFile } from 'src/components/upload';
import apiBackend from "@/apis/connection/api-backend";
import {RESTErrorResponse} from "@/@types/api";

type GetInformationResponse = {
  result: Information[];
} & RESTErrorResponse;

export type CreateInformationPayload = {
  page: string;
  title: string;
  subtitle: string;
  description?: string | null;
  variants: InformationVariant[];
  assets?: string[] | null;
};

type CreateInformationResponse = {
  result: Information;
} & RESTErrorResponse;

type GetInformationDetailResponse = {
  result: Information;
} & RESTErrorResponse;

export type UpdateInformationPayload = {
  id: string;
  page: string;
  title: string;
  subtitle: string;
  description?: string | null;
  variants: {
    title?: string | null;
    url?: string | null;
    content?: string | null;
    image?: string | CustomFile | null;
  }[];
  assets?: (string | CustomFile)[] | null;
};

type UpdateInformationResponse = {
  updateInformation: Information;
} & RESTErrorResponse;

export type DeleteInformationPayload = {
  id: number;
};

export type DeleteInformationResponse = {
  result: Information;
} & RESTErrorResponse;

export type DeleteManyInformationPayload = {
  ids: string[];
};

export type DeleteManyInformationResponse = {
  result: string;
} & RESTErrorResponse;

const ApiInformationRepository = {

  async createInformation(variables: CreateInformationPayload): Promise<CreateInformationResponse> {
    const { data } = await apiBackend.post<CreateInformationResponse>('/create-information', {
      variables,
    });

    return data;
  },
  async fetchInformation(): Promise<GetInformationResponse> {
    const { data } = await apiBackend.get<GetInformationResponse>('/information-list', {});

    return data;
  },
  async fetchInformationDetail(variables: string): Promise<GetInformationDetailResponse> {
    const { data } = await apiBackend.get<GetInformationDetailResponse>('/information/detail/' + variables, {});

    return data;
  },
  async updateInformation(variables: UpdateInformationPayload): Promise<UpdateInformationResponse> {
    const { data } = await apiBackend.post<UpdateInformationResponse>('/information/update', {
      variables,
    });

    return data;
  },
  async deleteInformation(variables: DeleteInformationPayload): Promise<DeleteInformationResponse> {
    const { data } = await apiBackend.post<DeleteInformationResponse>('/information/delete', {
      variables,
    });

    return data;
  },
  async deleteManyInformation(
    variables: DeleteManyInformationPayload
  ): Promise<DeleteManyInformationResponse> {
    const { data } = await apiBackend.post<DeleteManyInformationResponse>('/information/deletes', {
      variables,
    });

    return data;
  },
};

export default ApiInformationRepository;