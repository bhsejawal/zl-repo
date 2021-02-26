import { SET_PLANS } from './types';

// eslint-disable-next-line import/prefer-default-export
export const setPlans = (plans) => ({
  type: SET_PLANS,
  payload: { plans },
});
