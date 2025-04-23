import apiBackend from '@/apis/connection/api-backend';
import { RESTErrorResponse } from '@/@types/api';
import { User } from '@/@types/user';

export enum Gender {
  MR = 'Ông',
  MRS = 'Bà',
}

export type SignUpPayload = {
  email: string;
  password: string;
  surnameAndMiddleName: string;
  name: string;
  gender: Gender;
  phoneNumber: string;
};

type SignUpResponse = {
  createUser: User;
} & RESTErrorResponse;

const GraphqlUserModule = {
  async signUp(variables: SignUpPayload): Promise<SignUpResponse> {
    const { data } = await apiBackend.post<SignUpResponse>('/graphql', {
      variables,
    });

    return data;
  },
};

export default GraphqlUserModule;
