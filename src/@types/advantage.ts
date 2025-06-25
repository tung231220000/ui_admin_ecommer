export type Advantage = {
  id: number;
  title: string;
  content: string;
};

export type AdvantageState = {
  advantages: Advantage[];
};

export type SetAdvantages = {
  type: 'SET_ADVANTAGES';
  payload: Advantage[];
};

export type AdvantageActions = SetAdvantages;
