import {RESTErrorResponse} from "@/@types/api";

export enum Gender {
  MR = 'Ông',
  MRS = 'Bà',
}

export type Role = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  password: string | null;
  name: string;
  surnameAndMiddleName: string;
  phone: string;
  avatar: string;
  address: string | null;
  gender: string | null;
  dateOfBirth: string;
  createAt: string;
  updateAt: string;
  roles: Role[];
};

export type UserMock = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: Role[];
};

export type SignUpPayload = {
  email: string;
  password: string;
  surnameAndMiddleName: string;
  name: string;
  gender: Gender;
  phoneNumber: string;
};

export type SignUpResponse = SignUpPayload & RESTErrorResponse;
