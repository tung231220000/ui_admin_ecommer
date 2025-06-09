import { Dispatch, createContext } from 'react';
import { SolutionCategoryActions, SolutionCategoryState } from '@/@types/solution-category';

export const initialState: SolutionCategoryState = {
  solutionCategories: [],
};

const SolutionCategoryContext = createContext<{
  state: SolutionCategoryState;
  dispatch: Dispatch<SolutionCategoryActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default SolutionCategoryContext;
