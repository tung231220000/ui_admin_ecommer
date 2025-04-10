import { Advantage } from 'src/@types/advantage';
import apiBackend from "@/apis/connection/api-backend";
import { RESTErrorResponse } from '@/@types/api';


export type CreateAdvantagePayload = {
  advantageInput: {
    title: string;
    content: string;
  };
};

type CreateAdvantageResponse = {
  data: {
    createAdvantage: Advantage;
  };
} & GraphQLErrorResponse;

type GetAdvantagesResponse = {
  data: {
    advantages: Advantage[];
  };
} & GraphQLErrorResponse;

export type UpdateAdvantagePayload = {
  advantageInput: {
    _id: string;
    title: string;
    content: string;
  };
};

type UpdateAdvantageResponse = {
  data: {
    updateAdvantage: Advantage;
  };
} & GraphQLErrorResponse;

export type DeleteAdvantagePayload = {
  advantageInput: {
    _id: string;
  };
};

type DeleteAdvantageResponse = {
  data: {
    deleteAdvantage: Advantage;
  };
} & GraphQLErrorResponse;

export type DeleteManyAdvantagesPayload = {
  advantageInput: {
    _ids: string[];
  };
};

type DeleteManyAdvantagesResponse = {
  data: {
    deleteManyAdvantages: string;
  };
} & GraphQLErrorResponse;

const GraphqlAdvantageRepository = {
  async createAdvantage(variables: CreateAdvantagePayload): Promise<CreateAdvantageResponse> {
    const { data } = await DTSTelecomBackendAPI.post<CreateAdvantageResponse>('/graphql', {
      query: CREATE_ADVANTAGE_MUTATION,
      variables,
    });

    return data;
  },
  async fetchAdvantages(): Promise<GetAdvantagesResponse> {
    const { data } = await DTSTelecomBackendAPI.post<GetAdvantagesResponse>('/graphql', {
      query: GET_ADVANTAGES_QUERY,
    });

    return data;
  },
  async updateAdvantage(variables: UpdateAdvantagePayload): Promise<UpdateAdvantageResponse> {
    const { data } = await DTSTelecomBackendAPI.post<UpdateAdvantageResponse>('/graphql', {
      query: UPDATE_ADVANTAGE_MUTATION,
      variables,
    });

    return data;
  },
  async deleteAdvantage(variables: DeleteAdvantagePayload): Promise<DeleteAdvantageResponse> {
    const { data } = await DTSTelecomBackendAPI.post<DeleteAdvantageResponse>('/graphql', {
      query: DELETE_ADVANTAGE_MUTATION,
      variables,
    });

    return data;
  },
  async deleteManyAdvantages(
    variables: DeleteManyAdvantagesPayload
  ): Promise<DeleteManyAdvantagesResponse> {
    const { data } = await DTSTelecomBackendAPI.post<DeleteManyAdvantagesResponse>('/graphql', {
      query: DELETE_MANY_ADVANTAGES_MUTATION,
      variables,
    });

    return data;
  },
};

export default GraphqlAdvantageRepository;
