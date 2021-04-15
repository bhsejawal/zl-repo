import { combineReducers } from 'redux';

import terms from 'Components/TermsAndConditions/reducer';
import invite from 'Components/NavBar/Invite/reducer';
import contactus from 'Components/modals/ContactUs/reducer';

export default combineReducers({ terms, invite, contactus });
