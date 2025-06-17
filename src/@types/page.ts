// import { Information } from './information';
import { Office } from './office';

// import { Partner } from './partner';

export type Carousel = {
  id: number;
  pageId: number;
  title?: string;
  description?: string;
  image: string;
};

export type Page = {
  pageId: number;
  name: string;
  title: string;
  banner?: string;
  carousels?: Carousel[];
  // information?: Information[];
  // partners?: Partner[];
  offices?: Office[];
  updatedDatetime?: Date;
  createdDatetime?: Date;
};
