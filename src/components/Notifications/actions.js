import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './types';

export const addNotification = (payload) => ({ type: ADD_NOTIFICATION, payload });

export const removeNotification = (id) => ({ type: REMOVE_NOTIFICATION, payload: { id } });
