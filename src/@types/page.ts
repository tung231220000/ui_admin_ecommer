import { Information } from './information';
import { Office } from './office';
import { Partner } from './partner';

export type Carousel = {
  title?: string;
  description?: string;
  image: string;
};

export type Page = {
  id: string;
  name: string;
  title: string;
  banner?: string;
  carousel?: Carousel[];
  information?: Information[];
  partners?: Partner[];
  offices?: Office[];
};
