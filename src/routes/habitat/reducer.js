import { combineReducers } from 'redux';

import shareModal from 'Components/ShareModal/reducer';
import cards from './components/CardTabs/reducer';
import calendarEvents from './components/CardTabs/Calendar/EventScheduleModals/reducer';
import album from './components/Album/reducer';
import scheduleModal from './components/ScheduleModal/reducer';

import habitatInfo from './reducer/index';

export default combineReducers({
  habitatInfo,
  cards,
  calendarEvents,
  shareModal,
  album,
  scheduleModal,
});
