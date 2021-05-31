import { combineReducers } from 'redux';

import cards from './components/CardTabs/reducer';
import calendarEvents from './components/CardTabs/Calendar/EventScheduleModals/reducer';
import shareModal from './components/ShareModal/reducer';
import album from './components/Album/reducer';

import habitatInfo from './reducer/index';

export default combineReducers({
  habitatInfo,
  cards,
  calendarEvents,
  shareModal,
  album,
});
