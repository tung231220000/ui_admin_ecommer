// import { Information } from './information';
import { Office } from './office';
import {date} from "yup";
import * as timers from "node:timers";
// import { Partner } from './partner';

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
  carousels?: Carousel[];
  // information?: Information[];
  // partners?: Partner[];
  offices?: Office[];
  updatedDatetime: Date;
  createDatetime: Date;

};
