import { Currency, Price, TimeUnit } from '@/@types/price';
import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';

export type CreatePricePayload = {
  priceInput: {
    name: string;
    defaultPrice: number;
    salePrice: number | null;
    currency: Currency;
    unit: TimeUnit;
  };
};

type CreatePriceResponse = {
  data: {
    createPrice: Price;
  };
} & RESTErrorResponse;

type GetPricesResponse = {
  data: {
    prices: Price[];
  };
} & RESTErrorResponse;

export type UpdatePricePayload = {
  priceInput: Price;
};

type UpdatePriceResponse = {
  data: {
    updatePrice: Price;
  };
} & RESTErrorResponse;

export type DeletePricePayload = {
  priceInput: {
    _id: string;
  };
};

type DeletePriceResponse = {
  data: {
    deletePrice: Price;
  };
} & RESTErrorResponse;

export type DeleteManyPricesPayload = {
  priceInput: {
    _ids: string[];
  };
};

type DeleteManyPricesResponse = {
  data: {
    deleteManyPrices: string;
  };
} & RESTErrorResponse;

const ApiPriceRepository = {
  async createPrice(variables: CreatePricePayload): Promise<CreatePriceResponse> {
    const { data } = await apiBackend.post<CreatePriceResponse>('/create-price', {
      variables,
    });

    return data;
  },
  async fetchPrices(): Promise<GetPricesResponse> {
    const { data } = await apiBackend.get<GetPricesResponse>('/prices', {});

    return data;
  },
  async updatePrice(variables: UpdatePricePayload): Promise<UpdatePriceResponse> {
    const { data } = await apiBackend.post<UpdatePriceResponse>('/update-price', {
      variables,
    });

    return data;
  },
  async deletePrice(variables: DeletePricePayload): Promise<DeletePriceResponse> {
    const { data } = await apiBackend.post<DeletePriceResponse>('/delete-price', {
      variables,
    });

    return data;
  },
  async deleteManyPrices(variables: DeleteManyPricesPayload): Promise<DeleteManyPricesResponse> {
    const { data } = await apiBackend.post<DeleteManyPricesResponse>('/delete-prices', {
      variables,
    });

    return data;
  },
};

export default ApiPriceRepository;
