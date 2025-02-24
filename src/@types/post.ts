import { UserMock } from './user';

export type Post = {
  id: string;
  cover: string;
  title: string;
  description: string;
  createdAt: Date | string | number;
  views: number;
  favorite: number;
  author?: UserMock;
  tags: string[];
  body: string;
  favoritePerson?: UserMock[];
};
