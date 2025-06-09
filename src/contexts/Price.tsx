import { Dispatch, createContext } from 'react';
import { PriceActions, PriceState } from '@/@types/price';

export const initialState: PriceState = {
  prices: [],
};

const PriceContext = createContext<{
  state: PriceState;
  dispatch: Dispatch<PriceActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default PriceContext;
