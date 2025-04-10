import { Dispatch, createContext } from 'react';
import { QaAActions, QaAState } from '@/@types/QaA';

export const initialState: QaAState = {
  QaAs: [],
};

const QaAContext = createContext<{
  state: QaAState;
  dispatch: Dispatch<QaAActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default QaAContext;
