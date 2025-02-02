import { CustomFile } from 'src/components/upload';
import apiBackend from "@/apis/connection/api-backend";
// import { GraphQLErrorResponse } from 'src/@types/api';
import { Page } from 'src/@types/page';
import {RESTErrorResponse} from "@/@types/api";

type GetPagesResponse = {
  // data: {
    pages: Page[];
  // };
} & RESTErrorResponse;

export type GetPageDataPayload = {
  pageInput: {
    name: string;
  };
};

type GetPageDataResponse = {
  // data: {
    getPageData: Page;
  // };
} & RESTErrorResponse;

export type UpdatePagePayload = {
  pageInput: {
    name: string;
    title: string;
    banner?: string | CustomFile | null;
    carousel?: {
      title?: string;
      description?: string;
      image: string | CustomFile;
    }[];
  };
};

type UpdatePageResponse = {
  data: {
    updatePage: Page;
  };
} & RESTErrorResponse;

const ApiPageRepository = {
  async fetchPages(): Promise<GetPagesResponse> {
    const { data } = await apiBackend.post<GetPagesResponse>('/pages', {
      // query: RESTErrorResponse,
    });

    return data;
  },
  async fetchPageData(variables: GetPageDataPayload): Promise<GetPageDataResponse> {
    const { data } = await apiBackend.post<GetPageDataResponse>('/page', {
      // query: RESTErrorResponse,
      variables,
    });

    return data;
  },
  async updatePage(variables: UpdatePagePayload): Promise<UpdatePageResponse> {
    const { data } = await apiBackend.post<UpdatePageResponse>('/graphql', variables);

    return data;
  },
};

export default ApiPageRepository;
