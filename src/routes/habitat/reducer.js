import { combineReducers } from 'redux';

import cards from './components/CardTabs/reducer';
import habitatInfo from './reducer/index';

export default combineReducers({ habitatInfo, cards });
