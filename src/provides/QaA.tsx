import { FC, ReactNode, useReducer } from 'react';
import { QaAActions, QaAState } from '@/@types/QaA';
import QaAContext, { initialState } from '@/contexts/QaA';

type Props = {
  children: ReactNode;
};

const reducer = (state: QaAState, action: QaAActions): QaAState => {
  switch (action.type) {
    case 'SET_QaAS':
      return {
        ...state,
        QaAs: action.payload,
      };
    default:
      return state;
  }
};

const QaAProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <QaAContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </QaAContext.Provider>
  );
};

export default QaAProvider;
