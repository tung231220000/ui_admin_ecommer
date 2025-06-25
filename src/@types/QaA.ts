export type QaA = {
  id?: number;
  question: string;
  answer: string;
};

export type QaAState = {
  QaAs: QaA[];
};

export type SetQaAs = {
  type: 'SET_QaAS';
  payload: QaA[];
};

export type QaAActions = SetQaAs;
