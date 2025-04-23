import { CustomFile } from '@/components/upload';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { Product } from '@/@types/product';
import { PRODUCT_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT } from '@/utils/constant';

export type UploadBannerImagePayload = FormData;

type UploadBannerImageResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreateProductPayload = {
  productInput: {
    key: string;
    banner: CustomFile | string;
    category: string;
    intro: string;
    title: string;
    description: string;
    advantages: string[];
    questionsAndAnswers: string[];
    tags: string[];
    isContact?: boolean;
    servicePacks: string[];
    bonusServices: string[];
  };
};

type CreateProductResponse = {
  data: {
    createProduct: Product;
  };
} & RESTErrorResponse;

type GetProductsResponse = {
  data: {
    products: Product[];
  };
} & RESTErrorResponse;

export type GetProductDetailPayload = {
  getProductDetailInput: {
    key: string;
  };
};

type GetProductDetailResponse = {
  data: {
    productDetail: {
      detail: Product;
      relatedProducts: {
        category: {
          icon: string;
        };
        title: string;
      }[];
    };
  };
} & RESTErrorResponse;

export type UpdateProductPayload = {
  productInput: {
    _id: string;
    key?: string;
    banner?: CustomFile | string;
    category?: string;
    intro?: string;
    title?: string;
    description?: string;
    advantages?: string[];
    questionsAndAnswers?: string[];
    tags?: string[];
    isContact?: boolean;
    servicePacks?: string[];
    bonusServices?: string[];
  };
};

type UpdateProductResponse = {
  data: {
    updateProduct: Product;
  };
} & RESTErrorResponse;

export type DeleteProductPayload = {
  productInput: {
    _id: string;
  };
};

type DeleteProductResponse = {
  data: {
    deleteProduct: Product;
  };
} & RESTErrorResponse;

export type DeleteManyProductsPayload = {
  productInput: {
    _ids: string[];
  };
};

type DeleteManyProductsResponse = {
  data: {
    deleteManyProducts: string;
  };
} & RESTErrorResponse;

const ApiProductRepository = {
  async uploadBannerImage(payload: UploadBannerImagePayload): Promise<UploadBannerImageResponse> {
    const { data } = await apiBackend.post<UploadBannerImageResponse>(
      PRODUCT_SERVICE_UPLOAD_BANNER_IMAGE_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },

  async createProduct(variables: CreateProductPayload): Promise<CreateProductResponse> {
    const { data } = await apiBackend.post<CreateProductResponse>('/create-product', {
      variables,
    });

    return data;
  },
  async fetchProducts(): Promise<GetProductsResponse> {
    const { data } = await apiBackend.post<GetProductsResponse>('/products', {});

    return data;
  },
  async fetchProductDetail(variables: GetProductDetailPayload): Promise<GetProductDetailResponse> {
    const { data } = await apiBackend.get<GetProductDetailResponse>(
      '/product/' + variables.getProductDetailInput.key,
      {},
    );

    return data;
  },
  async updateProduct(variables: UpdateProductPayload): Promise<UpdateProductResponse> {
    const { data } = await apiBackend.post<UpdateProductResponse>('/update-product', {
      variables,
    });

    return data;
  },
  async deleteProduct(variables: DeleteProductPayload): Promise<DeleteProductResponse> {
    const { data } = await apiBackend.post<DeleteProductResponse>('/delete-product', {
      variables,
    });

    return data;
  },
  async deleteManyProducts(
    variables: DeleteManyProductsPayload,
  ): Promise<DeleteManyProductsResponse> {
    const { data } = await apiBackend.post<DeleteManyProductsResponse>('/delete-products', {
      variables,
    });

    return data;
  },
};

export default ApiProductRepository;
