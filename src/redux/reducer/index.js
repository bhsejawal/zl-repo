import { combineReducers } from "redux";

import allHabitats from './allHabitats';
import mainStream from './mainStream';
import user from './user';
import chat from './chat';
import modals from './modals';
import habitat from '../../routes/habitat/reducer';
import plans from './plans';
import schedule from '../../routes/schedule/reducer';
import map from '../../routes/map/reducer';
import passwordReset from '../../routes/login/ResetModal/reducer';
import notifications from '../../components/Notifications/reducer';
import scheduleEvents from '../../components/ScheduleEvents/reducer';

export default combineReducers({
  allHabitats,
  mainStream,
  user,
  chat,
  habitat,
  plans,
  map,
  schedule,
  passwordReset,
  modals,
  notifications,
  scheduleEvents,
});
