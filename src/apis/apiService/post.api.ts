import { CustomFile } from 'src/components/upload';
import apiBackend from "@/apis/connection/api-backend";
import { Post } from 'src/@types/post';
import {RESTErrorResponse} from "@/@types/api";


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
    const { data } = await apiBackend.get<GetPostsResponse>('/posts', {
    });

    return data;
  },
  async fetchPost(variables: GetPostPayload): Promise<GetPostResponse> {
    const { data } = await apiBackend.post<GetPostResponse>('/post-detail?id=' + variables.id, {
    });

    return data;
  },
  async updatePost(variables: UpdatePostPayload): Promise<UpdatePostResponse> {
    const { data } = await apiBackend.post<UpdatePostResponse>('/post/update', {
      variables,
    });

    return data;
  },
};

export default ApiPostRepository;
