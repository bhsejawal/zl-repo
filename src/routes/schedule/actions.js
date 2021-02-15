import {
  SET_DATE_FILTER,
  SET_ANIMAL_FILTER,
  SET_ZOO_FILTER,
  SET_TIME_FILTER,
  TOGGLE_ANIMAL_FILTER,
  TOGGLE_DATE_FILTER,
  TOGGLE_ZOO_FILTER,
  TOGGLE_TIME_FILTER,
  SET_FILTER_OPTIONS,
} from './types';

export const setDateFilter = (date) => ({
  type: SET_DATE_FILTER,
  payload: { date },
});

export const setAnimalFilter = (animals) => ({
  type: SET_ANIMAL_FILTER,
  payload: { animals },
});

export const setZooFilter = (zoos) => ({
  type: SET_ZOO_FILTER,
  payload: { zoos },
});

export const setTimeFilter = (startTime, endTime) => ({
  type: SET_TIME_FILTER,
  payload: { startTime, endTime },
});

export const setFilterOptions = ({ animals, zoos, dates }) => ({
  type: SET_FILTER_OPTIONS,
  payload: { animals, zoos, dates },
});

export const toggleAnimalFilter = () => ({ type: TOGGLE_ANIMAL_FILTER });
export const toggleDateFilter = () => ({ type: TOGGLE_DATE_FILTER });
export const toggleZooFilter = () => ({ type: TOGGLE_ZOO_FILTER });
export const toggleTimeFilter = () => ({ type: TOGGLE_TIME_FILTER });
