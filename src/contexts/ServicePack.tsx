import { Dispatch, createContext } from 'react';
import { ServicePackActions, ServicePackState } from '@/@types/service-pack';

export const initialState: ServicePackState = {
  servicePacks: [],
};

const ServicePackContext = createContext<{
  state: ServicePackState;
  dispatch: Dispatch<ServicePackActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default ServicePackContext;
