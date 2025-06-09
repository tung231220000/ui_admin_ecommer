import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { Partner } from '@/@types/partner';
import { PARTNER_SERVICE_UPLOAD_LOGO_ENDPOINT } from '@/utils/constant';
import { CustomFile } from '@/components/upload';

export type UploadLogoPayload = {
  file: CustomFile | string;
};

type UploadLogoResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreatePartnerPayload = {
  partnerInput: {
    name: string;
    logo: string;
  };
};

type CreatePartnerResponse = {
  data: {
    createAdvantage: Partner;
  };
} & RESTErrorResponse;

type GetPartnersResponse = {
  partners: Partner[];
} & RESTErrorResponse;

export type GetPartnerDetailPayload = {
  id: string;
};

type GetPartnerDetailResponse = {
  data: {
    partnerDetail: Partner;
  };
} & RESTErrorResponse;

export type UpdatePartnerPayload = {
  partnerInput: Partner;
};

type UpdatePartnerResponse = {
  data: {
    updatePartner: Partner;
  };
} & RESTErrorResponse;

export type DeletePartnerPayload = {
  id: string;
};

export type DeletePartnerResponse = {
  deletePartner: Partner;
} & RESTErrorResponse;

export type DeleteManyPartnersPayload = {
  ids: string[];
};

export type DeleteManyPartnersResponse = {
  deleteManyPartners: string;
} & RESTErrorResponse;

const ApiPartnerRepository = {
  async uploadLogo(payload: UploadLogoPayload): Promise<UploadLogoResponse> {
    const { data } = await apiBackend.post<UploadLogoResponse>(
      PARTNER_SERVICE_UPLOAD_LOGO_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  },

  async createPartner(variables: CreatePartnerPayload): Promise<CreatePartnerResponse> {
    const { data } = await apiBackend.post<CreatePartnerResponse>('/partner-create', {
      variables,
    });

    return data;
  },
  async fetchPartners(): Promise<GetPartnersResponse> {
    const { data } = await apiBackend.get<GetPartnersResponse>('/partners', {});

    return data;
  },
  async fetchPartnerDetail(variables: GetPartnerDetailPayload): Promise<GetPartnerDetailResponse> {
    const { data } = await apiBackend.get<GetPartnerDetailResponse>('/partner/' + variables.id, {});

    return data;
  },
  async updatePartner(variables: UpdatePartnerPayload): Promise<UpdatePartnerResponse> {
    const { data } = await apiBackend.post<UpdatePartnerResponse>('/partner-edit', {
      variables,
    });

    return data;
  },
  async deletePartner(variables: DeletePartnerPayload): Promise<DeletePartnerResponse> {
    const { data } = await apiBackend.post<DeletePartnerResponse>('/partner-delete', {
      variables,
    });

    return data;
  },
  async deleteManyPartners(
    variables: DeleteManyPartnersPayload,
  ): Promise<DeleteManyPartnersResponse> {
    const { data } = await apiBackend.post<DeleteManyPartnersResponse>('/partner-deletes', {
      variables,
    });

    return data;
  },
};

export default ApiPartnerRepository;
