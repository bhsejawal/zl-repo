import { combineReducers } from 'redux';

import shareModal from 'Components/ShareModal/reducer';
import cards from './components/CardTabs/reducer';
import calendarEvents from './components/CardTabs/Calendar/EventScheduleModals/reducer';
import album from './components/Album/reducer';
import schedulesTab from './components/Schedules/reducer';
import scheduleModal from './components/ScheduleModal/reducer';
import CameraControlModal from './components/CameraControlModal/reducer';

import habitatInfo from './reducer/index';

export default combineReducers({
  habitatInfo,
  cards,
  calendarEvents,
  shareModal,
  album,
  schedulesTab,
  scheduleModal,
  CameraControlModal,
});
