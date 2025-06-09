import { Information, InformationVariant } from '@/@types/information';
import { CustomFile } from '@/components/upload';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import {
  INFORMATION_SERVICE_UPLOAD_ASSETS_ENDPOINT,
  INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGES_ENDPOINT,
  INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGE_ENDPOINT,
} from '@/utils/constant';

export type UploadAssetsPayload = FormData;

type UploadAssetsResponse = [
  {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  },
] &
  RESTErrorResponse;

export type UploadVariantImagePayload = FormData;

type UploadVariantImageResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type UploadVariantImagesPayload = FormData;

type UploadVariantImagesResponse = [
  {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  },
] &
  RESTErrorResponse;

type GetInformationResponse = Information[] & RESTErrorResponse;

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

type GetInformationDetailResponse = Information & RESTErrorResponse;

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
  async uploadAssets(payload: UploadAssetsPayload): Promise<UploadAssetsResponse> {
    const { data } = await apiBackend.post<UploadAssetsResponse>(
      INFORMATION_SERVICE_UPLOAD_ASSETS_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },
  async uploadVariantImage(
    payload: UploadVariantImagePayload,
  ): Promise<UploadVariantImageResponse> {
    const { data } = await apiBackend.post<UploadVariantImageResponse>(
      INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGE_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },
  async uploadVariantImages(
    payload: UploadVariantImagesPayload,
  ): Promise<UploadVariantImagesResponse> {
    const { data } = await apiBackend.post<UploadVariantImagesResponse>(
      INFORMATION_SERVICE_UPLOAD_VARIANT_IMAGES_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },

  async createInformation(variables: CreateInformationPayload): Promise<CreateInformationResponse> {
    const { data } = await apiBackend.post<CreateInformationResponse>('/create-information', {
      variables,
    });

    return data;
  },
  async fetchInformation(): Promise<GetInformationResponse> {
    const { data } = await apiBackend.get<GetInformationResponse>('/information/list', {});
    return data;
  },
  async fetchInformationDetail(id: number ): Promise<GetInformationDetailResponse> {
    const { data } = await apiBackend.get<GetInformationDetailResponse>(
      '/information/detail?id=' + id,
      {},
    );
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
    variables: DeleteManyInformationPayload,
  ): Promise<DeleteManyInformationResponse> {
    const { data } = await apiBackend.post<DeleteManyInformationResponse>('/information/deletes', {
      variables,
    });

    return data;
  },
};

export default ApiInformationRepository;
