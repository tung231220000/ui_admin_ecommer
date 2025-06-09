import { Advantage } from './advantage';
import { Service } from './service';
import { SolutionCategory } from './solution-category';

export type Solution = {
  _id: string;
  key: string;
  category: SolutionCategory;
  banner: string;
  intro: string;
  title: string;
  description: string;
  advantages: Advantage[];
  services: Service[];
};
