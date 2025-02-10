import { CustomFile } from 'src/components/upload';
import apiBackend from "@/apis/connection/api-backend";
// import { GraphQLErrorResponse } from 'src/@types/api';
import { Page } from 'src/@types/page';
import {RESTErrorResponse} from "@/@types/api";
import {AxiosResponse} from "axios";

type GetPagesResponse = Page[];

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
    try {
      const response = await apiBackend.get<GetPagesResponse>('/pages', { });
      // const response: AxiosResponse<GetPagesResponse>  = await apiBackend.get('/pages');
      return response.data;
    } catch (error: any){
      // Nếu server trả về lỗi (có response)
      if (error.response) {
        const errorData: RESTErrorResponse = error.response.data;
        throw new Error(`${errorData.statusCode}: ${errorData.message}`);
      }

      // Nếu lỗi do mạng hoặc server không phản hồi
      throw new Error("Network error or server is unreachable");
    }
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
