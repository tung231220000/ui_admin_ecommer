import { CustomFile } from '@/components/upload';
import apiBackend from '@/apis/connection/api-backend';
import { Page } from '@/@types/page';
import { RESTErrorResponse } from '@/@types/api';
import {
  COMMON_API,
  PAGE_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT,
  PAGE_SERVICE_UPLOAD_CAROUSEL_IMAGE_ENDPOINT,
} from '@/utils/constant';

export type UploadBannerImagePayload = FormData;
type GetPagesResponse = Page[];

export type GetPageDataPayload = {
  name: string;
};

export type UploadBannerImageResponse = {
  fieldName: string;
  originalName: string;
  // encoding: string;
  mimetype: string;
  destination: string;
  fileName: string;
  url: string;
  size: number;
} & RESTErrorResponse;

export type UploadCarouselImagePayload = FormData;

type UploadCarouselImageResponse = {
  fieldName: string;
  originalName: string;
  mimetype: string;
  destination: string;
  fileName: string;
  url: string;
  size: number;
} & RESTErrorResponse;

type GetPageDataResponse = {
  result: Page;
} & RESTErrorResponse;

export type UpdatePagePayload = {
  pageId?: number;
  name: string;
  title: string;
  banner?: string | CustomFile | null;
  carousel?: {
    pageId?: number;
    title?: string;
    description?: string;
    image: string | CustomFile;
  }[];
};

type UpdatePageResponse = {
  updatePage: Page;
} & RESTErrorResponse;

const ApiPageRepository = {
  async fetchPages(): Promise<GetPagesResponse> {
    try {
      const response = await apiBackend.get<GetPagesResponse>(COMMON_API + '/pages', {});
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData: RESTErrorResponse = error.response.data;
        throw new Error(`${errorData.statusCode}: ${errorData.message}`);
      }

      // if errop internet or error connect
      throw new Error('Network error or server is unreachable');
    }
  },
  async fetchPageData(variables: string): Promise<GetPageDataResponse> {
    const { data } = await apiBackend.get<GetPageDataResponse>(COMMON_API + '/page?name=' + variables, {});
    console.log('data fetch value: ', variables);
    return data;
  },
  async updatePage(variables: UpdatePagePayload): Promise<UpdatePageResponse> {
    const { data } = await apiBackend.post<UpdatePageResponse>(COMMON_API + '/page/edit', variables);

    return data;
  },
  async uploadBannerImage(payload: UploadBannerImagePayload): Promise<UploadBannerImageResponse> {
    const { data } = await apiBackend.post<UploadBannerImageResponse>(
      PAGE_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },
  async uploadCarouselImage(
    payload: UploadCarouselImagePayload,
  ): Promise<UploadCarouselImageResponse> {
    const { data } = await apiBackend.post<UploadCarouselImageResponse>(
      PAGE_SERVICE_UPLOAD_CAROUSEL_IMAGE_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },
};

export default ApiPageRepository;
