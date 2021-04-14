import { combineReducers } from 'redux';

import terms from 'Components/TermsAndConditions/reducer';
import invite from 'Components/NavBar/Invite/reducer';

export default combineReducers({ terms, invite });
