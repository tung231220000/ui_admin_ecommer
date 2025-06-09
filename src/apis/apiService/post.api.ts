import { CustomFile } from '@/components/upload';
import apiBackend from '@/apis/connection/api-backend';
import { Post } from '@/@types/post';
import { RESTErrorResponse } from '@/@types/api';
import { POST_SERVICE_UPLOAD_COVER_IMAGE_ENDPOINT } from '@/utils/constant';

export type UploadCoverImagePayload = FormData;

type UploadCoverImageResponse = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
} & RESTErrorResponse;

export type CreatePostPayload = {
  postInput: {
    cover?: CustomFile | string | null | undefined;
    title: string;
    description: string;
    createdAt: Date;
    author: string;
    tags: string[];
    body: string;
  };
};

type CreatePostResponse = {
  data: {
    createPost: Post;
  };
} & RESTErrorResponse;

type GetPostsResponse = {
  data: {
    posts: Post[];
  };
} & RESTErrorResponse;

export type GetPostPayload = {
  id: string;
};

type GetPostResponse = {
  data: {
    post: Post;
  };
} & RESTErrorResponse;

export type UpdatePostPayload = {
  postInput: {
    id: string;
    cover?: CustomFile | string | null | undefined;
    title?: string;
    description?: string;
    createdAt?: Date;
    author?: string;
    tags?: string[];
    body?: string;
  };
};

type UpdatePostResponse = {
  data: {
    updatePost: Post;
  };
} & RESTErrorResponse;

const ApiPostRepository = {
  async createPost(variables: CreatePostPayload): Promise<CreatePostResponse> {
    const { data } = await apiBackend.post<CreatePostResponse>('/post-create', {
      variables,
    });

    return data;
  },
  async fetchPosts(): Promise<GetPostsResponse> {
    const { data } = await apiBackend.get<GetPostsResponse>('/posts', {});

    return data;
  },
  async fetchPost(variables: GetPostPayload): Promise<GetPostResponse> {
    const { data } = await apiBackend.post<GetPostResponse>('/post-detail?id=' + variables.id, {});

    return data;
  },
  async updatePost(variables: UpdatePostPayload): Promise<UpdatePostResponse> {
    const { data } = await apiBackend.post<UpdatePostResponse>('/post/update', {
      variables,
    });

    return data;
  },
  async uploadCoverImage(payload: UploadCoverImagePayload): Promise<UploadCoverImageResponse> {
    const { data } = await apiBackend.post<UploadCoverImageResponse>(
      POST_SERVICE_UPLOAD_COVER_IMAGE_ENDPOINT,
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

export default ApiPostRepository;
