import { combineReducers } from "redux";
import mainStream from './mainStream';
import user from './user';
import chat from './chat';
import habitat from '../../routes/habitat/reducer';
import plans from './plans';

export default combineReducers({
  mainStream,
  user,
  chat,
  habitat,
  plans,
});
